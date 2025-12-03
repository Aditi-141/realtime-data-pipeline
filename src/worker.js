import { Worker } from "bullmq";
import { createClient } from "redis";
import { Pool } from "pg";
import { broadcast } from "./websocket.js";
import * as dotenv from "dotenv";
dotenv.config();

console.log("Worker starting...");

// PostgreSQL connection
const pool = new Pool({
  host: process.env.POSTGRES_HOST || "localhost",
  port: Number(process.env.POSTGRES_PORT) || 5432,
  user: process.env.POSTGRES_USER || "postgres",
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB || "realtime",
});

try {
  await pool.query("SELECT NOW()");
  console.log("Worker connected to PostgreSQL");
} catch (err) {
  console.error("Worker PostgreSQL error:", err.message);
}

// Redis connection
const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});

redisClient.on("connect", () =>
  console.log("Worker connected to Redis")
);
redisClient.on("error", (err) =>
  console.error("Worker Redis error:", err)
);

await redisClient.connect();

// BullMQ Worker
new Worker(
  "dataQueue",
  async (job) => {
    console.log("Worker received job:", job.data);

    const payload = job.data;

    await pool.query(
      `INSERT INTO history (value, timestamp) VALUES ($1, NOW())`,
      [payload.value]
    );

    console.log("Saved to DB:", payload.value);

    broadcast({ type: "NEW_RECORD", payload });

    console.log("WebSocket broadcast sent");
  },
  {
    connection: {
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
    },
  }
);

console.log("Worker running...");
