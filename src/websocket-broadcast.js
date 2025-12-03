// src/websocket-broadcast.js

let wss = null;

// Called by websocket-server.js to register the real WS server
export function setWSS(server) {
  wss = server;
}

// Worker imports this function to send messages
export function broadcast(data) {
  if (!wss) {
    console.error("No WebSocket server available for broadcast");
    return;
  }

  wss.clients.forEach((client) => {
    if (client.readyState === 1) {
      client.send(JSON.stringify(data));
    }
  });
}
