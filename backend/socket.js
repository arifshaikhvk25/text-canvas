import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: { origin: "*" }, // allow requests from any origin
  });

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("draw-shape", (shape) => {
      console.log("Received shape:", shape);
      socket.broadcast.emit("remote-shape", shape); // ✅ send to others
    });

    socket.on("clear-canvas", () => {
      console.log("Canvas cleared by:", socket.id);
      socket.broadcast.emit("remote-clear");
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};

export const getIO = () => io;
