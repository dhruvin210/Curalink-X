import crypto from "crypto";
import { Session } from "../../models/session.model.js";
import { toTitleCase } from "../../utils/text.js";

const buildSessionTitle = (input) => {
  const primary =
    input.disease || input.query || input.naturalLanguage || "Research thread";
  return toTitleCase(primary.split(" ").slice(0, 8).join(" "));
};

const mergeContext = (previousContext = {}, nextInput = {}) => ({
  disease: nextInput.disease || previousContext.disease,
  query: nextInput.query || nextInput.naturalLanguage || previousContext.query,
  location: nextInput.location || previousContext.location,
  age: nextInput.age ?? previousContext.age,
  gender: nextInput.gender || previousContext.gender,
  treatment: nextInput.treatment || nextInput.whatIf || previousContext.treatment
});

export class SessionService {
  async getOrCreateSession(sessionId, input) {
    const resolvedSessionId =
      sessionId || crypto.randomUUID().replace(/-/g, "").slice(0, 18);

    let session = await Session.findOne({ sessionId: resolvedSessionId });
    if (!session) {
      session = await Session.create({
        sessionId: resolvedSessionId,
        title: buildSessionTitle(input),
        context: mergeContext({}, input)
      });
    }

    return session;
  }

  hydrateInput(session, input) {
    const context = mergeContext(session?.context, input);
    return {
      ...input,
      ...context,
      query: input.query || input.naturalLanguage || context.query
    };
  }

  async appendUserTurn(sessionId, input, normalizedInput) {
    const session = await Session.findOne({ sessionId });
    if (!session) {
      return null;
    }

    session.context = mergeContext(session.context, normalizedInput);
    session.title = session.title || buildSessionTitle(normalizedInput);
    session.messages.push({
      role: "user",
      content: input.naturalLanguage || input.query || normalizedInput.query,
      metadata: {
        structuredInput: normalizedInput
      }
    });
    await session.save();
    return session;
  }

  async appendAssistantTurn(sessionId, responsePayload) {
    const session = await Session.findOne({ sessionId });
    if (!session) {
      return null;
    }

    session.lastRetrievedAt = new Date();
    session.messages.push({
      role: "assistant",
      content: responsePayload.overview,
      metadata: responsePayload
    });
    await session.save();
    return session;
  }

  async listSessions() {
    return Session.find({}, { sessionId: 1, title: 1, updatedAt: 1 })
      .sort({ updatedAt: -1 })
      .limit(25)
      .lean();
  }

  async getSessionDetail(sessionId) {
    return Session.findOne({ sessionId }).lean();
  }
}

export const sessionService = new SessionService();
