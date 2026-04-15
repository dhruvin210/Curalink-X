import { tokenize } from "./text.js";

export const semanticSimilarity = (queryText, documentText) => {
  const queryTokens = new Set(tokenize(queryText));
  const documentTokens = new Set(tokenize(documentText));

  if (!queryTokens.size || !documentTokens.size) {
    return 0;
  }

  const overlap = [...queryTokens].filter((token) => documentTokens.has(token));
  return overlap.length / new Set([...queryTokens, ...documentTokens]).size;
};

export const recencyScore = (dateValue) => {
  if (!dateValue) {
    return 0.2;
  }

  const published = new Date(dateValue);
  if (Number.isNaN(published.getTime())) {
    return 0.2;
  }

  const years = (Date.now() - published.getTime()) / (1000 * 60 * 60 * 24 * 365);
  return Math.max(0.1, Math.min(1, 1 - years / 15));
};

export const credibilityBadge = (score) => {
  if (score >= 0.9) {
    return "Gold";
  }
  if (score >= 0.75) {
    return "Silver";
  }
  return "Bronze";
};

export const evidenceStrength = (score) => {
  if (score >= 0.82) {
    return "High";
  }
  if (score >= 0.62) {
    return "Moderate";
  }
  return "Emerging";
};
