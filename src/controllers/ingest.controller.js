import { dataQueue } from "../queue.js";

export const ingestData = async (req, res) => {
  const payload = req.body;

  console.log("API received:", payload);

  await dataQueue.add("ingest-job", payload);

  console.log("Added job to queue");

  res.json({ success: true, message: "Data queued", payload });
};
