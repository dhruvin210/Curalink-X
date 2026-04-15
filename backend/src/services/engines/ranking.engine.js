import {
  credibilityBadge,
  evidenceStrength,
  recencyScore,
  semanticSimilarity
} from "../../utils/scoring.js";

export class RankingEngine {
  rank(documents, context, limit) {
    const queryText = [context.query, context.disease, context.treatment]
      .filter(Boolean)
      .join(" ");

    const scored = documents.map((document) => {
      const relevance = semanticSimilarity(
        queryText,
        `${document.title} ${document.summary} ${document.abstract || ""}`
      );
      const recency = recencyScore(document.publishedAt || document.year);
      const credibility = document.sourceScore || 0.7;
      const score = 0.45 * relevance + 0.25 * recency + 0.3 * credibility;

      return {
        ...document,
        score: Number(score.toFixed(3)),
        scoring: {
          relevance_weight: 0.45,
          recency_weight: 0.25,
          credibility_weight: 0.3,
          semantic_similarity: Number(relevance.toFixed(3)),
          publication_date: Number(recency.toFixed(3)),
          source_score: Number(credibility.toFixed(3))
        },
        credibilityBadge: credibilityBadge(credibility),
        evidenceStrength: evidenceStrength(score)
      };
    });

    return scored.sort((left, right) => right.score - left.score).slice(0, limit);
  }
}

export const rankingEngine = new RankingEngine();
