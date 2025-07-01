import { serve } from "bun";

const clients = new Set();

const server = serve({
  port: 3000,
  async fetch(req, server) {
    const url = new URL(req.url);

    if (url.pathname === "/") {
      return new Response(Bun.file("public/index.html"));
    }

    // Handle WebSocket upgrade
    if (url.pathname === "/ws") {
      if (server.upgrade(req)) {
        return;
      }
      return new Response("WebSocket upgrade failed", { status: 400 });
    }

    return new Response("Not found", { status: 404 });
  },

  websocket: {
    open(ws) {
      clients.add(ws);
      console.log("Client connected. Total:", clients.size);
    },

    message(ws, message) {
      // Broadcast to all others
      for (const client of clients) {
        if (client !== ws && client.readyState === 1) {
          client.send(message);
        }
      }
    },

    close(ws) {
      clients.delete(ws);
      console.log("Client disconnected. Remaining:", clients.size);
    },
  },
});
