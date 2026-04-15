import dotenv from "dotenv";

dotenv.config();

const getNumber = (value, fallback) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: getNumber(process.env.PORT, 5000),
  mongoUri: process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/curalinkx",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
  openAiApiKey: process.env.OPENAI_API_KEY || "",
  openAiModel: process.env.OPENAI_MODEL || "gpt-5.1",
  pubmedBaseUrl:
    process.env.PUBMED_BASE_URL ||
    "https://eutils.ncbi.nlm.nih.gov/entrez/eutils",
  openAlexBaseUrl: process.env.OPENALEX_BASE_URL || "https://api.openalex.org",
  openAlexApiKey: process.env.OPENALEX_API_KEY || "",
  clinicalTrialsBaseUrl:
    process.env.CLINICAL_TRIALS_BASE_URL ||
    "https://clinicaltrials.gov/api/v2",
  cacheTtlHours: getNumber(process.env.CACHE_TTL_HOURS, 12),
  initialResultTarget: getNumber(process.env.INITIAL_RESULT_TARGET, 80),
  finalResultTarget: getNumber(process.env.FINAL_RESULT_TARGET, 8)
};
