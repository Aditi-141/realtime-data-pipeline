// websocket-server.js
import { WebSocketServer } from "ws";

export const wss = new WebSocketServer({ port: 7000 });

wss.on("connection", (ws) => {
  console.log("WS client connected");
  ws.send(JSON.stringify({ type: "WELCOME", message: "Connected to real-time server" }));
});

export function broadcast(data) {
  console.log("Server broadcasting:", data);

  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(data));
    }
  });
}

console.log("WebSocket running at ws://localhost:7000");
