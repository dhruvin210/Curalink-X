import { env } from "../../config/env.js";
import { sessionService } from "../memory/session.service.js";
import { clinicalTrialAgent } from "../agents/clinical-trial.agent.js";
import { queryExpansionAgent } from "../agents/query-expansion.agent.js";
import { queryUnderstandingAgent } from "../agents/query-understanding.agent.js";
import { reasoningLlmAgent } from "../agents/reasoning-llm.agent.js";
import { researchRetrievalAgent } from "../agents/research-retrieval.agent.js";
import { responseStructuringAgent } from "../agents/response-structuring.agent.js";
import { riskAnalysisAgent } from "../agents/risk-analysis.agent.js";
import { rankingEngine } from "../engines/ranking.engine.js";

export class ResearchPipeline {
  async run(input) {
    const startedAt = Date.now();
    const session = await sessionService.getOrCreateSession(input.sessionId, input);
    const hydratedInput = sessionService.hydrateInput(session, input);
    const understood = queryUnderstandingAgent.understand(hydratedInput);
    const expanded = queryExpansionAgent.expand(understood);

    await sessionService.appendUserTurn(session.sessionId, input, understood);

    const [retrieval, trials] = await Promise.all([
      researchRetrievalAgent.retrieve(expanded),
      clinicalTrialAgent.retrieve(expanded)
    ]);

    const rankedPublications = rankingEngine.rank(
      retrieval.publications,
      understood,
      env.finalResultTarget
    );
    const rankedTrials = trials.slice(0, 6);
    const riskAnalysis = riskAnalysisAgent.analyze(
      understood,
      rankedPublications,
      rankedTrials
    );

    const llmPayload = await reasoningLlmAgent.synthesize({
      context: understood,
      publications: rankedPublications,
      trials: rankedTrials,
      riskAnalysis,
      memory: {
        priorTurns: session.messages.slice(-4).map((message) => ({
          role: message.role,
          content: message.content
        }))
      }
    });

    const structured = responseStructuringAgent.structure(
      llmPayload,
      understood,
      rankedPublications,
      rankedTrials,
      {
        expansions: expanded.expansions,
        retrieval: {
          upstream_publications: retrieval.publications.length,
          upstream_trials: trials.length,
          returned_publications: rankedPublications.length,
          returned_trials: rankedTrials.length,
          duration_ms: Date.now() - startedAt
        }
      }
    );

    await sessionService.appendAssistantTurn(session.sessionId, structured);

    return {
      sessionId: session.sessionId,
      response: structured
    };
  }
}

export const researchPipeline = new ResearchPipeline();
