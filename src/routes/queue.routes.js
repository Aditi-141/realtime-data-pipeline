import { Router } from "express";
import { dataQueue } from "../queue.js";  // adjust path if needed

const router = Router();

router.get("/status", async (req, res) => {
  try {
    const counts = await dataQueue.getJobCounts(); // waiting, active, completed, failed

    res.json({
      success: true,
      counts
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

export default router;
