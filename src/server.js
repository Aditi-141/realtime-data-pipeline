import express from "express";
import cors from "cors";
import ingestRoutes from "./routes/ingest.routes.js";
import statsRoutes from "./routes/stats.routes.js";
import historyRoutes from "./routes/history.routes.js";
import { createClient } from "redis";
import pkg from "pg";
import * as dotenv from "dotenv";
import queueRoutes from "./routes/queue.routes.js";
import "./websocket-server.js";
import { broadcast } from "./websocket-server.js";


dotenv.config();

const { Pool } = pkg;

const app = express();
app.use(cors());
app.use(express.json());

// PostgreSQL Connection Test
const pgPool = new Pool({
  host: process.env.POSTGRES_HOST || "localhost",
  port: Number(process.env.POSTGRES_PORT) || 5432,
  user: process.env.POSTGRES_USER || "postgres",
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB || "realtime",
});

pgPool
  .query("SELECT NOW()")
  .then(() => console.log("Server connected to PostgreSQL"))
  .catch((err) => console.error("PostgreSQL error:", err.message));

// Redis Connection Test
const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});

redisClient.on("connect", () => console.log("Server connected to Redis"));
redisClient.on("error", (err) =>
  console.error("Redis connection error:", err)
);

await redisClient.connect();

// Routes
app.use("/api", ingestRoutes);
app.use("/api", statsRoutes);
app.use("/api", historyRoutes);
app.use("/api/queue", queueRoutes); 
app.post("/api/broadcast", (req, res) => {
  broadcast(req.body);
  res.json({ success: true });
});


// Server Start
app.listen(3000, () =>

  
  console.log("REST API running at http://localhost:3000")
);
