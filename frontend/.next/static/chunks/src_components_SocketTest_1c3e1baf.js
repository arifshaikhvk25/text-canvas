(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/components/SocketTest.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// // // socketTest.js
// // import { io } from "socket.io-client";
// // // Connect to backend socket server
// // const socket = io("http://localhost:5000");
// // // When connected
// // socket.on("connect", () => {
// //   console.log("✅ Connected to backend socket with ID:", socket.id);
// // });
// // // When disconnected
// // socket.on("disconnect", () => {
// //   console.log("❌ Disconnected from backend socket");
// // });
// // // Listen to custom events from backend
// // socket.on("welcome", (msg) => {
// //   console.log("📩 Message from server:", msg);
// // });
// // export default socket;
// // socketTest.js
// // export default socket;
// import { io } from "socket.io-client";
// import React from "react";
// const SocketTest = () => {
//   // Connect to backend socket server
//   const socket = io("http://localhost:5000");
//   // When connected
//   socket.on("connect", () => {
//     console.log("✅ Connected to backend socket with ID:", socket.id);
//   });
//   // When disconnected
//   socket.on("disconnect", () => {
//     console.log("❌ Disconnected from backend socket");
//   });
//   // Listen to custom events from backend
//   socket.on("welcome", (msg) => {
//     console.log("📩 Message from server:", msg);
//   });
//   return <div>socket frontend test</div>;
// };
// export default SocketTest;
__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$socket$2e$io$2d$client$2f$build$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/socket.io-client/build/esm/index.js [app-client] (ecmascript) <locals>");
;
var _s = __turbopack_context__.k.signature();
"use client"; // required for Next.js app router
;
;
let socket; // keep a single instance
const SocketTest = ()=>{
    _s();
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "SocketTest.useEffect": ()=>{
            // Initialize connection
            socket = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$socket$2e$io$2d$client$2f$build$2f$esm$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["io"])("http://localhost:5000");
            // When connected
            socket.on("connect", {
                "SocketTest.useEffect": ()=>{
                    console.log("✅ Connected to backend socket with ID:", socket.id);
                }
            }["SocketTest.useEffect"]);
            // When disconnected
            socket.on("disconnect", {
                "SocketTest.useEffect": ()=>{
                    console.log("❌ Disconnected from backend socket");
                }
            }["SocketTest.useEffect"]);
            // Listen to custom events
            socket.on("welcome", {
                "SocketTest.useEffect": (msg)=>{
                    console.log("📩 Message from server:", msg);
                }
            }["SocketTest.useEffect"]);
            // Cleanup: disconnect socket on unmount
            return ({
                "SocketTest.useEffect": ()=>{
                    socket.disconnect();
                }
            })["SocketTest.useEffect"];
        }
    }["SocketTest.useEffect"], []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        children: "socket frontend test"
    }, void 0, false, {
        fileName: "[project]/src/components/SocketTest.js",
        lineNumber: 88,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
_s(SocketTest, "OD7bBpZva5O2jO+Puf00hKivP7c=");
_c = SocketTest;
const __TURBOPACK__default__export__ = SocketTest;
var _c;
__turbopack_context__.k.register(_c, "SocketTest");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_components_SocketTest_1c3e1baf.js.map