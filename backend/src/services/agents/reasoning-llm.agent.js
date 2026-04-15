import OpenAI from "openai";
import { env } from "../../config/env.js";
import { extractSnippet } from "../../utils/text.js";

const openai = env.openAiApiKey
  ? new OpenAI({
      apiKey: env.openAiApiKey
    })
  : null;

const buildFallback = ({ context, publications, trials, riskAnalysis }) => ({
  overview: `Curalink X reviewed ${publications.length} publication(s) and ${trials.length} clinical trial record(s) for ${
    context.disease || "the requested condition"
  }. The strongest evidence clusters around the top-ranked sources below, and the risk analysis is limited to retrieved evidence mentioning ${
    context.treatment || "the requested intervention"
  }.`,
  research_insights: publications.slice(0, env.finalResultTarget).map((publication) => ({
    title: publication.title,
    summary: extractSnippet(publication.summary || publication.abstract || "Summary unavailable.", 220),
    authors: publication.authors,
    year: publication.year,
    source: publication.source,
    url: publication.url,
    score: publication.score,
    evidence_strength: publication.evidenceStrength,
    credibility_badge: publication.credibilityBadge
  })),
  clinical_trials: trials.slice(0, 6).map((trial) => ({
    title: trial.title,
    status: trial.status,
    eligibility: extractSnippet(trial.eligibility, 180),
    location: trial.location,
    contact: trial.contact,
    url: trial.url
  })),
  risk_analysis: riskAnalysis,
  what_if_analysis: {
    scenario: context.treatment
      ? `What happens if ${context.treatment} is considered for ${context.disease || "this condition"}?`
      : "Add a treatment or supplement to activate what-if analysis.",
    assessment: riskAnalysis.benefits,
    caution: riskAnalysis.risks
  }
});

export class ReasoningLlmAgent {
  async synthesize({ context, publications, trials, riskAnalysis, memory }) {
    const fallback = buildFallback({ context, publications, trials, riskAnalysis });
    const prompt = `
You are an evidence-grounded medical research synthesis model.
Return valid JSON only. Do not use markdown. Do not invent facts.
Use only the publications, clinical trials, and risk analysis provided.

Conversation memory:
${JSON.stringify(memory)}

Context:
${JSON.stringify(context)}

Top publications:
${JSON.stringify(publications.slice(0, env.finalResultTarget))}

Top clinical trials:
${JSON.stringify(trials.slice(0, 6))}

Risk analysis:
${JSON.stringify(riskAnalysis)}

Required schema:
{
  "overview": "string",
  "research_insights": [
    {
      "title": "string",
      "summary": "string",
      "authors": "string",
      "year": "string",
      "source": "string",
      "url": "string"
    }
  ],
  "clinical_trials": [
    {
      "title": "string",
      "status": "string",
      "eligibility": "string",
      "location": "string",
      "contact": "string"
    }
  ],
  "risk_analysis": {
    "benefits": "string",
    "risks": "string",
    "confidence_score": "string"
  },
  "what_if_analysis": {
    "scenario": "string",
    "assessment": "string",
    "caution": "string"
    }
}
`.trim();

    if (!openai) {
      return fallback;
    }

    try {
      const response = await openai.responses.create({
        model: env.openAiModel,
        input: prompt
      });

      const parsed = JSON.parse(response.output_text || "{}");
      return {
        ...fallback,
        ...parsed,
        research_insights:
          parsed.research_insights?.length ? parsed.research_insights : fallback.research_insights,
        clinical_trials:
          parsed.clinical_trials?.length ? parsed.clinical_trials : fallback.clinical_trials,
        risk_analysis: {
          ...fallback.risk_analysis,
          ...(parsed.risk_analysis || {})
        },
        what_if_analysis: {
          ...fallback.what_if_analysis,
          ...(parsed.what_if_analysis || {})
        }
      };
    } catch (error) {
      return fallback;
    }
  }
}

export const reasoningLlmAgent = new ReasoningLlmAgent();
