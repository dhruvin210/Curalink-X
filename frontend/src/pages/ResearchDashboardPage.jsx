import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  BellRing,
  FlaskConical,
  LayoutDashboard,
  LogOut,
  Menu,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  X
} from "lucide-react";
import { useState } from "react";
import { ChatFeed } from "../components/chat/ChatFeed";
import { QueryComposer } from "../components/chat/QueryComposer";
import { InsightsPanel } from "../components/panels/InsightsPanel";
import { ResearchSidebar } from "../components/sidebar/ResearchSidebar";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { useAuthContext } from "../hooks/useAuthContext";
import { useResearchWorkspace } from "../hooks/useResearchWorkspace";
import { APP_FULL_NAME, APP_NAME, APP_TAGLINE } from "../lib/brand";
import { clampScore, getInitials } from "../lib/utils";

function StatCard({ icon: Icon, label, value, hint }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="flex items-start gap-4 p-4 sm:p-5">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3 dark:border-white/10 dark:bg-white/5">
          <Icon className="h-5 w-5 text-sky-500 dark:text-sky-300" />
        </div>
        <div className="min-w-0">
          <p className="text-[11px] uppercase tracking-[0.2em] text-slate-500">{label}</p>
          <p className="mt-1 text-lg font-semibold text-slate-950 dark:text-white sm:text-xl">
            {value}
          </p>
          {hint ? (
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{hint}</p>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}

function WorkspaceHeader({
  currentUser,
  activeSession,
  latestResponse,
  onOpenSidebar,
  onLogout
}) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="space-y-5 p-4 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                size="icon"
                className="xl:hidden"
                onClick={onOpenSidebar}
                aria-label="Open workspace navigation"
              >
                <Menu className="h-4 w-4" />
              </Button>

              <p className="text-xs uppercase tracking-[0.28em] text-sky-500 dark:text-sky-300">
                {APP_NAME}
              </p>
              <Badge tone="info">Research mode live</Badge>
            </div>

            <h1 className="mt-3 max-w-4xl text-2xl font-semibold leading-tight text-slate-950 dark:text-white sm:text-3xl xl:text-4xl">
              A clinical research workspace built for evidence review, trial discovery, and treatment-risk synthesis.
            </h1>
            <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-300">
              {APP_FULL_NAME} helps teams investigate diseases, compare interventions,
              and keep a continuous record of their medical research workflow across sessions.
            </p>
          </div>

          <div className="flex flex-col gap-3 rounded-[26px] border border-slate-200/70 bg-slate-50/80 p-4 dark:border-white/10 dark:bg-white/[0.04] sm:min-w-[320px]">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-sky-500/15 text-sm font-semibold text-sky-700 dark:text-sky-200">
                  {getInitials(currentUser?.name || "Aurevia User")}
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {currentUser?.name || "Workspace user"}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {currentUser?.role || "Research Analyst"}
                  </p>
                </div>
              </div>

              <Button type="button" variant="ghost" size="icon" onClick={onLogout}>
                <LogOut className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              <Badge tone="success">PubMed</Badge>
              <Badge tone="neutral">OpenAlex</Badge>
              <Badge tone="warning">ClinicalTrials.gov</Badge>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3 dark:border-white/10 dark:bg-slate-950/45">
                <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                  Active thread
                </p>
                <p className="mt-2 text-sm font-medium text-slate-800 dark:text-slate-100">
                  {activeSession?.title || "New investigation"}
                </p>
              </div>
              <div className="rounded-2xl border border-slate-200/70 bg-white/80 px-4 py-3 dark:border-white/10 dark:bg-slate-950/45">
                <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500">
                  Last evidence sync
                </p>
                <p className="mt-2 text-sm font-medium text-slate-800 dark:text-slate-100">
                  {latestResponse?.meta?.retrieval?.duration_ms
                    ? `${latestResponse.meta.retrieval.duration_ms} ms`
                    : "Awaiting first run"}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1.5 dark:border-white/10 dark:bg-white/[0.04]">
            <LayoutDashboard className="h-3.5 w-3.5 text-sky-500 dark:text-sky-300" />
            {APP_TAGLINE}
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/70 px-3 py-1.5 dark:border-white/10 dark:bg-white/[0.04]">
            <BellRing className="h-3.5 w-3.5 text-sky-500 dark:text-sky-300" />
            Responsive workspace across mobile, tablet, laptop, and desktop
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function MobileSidebar({
  open,
  onClose,
  sessions,
  savedQueries,
  activeSessionId,
  filters,
  onSelectSession,
  onNewSession,
  onFilterChange
}) {
  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 xl:hidden"
        >
          <button
            type="button"
            className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
            onClick={onClose}
            aria-label="Close navigation"
          />

          <motion.div
            initial={{ x: -28, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -28, opacity: 0 }}
            className="relative h-full w-full max-w-sm overflow-y-auto p-3 sm:p-4"
          >
            <div className="mb-3 flex justify-end">
              <Button type="button" variant="secondary" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>

            <ResearchSidebar
              sessions={sessions}
              savedQueries={savedQueries}
              activeSessionId={activeSessionId}
              filters={filters}
              onSelectSession={async (sessionId) => {
                await onSelectSession(sessionId);
                onClose();
              }}
              onNewSession={() => {
                onNewSession();
                onClose();
              }}
              onFilterChange={onFilterChange}
            />
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
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

  const { currentUser, logout } = useAuthContext();
  const [sidebarOpen, setSidebarOpen] = useState(false);

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
      <MobileSidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        sessions={filteredSessions}
        savedQueries={savedQueries}
        activeSessionId={activeSessionId}
        filters={filters}
        onSelectSession={selectSession}
        onNewSession={resetWorkspace}
        onFilterChange={updateFilter}
      />

      <div className="mx-auto flex min-h-[calc(100vh-1.5rem)] max-w-[1800px] flex-col gap-4">
        <WorkspaceHeader
          currentUser={currentUser}
          activeSession={activeSession}
          latestResponse={latestResponse}
          onOpenSidebar={() => setSidebarOpen(true)}
          onLogout={logout}
        />

        <div className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[290px_minmax(0,1fr)_390px]">
          <div className="hidden xl:block">
            <ResearchSidebar
              sessions={filteredSessions}
              savedQueries={savedQueries}
              activeSessionId={activeSessionId}
              filters={filters}
              onSelectSession={selectSession}
              onNewSession={resetWorkspace}
              onFilterChange={updateFilter}
            />
          </div>

          <main className="flex min-h-0 flex-col gap-4">
            <motion.section
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid gap-4 sm:grid-cols-2 2xl:grid-cols-4"
            >
              <StatCard
                icon={FlaskConical}
                label="Research papers"
                value={latestResponse?.research_insights?.length || 0}
                hint="Top-ranked publication briefs"
              />
              <StatCard
                icon={Stethoscope}
                label="Clinical trials"
                value={latestResponse?.clinical_trials?.length || 0}
                hint="Active and completed study matches"
              />
              <StatCard
                icon={AlertTriangle}
                label="Risk confidence"
                value={`${confidenceScore}%`}
                hint="Evidence-backed treatment confidence"
              />
              <StatCard
                icon={Activity}
                label="Pipeline time"
                value={`${latestResponse?.meta?.retrieval?.duration_ms || 0} ms`}
                hint="Retrieval and synthesis speed"
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

            <Card className="min-h-0 overflow-hidden">
              <CardContent className="flex h-full min-h-0 flex-col gap-4 p-4 sm:p-6">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.25em] text-sky-500 dark:text-sky-300">
                      Main Research Thread
                    </p>
                    <h2 className="mt-2 text-2xl font-semibold leading-tight text-slate-950 dark:text-white sm:text-3xl">
                      Research-grade answers inside a decision-ready workflow
                    </h2>
                    <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-600 dark:text-slate-400">
                      {APP_NAME} combines evidence ranking, trial discovery, and risk
                      synthesis into a single clinical intelligence workspace.
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
                    <Badge tone="warning">
                      <span className="inline-flex items-center gap-2">
                        <ShieldCheck className="h-3.5 w-3.5" />
                        Risk tracking enabled
                      </span>
                    </Badge>
                  </div>
                </div>

                {latestResponse?.overview ? (
                  <div className="rounded-[24px] border border-sky-500/15 bg-sky-500/8 px-4 py-4 sm:rounded-[28px] sm:px-5">
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
          </main>

          <div className="min-h-0">
            <InsightsPanel
              latestResponse={latestResponse}
              filters={filters}
              loading={loading}
              onRunScenario={handleScenarioRun}
              whatIfValue={formState.whatIf}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
