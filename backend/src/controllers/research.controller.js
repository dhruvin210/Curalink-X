import { validateResearchQuery } from "../validations/research.schema.js";
import { researchPipeline } from "../services/pipeline/research.pipeline.js";
import { sessionService } from "../services/memory/session.service.js";

export const processResearchQuery = async (req, res, next) => {
  try {
    const input = validateResearchQuery(req.body);
    const payload = await researchPipeline.run(input);
    res.json(payload);
  } catch (error) {
    next(error);
  }
};

export const listResearchSessions = async (req, res, next) => {
  try {
    const sessions = await sessionService.listSessions();
    res.json({ sessions });
  } catch (error) {
    next(error);
  }
};

export const getResearchSession = async (req, res, next) => {
  try {
    const session = await sessionService.getSessionDetail(req.params.sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found." });
    }

    return res.json({ session });
  } catch (error) {
    return next(error);
  }
};
