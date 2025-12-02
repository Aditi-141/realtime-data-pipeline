import { WebSocketServer } from "ws";

let wss;

export function startWebSocket() {
  wss = new WebSocketServer({ port: 7000 });

  wss.on("connection", (ws) => {
    console.log("WS client connected");
    ws.send(JSON.stringify({ type: "WELCOME", message: "Connected to real-time server" }));
  });

  console.log("WebSocket running at ws://localhost:7000");
}

export function broadcast(data) {
  if (!wss) return;

  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(data));
    }
  });
}
