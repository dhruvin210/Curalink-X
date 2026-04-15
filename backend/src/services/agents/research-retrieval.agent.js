import { env } from "../../config/env.js";
import { openAlexApi } from "../clients/openalex.client.js";
import { pubMedClient } from "../clients/pubmed.client.js";
import { researchCacheService } from "../cache/research-cache.service.js";

export class ResearchRetrievalAgent {
  async retrieve(expandedQuery) {
    const cacheSeed = {
      type: "research-retrieval",
      query: expandedQuery.primaryQuery
    };
    const cached = await researchCacheService.get(cacheSeed);
    if (cached) {
      return cached.payload;
    }

    const [pubmed, openalex] = await Promise.allSettled([
      pubMedClient.search(expandedQuery.pubmedQuery, env.initialResultTarget),
      openAlexApi.search(expandedQuery.openAlexQuery, env.initialResultTarget)
    ]);

    const payload = {
      publications: [
        ...(pubmed.status === "fulfilled" ? pubmed.value : []),
        ...(openalex.status === "fulfilled" ? openalex.value : [])
      ],
      retrievalMeta: {
        pubmedStatus: pubmed.status,
        openAlexStatus: openalex.status
      }
    };

    await researchCacheService.set(cacheSeed, payload);
    return payload;
  }
}

export const researchRetrievalAgent = new ResearchRetrievalAgent();
