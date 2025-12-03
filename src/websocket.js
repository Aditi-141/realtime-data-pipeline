// src/websocket.js
import { WebSocketServer } from "ws";

let wss = null;

// Start WebSocket server
export function startWebSocket() {
  if (wss) return; // prevent duplicate servers

  wss = new WebSocketServer({ port: 7000 });

  wss.on("connection", (ws) => {
    console.log("WS client connected");

    ws.send(
      JSON.stringify({
        type: "WELCOME",
        message: "Connected to real-time server",
      })
    );
  });

  wss.on("error", (err) => {
    console.error("WebSocket error:", err);
  });

  console.log(" WebSocket running at ws://localhost:7000");
}

// Broadcast to all WebSocket clients
export function broadcast(data) {
  if (!wss) {
    console.error("WebSocket server not started yet.");
    return;
  }

  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(data));
    }
  });
}
