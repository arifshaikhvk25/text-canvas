// "use client";

// import React, { useState, useEffect, useRef, useCallback } from "react";
// import { Stage, Layer, Rect, Circle, Transformer } from "react-konva";
// import { io } from "socket.io-client";

// export default function CanvasBoard() {
//   const [shapes, setShapes] = useState([]);
//   const [shapeType, setShapeType] = useState("rect");
//   const [isDrawing, setIsDrawing] = useState(false);
//   const [startPos, setStartPos] = useState(null);
//   const [previewShape, setPreviewShape] = useState(null);
//   const [selectedId, setSelectedId] = useState(null);
//   const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
//   const containerRef = useRef(null);
//   const transformerRef = useRef(null);
//   const stageRef = useRef(null);
//   const socket = io("http://localhost:5000");

//   // Make canvas responsive
//   useEffect(() => {
//     const updateSize = () => {
//       if (containerRef.current) {
//         setCanvasSize({
//           width: containerRef.current.offsetWidth,
//           height: containerRef.current.offsetHeight,
//         });
//       }
//     };

//     updateSize();
//     window.addEventListener("resize", updateSize);
//     return () => window.removeEventListener("resize", updateSize);
//   }, []);

//   // Update transformer when selection changes
//   useEffect(() => {
//     if (!transformerRef.current || !selectedId) return;

//     const stage = transformerRef.current.getStage();
//     const selectedNode = stage.findOne(`#${selectedId}`);

//     if (selectedNode) {
//       transformerRef.current.nodes([selectedNode]);
//     } else {
//       transformerRef.current.nodes([]);
//     }

//     transformerRef.current.getLayer().batchDraw();
//   }, [selectedId]);

//   const handleMouseDown = useCallback((e) => {
//     // Deselect if clicked on empty area
//     if (e.target === e.target.getStage()) {
//       setSelectedId(null);
//       const stage = e.target.getStage();
//       const pointer = stage.getPointerPosition();
//       setStartPos(pointer);
//       setIsDrawing(true);
//       return;
//     }

//     // Select if clicked on a shape
//     if (e.target.attrs.id) {
//       setSelectedId(e.target.attrs.id);
//     } else {
//       setSelectedId(null);
//     }
//   }, []);

//   const handleMouseMove = useCallback(
//     (e) => {
//       if (!isDrawing || !startPos) return;

//       const stage = e.target.getStage();
//       const pointer = stage.getPointerPosition();

//       const width = pointer.x - startPos.x;
//       const height = pointer.y - startPos.y;

//       const absWidth = Math.abs(width);
//       const absHeight = Math.abs(height);

//       const newX = width < 0 ? pointer.x : startPos.x;
//       const newY = height < 0 ? pointer.y : startPos.y;

//       setPreviewShape({
//         type: shapeType,
//         x: newX,
//         y: newY,
//         width: absWidth,
//         height: absHeight,
//         radius:
//           shapeType === "circle"
//             ? Math.max(
//                 5,
//                 Math.sqrt(absWidth * absWidth + absHeight * absHeight) / 2
//               )
//             : 0,
//       });
//     },
//     [isDrawing, startPos, shapeType]
//   );

//   const handleMouseUp = useCallback(() => {
//     if (!isDrawing || !previewShape) return;

//     // Finalize shape
//     const newShape = {
//       id: `shape-${Date.now()}`,
//       type: previewShape.type,
//       x: previewShape.x,
//       y: previewShape.y,
//       width: previewShape.width,
//       height: previewShape.height,
//       radius: previewShape.radius,
//     };

//     setShapes((prev) => [...prev, newShape]);
//     socket.emit("draw-line", newShape);

//     setIsDrawing(false);
//     setStartPos(null);
//     setPreviewShape(null);
//   }, [isDrawing, previewShape]);

//   const handleDragEnd = useCallback((e, id) => {
//     const { x, y } = e.target.position();
//     setShapes((prev) => prev.map((s) => (s.id === id ? { ...s, x, y } : s)));
//   }, []);

//   const handleTransformEnd = useCallback((e, id) => {
//     const node = e.target;
//     const scaleX = node.scaleX();
//     const scaleY = node.scaleY();

//     setShapes((prev) =>
//       prev.map((s) =>
//         s.id === id
//           ? {
//               ...s,
//               x: node.x(),
//               y: node.y(),
//               width:
//                 s.type === "rect"
//                   ? Math.max(5, node.width() * scaleX)
//                   : s.width,
//               height:
//                 s.type === "rect"
//                   ? Math.max(5, node.height() * scaleY)
//                   : s.height,
//               radius:
//                 s.type === "circle"
//                   ? Math.max(5, node.radius() * scaleX)
//                   : s.radius,
//             }
//           : s
//       )
//     );

//     node.scaleX(1);
//     node.scaleY(1);
//   }, []);

//   useEffect(() => {
//     socket.on("remote-draw", (shape) => {
//       setShapes((prev) => [...prev, shape]);
//     });

//     return () => {
//       socket.off("remote-draw");
//     };
//   }, []);

//   return (
//     <div className="w-full h-screen bg-gray-100 flex flex-col overflow-hidden">
//       {/* Toolbar */}
//       <div className="flex gap-4 p-4 bg-white shadow-sm">
//         <button
//           onClick={() => setShapeType("rect")}
//           className={`px-4 py-2 rounded ${
//             shapeType === "rect" ? "bg-blue-500 text-white" : "bg-white border"
//           }`}
//         >
//           Rectangle
//         </button>
//         <button
//           onClick={() => setShapeType("circle")}
//           className={`px-4 py-2 rounded ${
//             shapeType === "circle"
//               ? "bg-green-500 text-white"
//               : "bg-white border"
//           }`}
//         >
//           Circle
//         </button>
//         <button
//           onClick={() => {
//             setShapes([]);
//             setSelectedId(null); // 👈 reset selection too
//             if (transformerRef.current) {
//               transformerRef.current.nodes([]); // 👈 detach transformer
//               transformerRef.current.getLayer()?.batchDraw();
//             }
//           }}
//           className="px-4 py-2 rounded bg-white border"
//         >
//           Clear Canvas
//         </button>
//       </div>

//       {/* Canvas */}
//       <div ref={containerRef} className="flex-1 relative">
//         <Stage
//           ref={stageRef}
//           width={canvasSize.width}
//           height={canvasSize.height}
//           onMouseDown={handleMouseDown}
//           onMouseMove={handleMouseMove}
//           onMouseUp={handleMouseUp}
//           className="absolute inset-0"
//         >
//           <Layer>
//             {shapes.map((shape) =>
//               shape.type === "rect" ? (
//                 <Rect
//                   key={shape.id}
//                   id={shape.id}
//                   x={shape.x}
//                   y={shape.y}
//                   width={shape.width}
//                   height={shape.height}
//                   fill="rgba(135, 206, 235, 0.7)"
//                   stroke="skyblue"
//                   strokeWidth={2}
//                   draggable
//                   shadowBlur={5}
//                   cornerRadius={8}
//                   onDragEnd={(e) => handleDragEnd(e, shape.id)}
//                   onTransformEnd={(e) => handleTransformEnd(e, shape.id)}
//                 />
//               ) : (
//                 <Circle
//                   key={shape.id}
//                   id={shape.id}
//                   // Render at center
//                   x={shape.x + shape.width / 2}
//                   y={shape.y + shape.height / 2}
//                   radius={Math.max(1, shape.radius)}
//                   fill="rgba(144, 238, 144, 0.7)"
//                   stroke="lightgreen"
//                   strokeWidth={2}
//                   draggable
//                   shadowBlur={5}
//                   onDragEnd={(e) => {
//                     const node = e.target;
//                     setShapes((prev) =>
//                       prev.map((s) =>
//                         s.id === shape.id
//                           ? {
//                               ...s,
//                               // store top-left coords when dropped
//                               x: node.x() - s.width / 2,
//                               y: node.y() - s.height / 2,
//                             }
//                           : s
//                       )
//                     );
//                   }}
//                   onTransformEnd={(e) => handleTransformEnd(e, shape.id)}
//                 />
//               )
//             )}

//             {/* Drawing preview */}
//             {previewShape && shapeType === "rect" && (
//               <Rect
//                 x={previewShape.x}
//                 y={previewShape.y}
//                 width={previewShape.width}
//                 height={previewShape.height}
//                 fill="rgba(135, 206, 235, 0.3)"
//                 stroke="skyblue"
//                 strokeWidth={2}
//                 dash={[5, 5]}
//               />
//             )}
//             {previewShape && shapeType === "circle" && (
//               <Circle
//                 x={previewShape.x + previewShape.width / 2}
//                 y={previewShape.y + previewShape.height / 2}
//                 radius={Math.max(1, previewShape.radius)}
//                 fill="rgba(144, 238, 144, 0.3)"
//                 stroke="lightgreen"
//                 strokeWidth={2}
//                 dash={[5, 5]}
//               />
//             )}
//             <Transformer ref={transformerRef} />
//           </Layer>
//         </Stage>
//       </div>
//     </div>
//   );
// }

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
