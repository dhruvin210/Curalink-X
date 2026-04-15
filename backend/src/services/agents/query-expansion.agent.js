import { unique } from "../../utils/text.js";

const synonymMap = {
  parkinsons: ["Parkinson disease", "Parkinson's disease"],
  alzheimers: ["Alzheimer disease", "Alzheimer's disease"],
  depression: ["major depressive disorder", "depressive symptoms"],
  oncology: ["cancer", "neoplasm", "tumor"]
};

const getSynonyms = (value = "") => {
  const normalized = value.toLowerCase().replace(/[^a-z]/g, "");
  return synonymMap[normalized] || [];
};

export class QueryExpansionAgent {
  expand(context) {
    const diseaseTerms = unique([context.disease, ...getSynonyms(context.disease)]);
    const coreQuery = context.query || context.naturalLanguage || "";
    const combinedQuery = diseaseTerms.length
      ? `${coreQuery} AND (${diseaseTerms.join(" OR ")})`
      : coreQuery;

    return {
      primaryQuery: combinedQuery.trim(),
      pubmedQuery: combinedQuery.trim(),
      openAlexQuery: [coreQuery, ...diseaseTerms].filter(Boolean).join(" "),
      clinicalTrialsQuery: [context.disease, context.treatment, context.location]
        .filter(Boolean)
        .join(" "),
      expansions: unique([
        coreQuery,
        combinedQuery,
        `${coreQuery} evidence`,
        context.treatment ? `${context.treatment} ${context.disease || ""}`.trim() : null
      ])
    };
  }
}

export const queryExpansionAgent = new QueryExpansionAgent();
