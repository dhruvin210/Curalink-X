import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  FlaskConical,
  Sparkles,
  Stethoscope
} from "lucide-react";
import { ChatFeed } from "../components/chat/ChatFeed";
import { QueryComposer } from "../components/chat/QueryComposer";
import { InsightsPanel } from "../components/panels/InsightsPanel";
import { ResearchSidebar } from "../components/sidebar/ResearchSidebar";
import { Badge } from "../components/ui/badge";
import { Card, CardContent } from "../components/ui/card";
import { useResearchWorkspace } from "../hooks/useResearchWorkspace";
import { clampScore } from "../lib/utils";

function StatCard({ icon: Icon, label, value }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="flex items-center gap-4 p-5">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/5">
          <Icon className="h-5 w-5 text-sky-500 dark:text-sky-300" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
          <p className="mt-1 text-xl font-semibold text-slate-950 dark:text-white">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ResearchDashboardPage() {
  const {
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
    selectSession,
    resetWorkspace,
    handleFormChange,
    updateFilter,
    runResearchQuery
  } = useResearchWorkspace();

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await runResearchQuery();
    } catch {
      // The workspace hook already captures the error state for the UI.
    }
  };

  const handleScenarioRun = async (value) => {
    try {
      await runResearchQuery({ whatIf: value });
    } catch {
      // The workspace hook already captures the error state for the UI.
    }
  };

  const confidenceScore = clampScore(latestResponse?.risk_analysis?.confidence_score);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.12),transparent_24%),radial-gradient(circle_at_top_right,rgba(45,212,191,0.1),transparent_20%),linear-gradient(180deg,#f8fafc_0%,#eef2ff_34%,#f8fafc_100%)] px-3 py-3 text-slate-900 dark:bg-[radial-gradient(circle_at_top_left,rgba(56,189,248,0.16),transparent_24%),radial-gradient(circle_at_top_right,rgba(45,212,191,0.12),transparent_20%),linear-gradient(180deg,#020617_0%,#0b1120_34%,#111827_100%)] dark:text-slate-100 md:px-4">
      <div className="grid min-h-[calc(100vh-1.5rem)] gap-3 xl:grid-cols-[290px_minmax(0,1fr)_420px]">
        <ResearchSidebar
          sessions={filteredSessions}
          savedQueries={savedQueries}
          activeSessionId={activeSessionId}
          filters={filters}
          onSelectSession={selectSession}
          onNewSession={resetWorkspace}
          onFilterChange={updateFilter}
        />

        <main className="flex min-h-0 flex-col gap-4">
          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid gap-4 md:grid-cols-2 xl:grid-cols-4"
          >
            <StatCard
              icon={FlaskConical}
              label="Research papers"
              value={latestResponse?.research_insights?.length || 0}
            />
            <StatCard
              icon={Stethoscope}
              label="Clinical trials"
              value={latestResponse?.clinical_trials?.length || 0}
            />
            <StatCard
              icon={AlertTriangle}
              label="Risk confidence"
              value={`${confidenceScore}%`}
            />
            <StatCard
              icon={Activity}
              label="Pipeline time"
              value={`${latestResponse?.meta?.retrieval?.duration_ms || 0} ms`}
            />
          </motion.section>

          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}>
            <QueryComposer
              formState={formState}
              onChange={handleFormChange}
              onSubmit={handleSubmit}
              loading={loading}
            />
          </motion.div>

          {error ? (
            <Card className="border-rose-500/20 bg-rose-500/10">
              <CardContent className="flex items-center gap-3 p-5 text-sm text-rose-100">
                <AlertTriangle className="h-5 w-5 text-rose-300" />
                {error}
              </CardContent>
            </Card>
          ) : null}

          <div className="grid min-h-0 flex-1 gap-4">
            <Card className="min-h-0 overflow-hidden">
              <CardContent className="flex h-full min-h-0 flex-col gap-4 p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-sky-500 dark:text-sky-300">
                      Main Research Thread
                    </p>
                    <h1 className="mt-2 text-3xl font-semibold leading-tight text-slate-950 dark:text-white">
                      AI answers with a researcher&apos;s workflow
                    </h1>
                    <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-400">
                      Curalink X combines ranked evidence, trial discovery, and risk
                      synthesis into a conversational research canvas with structured
                      insight cards.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Badge tone="info">
                      <span className="inline-flex items-center gap-2">
                        <Sparkles className="h-3.5 w-3.5" />
                        Streaming answer UI
                      </span>
                    </Badge>
                    <Badge tone="neutral">
                      {latestResponse?.meta?.disease || formState.disease || "Select condition"}
                    </Badge>
                    <Badge tone="success">
                      {latestResponse?.meta?.result_count?.publications || 0} top results
                    </Badge>
                  </div>
                </div>

                {latestResponse?.overview ? (
                  <div className="rounded-[28px] border border-sky-500/15 bg-sky-500/8 px-5 py-4">
                    <p className="text-xs uppercase tracking-[0.22em] text-sky-500 dark:text-sky-300">
                      Overview
                    </p>
                    <p className="mt-3 text-sm leading-7 text-slate-700 dark:text-slate-200">
                      {latestResponse.overview}
                    </p>
                  </div>
                ) : null}

                <ChatFeed
                  activeSession={activeSession}
                  loading={loading}
                  loadingSession={loadingSession}
                />
              </CardContent>
            </Card>
          </div>
        </main>

        <InsightsPanel
          latestResponse={latestResponse}
          filters={filters}
          loading={loading}
          onRunScenario={handleScenarioRun}
          whatIfValue={formState.whatIf}
        />
      </div>
    </div>
  );
}
