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

"use client"; // required for Next.js app router

import { useEffect } from "react";
import { io } from "socket.io-client";

let socket; // keep a single instance

const SocketTest = () => {
  useEffect(() => {
    // Initialize connection
    socket = io("http://localhost:5000");

    // When connected
    socket.on("connect", () => {
      console.log("✅ Connected to backend socket with ID:", socket.id);
    });

    // When disconnected
    socket.on("disconnect", () => {
      console.log("❌ Disconnected from backend socket");
    });

    // Listen to custom events
    socket.on("welcome", (msg) => {
      console.log("📩 Message from server:", msg);
    });

    // Cleanup: disconnect socket on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  return <div>socket frontend test</div>;
};

export default SocketTest;
