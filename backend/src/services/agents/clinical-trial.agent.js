import { env } from "../../config/env.js";
import { researchCacheService } from "../cache/research-cache.service.js";
import { clinicalTrialsApi } from "../clients/clinical-trials.client.js";

export class ClinicalTrialAgent {
  async retrieve(expandedQuery) {
    const cacheSeed = {
      type: "clinical-trials",
      query: expandedQuery.clinicalTrialsQuery || expandedQuery.primaryQuery
    };
    const cached = await researchCacheService.get(cacheSeed);
    if (cached) {
      return cached.payload;
    }

    try {
      const trials = await clinicalTrialsApi.search(
        expandedQuery.clinicalTrialsQuery || expandedQuery.primaryQuery,
        Math.min(env.initialResultTarget, 50)
      );

      await researchCacheService.set(cacheSeed, trials);
      return trials;
    } catch (error) {
      return [];
    }
  }
}

export const clinicalTrialAgent = new ClinicalTrialAgent();
