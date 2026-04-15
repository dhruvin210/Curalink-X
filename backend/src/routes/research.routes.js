import { Router } from "express";
import {
  getResearchSession,
  listResearchSessions,
  processResearchQuery
} from "../controllers/research.controller.js";

const router = Router();

router.get("/sessions", listResearchSessions);
router.get("/session/:sessionId", getResearchSession);
router.post("/query", processResearchQuery);

export default router;
