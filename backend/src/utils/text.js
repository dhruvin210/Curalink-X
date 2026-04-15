const STOP_WORDS = new Set([
  "a",
  "an",
  "and",
  "are",
  "as",
  "at",
  "be",
  "by",
  "for",
  "from",
  "has",
  "in",
  "is",
  "it",
  "of",
  "on",
  "or",
  "that",
  "the",
  "to",
  "with"
]);

export const normalizeText = (value = "") =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const tokenize = (value = "") =>
  normalizeText(value)
    .split(" ")
    .filter((token) => token && !STOP_WORDS.has(token));

export const unique = (values = []) => [...new Set(values.filter(Boolean))];

export const extractSnippet = (value = "", limit = 280) => {
  if (!value) {
    return "";
  }

  return value.length > limit ? `${value.slice(0, limit - 3)}...` : value;
};

export const toTitleCase = (value = "") =>
  value
    .split(" ")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(" ");
