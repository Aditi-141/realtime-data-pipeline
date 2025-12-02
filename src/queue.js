import { Queue } from "bullmq";
import * as dotenv from "dotenv";
dotenv.config();

export const dataQueue = new Queue("dataQueue", {
  connection: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
});
