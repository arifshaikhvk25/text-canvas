import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import http from "http"; // important for socket
import { initSocket } from "./socket.js"; // import your socket file

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("Backend is working 🚀");
});

// Create HTTP server
const server = http.createServer(app);

// Initialize socket
initSocket(server);

// Start server
server.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
