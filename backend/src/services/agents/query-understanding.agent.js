import { normalizeText } from "../../utils/text.js";

const inferAge = (text) => {
  const match = text.match(/(\d{1,3})\s*(?:year old|years old|yo)\b/i);
  return match ? Number(match[1]) : undefined;
};

const inferGender = (text) => {
  const normalized = normalizeText(text);
  if (normalized.includes("female") || normalized.includes("woman")) {
    return "female";
  }
  if (normalized.includes("male") || normalized.includes("man")) {
    return "male";
  }
  return undefined;
};

const inferLocation = (text) => {
  const match = text.match(/\b(?:in|near|around)\s+([A-Za-z][A-Za-z\s,]{2,40})/i);
  return match ? match[1].trim() : undefined;
};

const inferDisease = (text) => {
  const match = text.match(/\b(?:for|with|about)\s+([A-Za-z][A-Za-z\s'-]{2,50})/i);
  return match ? match[1].trim() : undefined;
};

const inferTreatment = (text) => {
  const match = text.match(
    /\b(?:treatment|therapy|supplement|drug|medication|intervention)\s+(?:with|using|is|for)?\s*([A-Za-z0-9][A-Za-z0-9\s'-]{2,40})/i
  );
  return match ? match[1].trim() : undefined;
};

export class QueryUnderstandingAgent {
  understand(input) {
    const naturalLanguage = input.naturalLanguage || input.query || "";
    const mergedText = `${input.disease || ""} ${naturalLanguage}`.trim();
    const treatment = input.treatment || input.whatIf || inferTreatment(mergedText);
    const synthesizedStructuredQuery = [
      input.query,
      naturalLanguage,
      input.disease ? `evidence for ${input.disease}` : "",
      treatment ? `risk and benefit of ${treatment}` : "",
      input.location ? `in ${input.location}` : ""
    ]
      .filter(Boolean)
      .join(" ")
      .trim();

    return {
      rawInput: input,
      naturalLanguage,
      disease: input.disease || inferDisease(mergedText),
      query: input.query || naturalLanguage || synthesizedStructuredQuery,
      location: input.location || inferLocation(mergedText),
      age: input.age ?? inferAge(mergedText),
      gender: input.gender || inferGender(mergedText),
      treatment
    };
  }
}

export const queryUnderstandingAgent = new QueryUnderstandingAgent();
