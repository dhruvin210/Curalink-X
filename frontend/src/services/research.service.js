const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

function extractErrorMessage(data) {
  if (Array.isArray(data?.issues) && data.issues.length) {
    return data.issues.map((issue) => issue.message).join(" ");
  }

  if (Array.isArray(data) && data.length) {
    return data
      .map((issue) => issue?.message)
      .filter(Boolean)
      .join(" ");
  }

  return data?.message || "Request failed";
}

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json"
    },
    ...options
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(extractErrorMessage(data));
  }

  return data;
}

export const researchService = {
  fetchSessions: () => request("/research/sessions"),
  fetchSessionDetail: (sessionId) => request(`/research/session/${sessionId}`),
  submitResearchQuery: (payload) =>
    request("/research/query", {
      method: "POST",
      body: JSON.stringify(payload)
    })
};
