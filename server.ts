import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { WebSocketServer, WebSocket } from "ws";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("submissions.db");

// Initialize database
db.exec(`
  CREATE TABLE IF NOT EXISTS submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    fullName TEXT,
    city TEXT,
    occupation TEXT,
    income TEXT,
    married TEXT,
    livingStatus TEXT,
    houseStatus TEXT,
    hasBike TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

async function startServer() {
  const app = express();
  const server = createServer(app);
  const wss = new WebSocketServer({ server });
  const PORT = 3000;

  app.use(express.json());

  // WebSocket for real-time visitor count
  let visitorCount = 0;
  wss.on("connection", (ws) => {
    visitorCount++;
    broadcastVisitorCount();

    ws.on("close", () => {
      visitorCount--;
      broadcastVisitorCount();
    });
  });

  function broadcastVisitorCount() {
    const data = JSON.stringify({ type: "VISITOR_COUNT", count: visitorCount });
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(data);
      }
    });
  }

  // API Route to submit form
  app.post("/api/submit", async (req, res) => {
    const data = req.body;

    try {
      const stmt = db.prepare(`
        INSERT INTO submissions (fullName, city, occupation, income, married, livingStatus, houseStatus, hasBike)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `);
      stmt.run(data.fullName, data.city, data.occupation, data.income, data.married, data.livingStatus, data.houseStatus, data.hasBike);
      res.json({ success: true });
    } catch (error) {
      console.error("Local DB error:", error);
      res.status(500).json({ error: "Failed to save data" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  server.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
