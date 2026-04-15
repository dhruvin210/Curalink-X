import axios from "axios";
import { env } from "../../config/env.js";
import { extractSnippet } from "../../utils/text.js";

const openAlexClient = axios.create({
  baseURL: env.openAlexBaseUrl,
  timeout: 20000
});

const reconstructAbstract = (abstractInvertedIndex = {}) => {
  const pairs = Object.entries(abstractInvertedIndex).flatMap(([word, positions]) =>
    positions.map((position) => [position, word])
  );

  return pairs
    .sort((left, right) => left[0] - right[0])
    .map(([, word]) => word)
    .join(" ");
};

const mapOpenAlexWork = (work = {}) => {
  const year = work.publication_year || "Unknown";
  const venue = work.primary_location?.source?.display_name || "OpenAlex";
  const citedBy = work.cited_by_count || 0;
  const sourceScore = Math.min(0.92, 0.68 + Math.log10(citedBy + 10) / 10);
  const abstract = reconstructAbstract(work.abstract_inverted_index || {});

  return {
    id: work.id,
    title: work.display_name || "Untitled publication",
    summary: extractSnippet(abstract || "Abstract unavailable."),
    authors:
      work.authorships?.map((authorship) => authorship.author?.display_name)
        .filter(Boolean)
        .join(", ") || "Not listed",
    year,
    publishedAt: work.publication_date || (year !== "Unknown" ? `${year}-01-01` : null),
    source: venue,
    url: work.primary_location?.landing_page_url || work.id || "",
    abstract,
    sourceType: "publication",
    sourceSystem: "OpenAlex",
    sourceScore
  };
};

export class OpenAlexClient {
  async search(query, perPage) {
    const response = await openAlexClient.get("/works", {
      params: {
        search: query,
        "per-page": perPage,
        api_key: env.openAlexApiKey || undefined,
        sort: "relevance_score:desc"
      }
    });

    return (response.data?.results || []).map(mapOpenAlexWork);
  }
}

export const openAlexApi = new OpenAlexClient();
