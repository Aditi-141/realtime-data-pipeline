import { Router } from "express";
import { ingestData } from "../controllers/ingest.controller.js";

const router = Router();
router.post("/ingest", ingestData);

export default router;
