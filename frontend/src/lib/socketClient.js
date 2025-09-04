import { io } from "socket.io-client";

const URL = process.env.NEXT_PUBLIC_WS_URL || "http://localhost:5000";
const socket = io(URL, { autoConnect: true });

export default socket;
