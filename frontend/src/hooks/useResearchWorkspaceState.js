import { useEffect, useMemo, useState } from "react";
import { researchService } from "../services/research.service";

export const initialFormState = {
  disease: "",
  query: "",
  naturalLanguage: "",
  location: "",
  age: "",
  gender: "",
  whatIf: ""
};

const initialFilters = {
  disease: "",
  publications: true,
  trials: true,
  risk: true
};

function buildFallbackQuery(form) {
  const parts = [];

  if (form.query?.trim()) {
    parts.push(form.query.trim());
  }
  if (form.disease?.trim()) {
    parts.push(`evidence for ${form.disease.trim()}`);
  }
  if (form.whatIf?.trim()) {
    parts.push(`risk and benefit of ${form.whatIf.trim()}`);
  }
  if (form.location?.trim()) {
    parts.push(`in ${form.location.trim()}`);
  }

  return parts.join(" ").trim();
}

function toSavedQuery(session) {
  return {
    id: session.sessionId,
    label: session.title,
    summary: session.context?.query || session.context?.disease || "Research thread"
  };
}

export function useResearchWorkspaceState() {
  const [sessions, setSessions] = useState([]);
  const [activeSessionId, setActiveSessionId] = useState("");
  const [activeSession, setActiveSession] = useState(null);
  const [formState, setFormState] = useState(initialFormState);
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(false);
  const [loadingSession, setLoadingSession] = useState(false);
  const [error, setError] = useState("");

  const latestResponse = useMemo(() => {
    const assistantMessages =
      activeSession?.messages?.filter((message) => message.role === "assistant") || [];
    return assistantMessages.at(-1)?.metadata || null;
  }, [activeSession]);

  const filteredSessions = useMemo(() => {
    if (!filters.disease) {
      return sessions;
    }

    const needle = filters.disease.toLowerCase();
    return sessions.filter((session) => {
      const haystack = `${session.title} ${session.context?.disease || ""}`.toLowerCase();
      return haystack.includes(needle);
    });
  }, [filters.disease, sessions]);

  const savedQueries = useMemo(
    () => sessions.slice(0, 5).map(toSavedQuery),
    [sessions]
  );

  const loadSessions = async () => {
    const response = await researchService.fetchSessions();
    setSessions(response.sessions || []);
    return response.sessions || [];
  };

  const loadSessionDetail = async (sessionId) => {
    setLoadingSession(true);

    try {
      const response = await researchService.fetchSessionDetail(sessionId);
      setActiveSession(response.session);
      setActiveSessionId(sessionId);
      setFormState((current) => ({
        ...current,
        disease: response.session?.context?.disease || current.disease,
        query: response.session?.context?.query || current.query,
        location: response.session?.context?.location || current.location,
        gender: response.session?.context?.gender || current.gender,
        age: response.session?.context?.age || current.age,
        whatIf: response.session?.context?.treatment || current.whatIf
      }));

      return response.session;
    } finally {
      setLoadingSession(false);
    }
  };

  useEffect(() => {
    loadSessions().catch((requestError) => {
      setError(requestError.message);
    });
  }, []);

  const resetWorkspace = () => {
    setActiveSessionId("");
    setActiveSession(null);
    setFormState(initialFormState);
    setError("");
  };

  const updateFormField = (name, value) => {
    setFormState((current) => ({
      ...current,
      [name]: value
    }));
  };

  const handleFormChange = (event) => {
    const { name, value } = event.target;
    updateFormField(name, value);
  };

  const updateFilter = (name, value) => {
    setFilters((current) => ({
      ...current,
      [name]: value
    }));
  };

  const runResearchQuery = async (overrides = {}) => {
    setLoading(true);
    setError("");

    try {
      const nextForm = {
        ...formState,
        ...overrides
      };

      if (Object.keys(overrides).length) {
        setFormState(nextForm);
      }

      const payload = {
        ...nextForm,
        query: nextForm.query || nextForm.naturalLanguage || buildFallbackQuery(nextForm),
        sessionId: activeSessionId || undefined,
        age: nextForm.age ? Number(nextForm.age) : undefined,
        treatment: nextForm.whatIf || undefined
      };

      const response = await researchService.submitResearchQuery(payload);
      await loadSessions();
      await loadSessionDetail(response.sessionId);
      setFormState((current) => ({
        ...current,
        naturalLanguage: ""
      }));

      return response;
    } catch (requestError) {
      setError(requestError.message);
      throw requestError;
    } finally {
      setLoading(false);
    }
  };

  const selectSession = async (sessionId) => {
    setError("");
    try {
      return await loadSessionDetail(sessionId);
    } catch (requestError) {
      setError(requestError.message);
      throw requestError;
    }
  };

  return {
    sessions,
    filteredSessions,
    savedQueries,
    activeSessionId,
    activeSession,
    latestResponse,
    formState,
    filters,
    loading,
    loadingSession,
    error,
    loadSessions,
    selectSession,
    resetWorkspace,
    handleFormChange,
    updateFormField,
    updateFilter,
    runResearchQuery
  };
}
