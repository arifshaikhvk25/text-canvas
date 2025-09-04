"use client";

import React, { useState, useRef, useEffect } from "react";
import { Stage, Layer, Rect, Circle, Transformer } from "react-konva";
// import { io } from "socket.io-client";
import socket from "@/lib/socketClient";

// const socket = io("http://localhost:5000"); // change when deploying

export default function CanvasBoard() {
  const [shapes, setShapes] = useState([]);
  const [shapeType, setShapeType] = useState("rect");
  const [isDrawing, setIsDrawing] = useState(false);
  const [previewShape, setPreviewShape] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const transformerRef = useRef();
  const stageRef = useRef();

  // Keep transformer updated
  useEffect(() => {
    const transformer = transformerRef.current;
    if (transformer && selectedId) {
      const selectedNode = stageRef.current.findOne(`#${selectedId}`);
      if (selectedNode) {
        transformer.nodes([selectedNode]);
        transformer.getLayer().batchDraw();
      }
    } else if (transformer) {
      transformer.nodes([]);
      transformer.getLayer().batchDraw();
    }
  }, [selectedId]);

  // Handle remote shapes
  useEffect(() => {
    socket.on("remote-shape", (shape) => {
      setShapes((prev) => [...prev, shape]);
    });
    return () => socket.off("remote-shape");
  }, []);

  // Mouse down → start drawing
  const handleMouseDown = (e) => {
    if (e.target !== e.target.getStage()) return;
    const pos = e.target.getStage().getPointerPosition();
    setIsDrawing(true);
    setPreviewShape({
      id: `shape-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      type: shapeType,
      x: pos.x,
      y: pos.y,
      width: 0,
      height: 0,
      radius: 0,
    });
  };

  // Mouse move → update preview shape
  const handleMouseMove = (e) => {
    if (!isDrawing || !previewShape) return;
    const pos = e.target.getStage().getPointerPosition();
    const dx = pos.x - previewShape.x;
    const dy = pos.y - previewShape.y;

    if (previewShape.type === "rect") {
      setPreviewShape({ ...previewShape, width: dx, height: dy });
    } else if (previewShape.type === "circle") {
      const radius = Math.sqrt(dx * dx + dy * dy); // ✅ smooth circle like my version
      setPreviewShape({ ...previewShape, radius });
    }
  };

  // Mouse up → save final shape
  const handleMouseUp = () => {
    if (previewShape) {
      setShapes((prev) => [...prev, previewShape]);
      socket.emit("draw-shape", previewShape);
    }
    setIsDrawing(false);
    setPreviewShape(null);
  };

  // Select shape
  const handleSelect = (id) => {
    setSelectedId(id);
  };

  // Clear canvas (local + notify others)
  const clearCanvas = () => {
    setShapes([]);
    setSelectedId(null);
    socket.emit("clear-canvas"); // ✅ notify backend
  };

  // Listen for remote clear
  useEffect(() => {
    socket.on("remote-clear", () => {
      setShapes([]);
      setSelectedId(null);
    });

    return () => socket.off("remote-clear");
  }, []);

  return (
    <div className="flex flex-col items-center space-y-2">
      <div className="flex space-x-2">
        <button
          onClick={() => setShapeType("rect")}
          className={`px-3 py-1 rounded ${
            shapeType === "rect"
              ? "bg-blue-700 text-white"
              : "bg-blue-500 text-white opacity-70"
          }`}
        >
          Rectangle
        </button>

        <button
          onClick={() => setShapeType("circle")}
          className={`px-3 py-1 rounded ${
            shapeType === "circle"
              ? "bg-green-700 text-white"
              : "bg-green-500 text-white opacity-70"
          }`}
        >
          Circle
        </button>

        <button
          onClick={clearCanvas}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Clear Canvas
        </button>
      </div>

      <Stage
        width={800}
        height={500}
        ref={stageRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        className="border rounded shadow bg-white"
      >
        <Layer>
          {shapes.map((shape) =>
            shape.type === "rect" ? (
              <Rect
                key={shape.id}
                id={shape.id}
                x={shape.x}
                y={shape.y}
                width={shape.width}
                height={shape.height}
                fill="lightblue"
                stroke="blue"
                strokeWidth={2}
                draggable
                onClick={() => handleSelect(shape.id)}
              />
            ) : (
              <Circle
                key={shape.id}
                id={shape.id}
                x={shape.x}
                y={shape.y}
                radius={shape.radius}
                fill="lightgreen"
                stroke="green"
                strokeWidth={2}
                draggable
                onClick={() => handleSelect(shape.id)}
              />
            )
          )}
          {previewShape &&
            (previewShape.type === "rect" ? (
              <Rect
                x={previewShape.x}
                y={previewShape.y}
                width={previewShape.width}
                height={previewShape.height}
                fill="lightblue"
                opacity={0.5}
              />
            ) : (
              <Circle
                x={previewShape.x}
                y={previewShape.y}
                radius={previewShape.radius}
                fill="lightgreen"
                opacity={0.5}
              />
            ))}
          <Transformer ref={transformerRef} />
        </Layer>
      </Stage>
    </div>
  );
}
