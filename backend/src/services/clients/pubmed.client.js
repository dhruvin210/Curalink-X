import axios from "axios";
import { parseStringPromise } from "xml2js";
import { env } from "../../config/env.js";
import { extractSnippet } from "../../utils/text.js";

const pubmedClient = axios.create({
  baseURL: env.pubmedBaseUrl,
  timeout: 20000
});

const pickAbstract = (abstractNode = []) => {
  const blocks = Array.isArray(abstractNode) ? abstractNode : [abstractNode];

  return extractSnippet(
    blocks
      .map((entry) => {
        if (typeof entry === "string") {
          return entry;
        }
        if (entry?._) {
          return entry._;
        }
        return "";
      })
      .filter(Boolean)
      .join(" "),
    420
  );
};

const mapPubmedArticle = (article = {}) => {
  const citation = article?.MedlineCitation?.[0];
  const articleNode = citation?.Article?.[0];
  const pmid = citation?.PMID?.[0]?._ || citation?.PMID?.[0];
  const title = articleNode?.ArticleTitle?.[0] || "Untitled publication";
  const abstractText = pickAbstract(articleNode?.Abstract?.[0]?.AbstractText);
  const authors =
    articleNode?.AuthorList?.[0]?.Author?.map((author) => {
      const lastName = author?.LastName?.[0];
      const foreName = author?.ForeName?.[0];
      return [foreName, lastName].filter(Boolean).join(" ");
    })
      .filter(Boolean)
      .join(", ") || "Not listed";
  const journal = articleNode?.Journal?.[0]?.Title?.[0] || "PubMed";
  const year =
    articleNode?.Journal?.[0]?.JournalIssue?.[0]?.PubDate?.[0]?.Year?.[0] ||
    article?.PubmedData?.[0]?.History?.[0]?.PubMedPubDate?.[0]?.Year?.[0];

  return {
    id: pmid,
    title: typeof title === "string" ? title : title?._ || "Untitled publication",
    summary: abstractText || "Abstract unavailable from PubMed efetch.",
    authors,
    year: year || "Unknown",
    publishedAt: year ? `${year}-01-01` : null,
    source: journal,
    url: pmid ? `https://pubmed.ncbi.nlm.nih.gov/${pmid}/` : "",
    abstract: abstractText,
    sourceType: "publication",
    sourceSystem: "PubMed",
    sourceScore: 0.96
  };
};

export class PubMedClient {
  async search(query, retmax) {
    const searchResponse = await pubmedClient.get("/esearch.fcgi", {
      params: {
        db: "pubmed",
        retmode: "json",
        retmax,
        sort: "relevance",
        term: query
      }
    });

    const ids = searchResponse.data?.esearchresult?.idlist || [];
    if (!ids.length) {
      return [];
    }

    const fetchResponse = await pubmedClient.get("/efetch.fcgi", {
      params: {
        db: "pubmed",
        id: ids.join(","),
        retmode: "xml"
      }
    });

    const parsed = await parseStringPromise(fetchResponse.data);
    const articles = parsed?.PubmedArticleSet?.PubmedArticle || [];
    return articles.map(mapPubmedArticle);
  }
}

export const pubMedClient = new PubMedClient();
