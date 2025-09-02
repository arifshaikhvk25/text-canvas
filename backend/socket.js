import { Server } from "socket.io";

export const initSocket = (server) => {
  // const io = new Server(server, {
  //   cors: {
  //     origin: "http://localhost:3000", // your frontend URL
  //     methods: ["GET", "POST"],
  //   },
  // });

  // io.on("connection", (socket) => {
  //   console.log("🟢 New client connected:", socket.id);

  //   socket.on("disconnect", () => {
  //     console.log("🔴 Client disconnected:", socket.id);
  //   });
  // });

  // return io;

  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000", // your frontend
      methods: ["GET", "POST"],
    },
  });

  // Socket connection
  io.on("connection", (socket) => {
    console.log("🔌 New client connected:", socket.id);

    // Send welcome message
    socket.emit("welcome", "Hello from backend socket 🚀");

    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
    });
  });
};
