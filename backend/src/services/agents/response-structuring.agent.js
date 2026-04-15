import { env } from "../../config/env.js";

export class ResponseStructuringAgent {
  structure(llmPayload, context, publications, trials, pipelineMeta) {
    return {
      overview: llmPayload.overview,
      research_insights: (llmPayload.research_insights || [])
        .slice(0, env.finalResultTarget)
        .map((item, index) => ({
          ...item,
          score: publications[index]?.score,
          evidence_strength: publications[index]?.evidenceStrength,
          credibility_badge: publications[index]?.credibilityBadge
        })),
      clinical_trials: (llmPayload.clinical_trials || []).slice(0, 6),
      risk_analysis: llmPayload.risk_analysis,
      what_if_analysis: llmPayload.what_if_analysis,
      meta: {
        disease: context.disease || "",
        location: context.location || "",
        treatment: context.treatment || "",
        expansions: pipelineMeta.expansions || [],
        retrieval: pipelineMeta.retrieval,
        result_count: {
          publications: publications.length,
          clinical_trials: trials.length
        },
        generated_at: new Date().toISOString()
      }
    };
  }
}

export const responseStructuringAgent = new ResponseStructuringAgent();
