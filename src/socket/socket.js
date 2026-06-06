import { io } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:8000";

console.log("Socket URL:", SOCKET_URL);

export const socket = io(SOCKET_URL, {
  autoConnect: false,
  transports: ["websocket"],
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});

// Debug: log connection events
socket.on("connect", () => {
  console.log("✓ Socket connected", socket.id);
});

socket.on("disconnect", () => {
  console.log("× Socket disconnected");
});

socket.on("connect_error", (error) => {
  console.error("✗ Socket connection error:", error);
});

export default socket;
