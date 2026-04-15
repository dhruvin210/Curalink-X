import { normalizeText } from "../../utils/text.js";

const benefitSignals = ["improve", "benefit", "effective", "reduction", "better", "favorable"];
const riskSignals = ["risk", "adverse", "toxicity", "harm", "worsen", "contraindication"];

const buildEvidenceSummary = (studies, label) => {
  if (!studies.length) {
    return `No strong ${label.toLowerCase()} signal was found in the retrieved evidence set.`;
  }

  const topStudies = studies.slice(0, 3).map((study) => `${study.title} (${study.year})`);
  return `${label} signal observed across ${studies.length} evidence source(s), led by ${topStudies.join("; ")}.`;
};

export class RiskAnalysisAgent {
  analyze(context, publications = [], trials = []) {
    const treatment = context.treatment || context.whatIf;
    if (!treatment) {
      return {
        benefits: "Add a treatment or supplement to activate comparative risk simulation.",
        risks: "Risk simulation is waiting for a specific intervention.",
        confidence_score: "0.25",
        evidence_strength: "Insufficient"
      };
    }

    const treatmentNeedle = normalizeText(treatment);
    const relevantStudies = publications.filter((publication) =>
      normalizeText(`${publication.title} ${publication.summary} ${publication.abstract || ""}`).includes(
        treatmentNeedle
      )
    );

    const benefitStudies = relevantStudies.filter((publication) =>
      benefitSignals.some((signal) =>
        normalizeText(`${publication.title} ${publication.summary}`).includes(signal)
      )
    );

    const riskStudies = relevantStudies.filter((publication) =>
      riskSignals.some((signal) =>
        normalizeText(`${publication.title} ${publication.summary}`).includes(signal)
      )
    );

    const matchingTrials = trials.filter((trial) =>
      normalizeText(
        `${trial.title} ${(trial.interventions || []).join(" ")} ${(trial.conditions || []).join(" ")}`
      ).includes(treatmentNeedle)
    );

    const confidenceRaw = Math.min(
      0.98,
      0.35 +
        benefitStudies.length * 0.08 +
        riskStudies.length * 0.08 +
        matchingTrials.length * 0.06
    );

    return {
      benefits: buildEvidenceSummary(benefitStudies, "Benefit"),
      risks: buildEvidenceSummary(riskStudies, "Risk"),
      confidence_score: confidenceRaw.toFixed(2),
      evidence_strength:
        confidenceRaw >= 0.8 ? "High" : confidenceRaw >= 0.6 ? "Moderate" : "Emerging"
    };
  }
}

export const riskAnalysisAgent = new RiskAnalysisAgent();
