"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { Stage, Layer, Rect, Circle, Transformer } from "react-konva";

export default function CanvasBoard() {
  const [shapes, setShapes] = useState([]);
  const [shapeType, setShapeType] = useState("rect");
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState(null);
  const [previewShape, setPreviewShape] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const containerRef = useRef(null);
  const transformerRef = useRef(null);
  const stageRef = useRef(null);

  // Make canvas responsive
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        setCanvasSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  // Update transformer when selection changes
  useEffect(() => {
    if (!transformerRef.current || !selectedId) return;

    const stage = transformerRef.current.getStage();
    const selectedNode = stage.findOne(`#${selectedId}`);

    if (selectedNode) {
      transformerRef.current.nodes([selectedNode]);
    } else {
      transformerRef.current.nodes([]);
    }

    transformerRef.current.getLayer().batchDraw();
  }, [selectedId]);

  const handleMouseDown = useCallback((e) => {
    // Deselect if clicked on empty area
    if (e.target === e.target.getStage()) {
      setSelectedId(null);
      const stage = e.target.getStage();
      const pointer = stage.getPointerPosition();
      setStartPos(pointer);
      setIsDrawing(true);
      return;
    }

    // Select if clicked on a shape
    if (e.target.attrs.id) {
      setSelectedId(e.target.attrs.id);
    } else {
      setSelectedId(null);
    }
  }, []);

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDrawing || !startPos) return;

      const stage = e.target.getStage();
      const pointer = stage.getPointerPosition();

      const width = pointer.x - startPos.x;
      const height = pointer.y - startPos.y;

      const absWidth = Math.abs(width);
      const absHeight = Math.abs(height);

      const newX = width < 0 ? pointer.x : startPos.x;
      const newY = height < 0 ? pointer.y : startPos.y;

      setPreviewShape({
        type: shapeType,
        x: newX,
        y: newY,
        width: absWidth,
        height: absHeight,
        radius:
          shapeType === "circle"
            ? Math.max(
                5,
                Math.sqrt(absWidth * absWidth + absHeight * absHeight) / 2
              )
            : 0,
      });
    },
    [isDrawing, startPos, shapeType]
  );

  const handleMouseUp = useCallback(() => {
    if (!isDrawing || !previewShape) return;

    // Finalize shape
    const newShape = {
      id: `shape-${Date.now()}`,
      type: previewShape.type,
      x: previewShape.x,
      y: previewShape.y,
      width: previewShape.width,
      height: previewShape.height,
      radius: previewShape.radius,
    };

    setShapes((prev) => [...prev, newShape]);
    setIsDrawing(false);
    setStartPos(null);
    setPreviewShape(null);
  }, [isDrawing, previewShape]);

  const handleDragEnd = useCallback((e, id) => {
    const { x, y } = e.target.position();
    setShapes((prev) => prev.map((s) => (s.id === id ? { ...s, x, y } : s)));
  }, []);

  const handleTransformEnd = useCallback((e, id) => {
    const node = e.target;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    setShapes((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              x: node.x(),
              y: node.y(),
              width:
                s.type === "rect"
                  ? Math.max(5, node.width() * scaleX)
                  : s.width,
              height:
                s.type === "rect"
                  ? Math.max(5, node.height() * scaleY)
                  : s.height,
              radius:
                s.type === "circle"
                  ? Math.max(5, node.radius() * scaleX)
                  : s.radius,
            }
          : s
      )
    );

    node.scaleX(1);
    node.scaleY(1);
  }, []);

  return (
    <div className="w-full h-screen bg-gray-100 flex flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="flex gap-4 p-4 bg-white shadow-sm">
        <button
          onClick={() => setShapeType("rect")}
          className={`px-4 py-2 rounded ${
            shapeType === "rect" ? "bg-blue-500 text-white" : "bg-white border"
          }`}
        >
          Rectangle
        </button>
        <button
          onClick={() => setShapeType("circle")}
          className={`px-4 py-2 rounded ${
            shapeType === "circle"
              ? "bg-green-500 text-white"
              : "bg-white border"
          }`}
        >
          Circle
        </button>
        <button
          onClick={() => {
            setShapes([]);
            setSelectedId(null); // 👈 reset selection too
            if (transformerRef.current) {
              transformerRef.current.nodes([]); // 👈 detach transformer
              transformerRef.current.getLayer()?.batchDraw();
            }
          }}
          className="px-4 py-2 rounded bg-white border"
        >
          Clear Canvas
        </button>
      </div>

      {/* Canvas */}
      <div ref={containerRef} className="flex-1 relative">
        <Stage
          ref={stageRef}
          width={canvasSize.width}
          height={canvasSize.height}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          className="absolute inset-0"
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
                  fill="rgba(135, 206, 235, 0.7)"
                  stroke="skyblue"
                  strokeWidth={2}
                  draggable
                  shadowBlur={5}
                  cornerRadius={8}
                  onDragEnd={(e) => handleDragEnd(e, shape.id)}
                  onTransformEnd={(e) => handleTransformEnd(e, shape.id)}
                />
              ) : (
                <Circle
                  key={shape.id}
                  id={shape.id}
                  // Render at center
                  x={shape.x + shape.width / 2}
                  y={shape.y + shape.height / 2}
                  radius={Math.max(1, shape.radius)}
                  fill="rgba(144, 238, 144, 0.7)"
                  stroke="lightgreen"
                  strokeWidth={2}
                  draggable
                  shadowBlur={5}
                  onDragEnd={(e) => {
                    const node = e.target;
                    setShapes((prev) =>
                      prev.map((s) =>
                        s.id === shape.id
                          ? {
                              ...s,
                              // store top-left coords when dropped
                              x: node.x() - s.width / 2,
                              y: node.y() - s.height / 2,
                            }
                          : s
                      )
                    );
                  }}
                  onTransformEnd={(e) => handleTransformEnd(e, shape.id)}
                />
              )
            )}

            {/* Drawing preview */}
            {previewShape && shapeType === "rect" && (
              <Rect
                x={previewShape.x}
                y={previewShape.y}
                width={previewShape.width}
                height={previewShape.height}
                fill="rgba(135, 206, 235, 0.3)"
                stroke="skyblue"
                strokeWidth={2}
                dash={[5, 5]}
              />
            )}
            {previewShape && shapeType === "circle" && (
              <Circle
                x={previewShape.x + previewShape.width / 2}
                y={previewShape.y + previewShape.height / 2}
                radius={Math.max(1, previewShape.radius)}
                fill="rgba(144, 238, 144, 0.3)"
                stroke="lightgreen"
                strokeWidth={2}
                dash={[5, 5]}
              />
            )}
            <Transformer ref={transformerRef} />
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
