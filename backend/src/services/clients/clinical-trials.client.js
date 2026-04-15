import axios from "axios";
import { env } from "../../config/env.js";

const trialClient = axios.create({
  baseURL: env.clinicalTrialsBaseUrl,
  timeout: 20000
});

const mapTrial = (study = {}) => {
  const protocol = study.protocolSection || {};
  const identification = protocol.identificationModule || {};
  const statusModule = protocol.statusModule || {};
  const eligibilityModule = protocol.eligibilityModule || {};
  const contactsModule = protocol.contactsLocationsModule || {};
  const contact = contactsModule.centralContacts?.[0] || {};
  const location = contactsModule.locations?.[0] || {};

  return {
    id: identification.nctId,
    title: identification.briefTitle || "Untitled trial",
    status: statusModule.overallStatus || "Unknown",
    eligibility:
      eligibilityModule.eligibilityCriteria || "Refer to ClinicalTrials.gov listing",
    location: [location.city, location.state, location.country]
    .filter(Boolean)
    .join(", "),
    contact: [contact.name, contact.phone, contact.email].filter(Boolean).join(" | "),
    conditions: protocol.conditionsModule?.conditions || [],
    interventions:
      protocol.armsInterventionsModule?.interventions?.map((item) => item.name) || [],
    source: "ClinicalTrials.gov",
    url: identification.nctId
      ? `https://clinicaltrials.gov/study/${identification.nctId}`
      : ""
  };
};

export class ClinicalTrialsClient {
  async search(query, maxStudies) {
    const response = await trialClient.get("/studies", {
      params: {
        "query.term": query,
        pageSize: maxStudies,
        format: "json"
      }
    });

    const studies = response.data?.studies || [];
    return studies.map(mapTrial);
  }
}

export const clinicalTrialsApi = new ClinicalTrialsClient();
