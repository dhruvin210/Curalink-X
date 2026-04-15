import { motion } from "framer-motion";
import { AlertCircle, BookOpenText, Microscope, TestTube2 } from "lucide-react";
import { ClinicalTrialCard } from "../cards/ClinicalTrialCard";
import { ResearchPaperCard } from "../cards/ResearchPaperCard";
import { RiskAnalysisCard } from "../cards/RiskAnalysisCard";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { ScrollArea } from "../ui/scroll-area";
import { Skeleton } from "../ui/skeleton";
import { WhatIfPanel } from "./WhatIfPanel";

function EmptyPanelState() {
  return (
    <div className="rounded-[28px] border border-dashed border-slate-200 bg-white/60 p-6 text-sm text-slate-500 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-400">
      Run a research query to populate papers, trials, and risk analysis cards.
    </div>
  );
}

export function InsightsPanel({
  latestResponse,
  filters,
  loading,
  onRunScenario,
  whatIfValue
}) {
  const papers = latestResponse?.research_insights || [];
  const trials = latestResponse?.clinical_trials || [];
  const hasAnyInsights = papers.length || trials.length || latestResponse?.risk_analysis;

  return (
    <motion.div
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      className="xl:sticky xl:top-4 xl:h-[calc(100vh-2rem)]"
    >
      <Card className="h-full overflow-hidden">
        <CardHeader className="border-b border-white/10 pb-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-sky-500 dark:text-sky-300">
                Dynamic Insights
              </p>
              <CardTitle className="mt-2 text-xl">Research intelligence panel</CardTitle>
            </div>
            <Badge tone="info">Live synthesis</Badge>
          </div>
        </CardHeader>
        <CardContent className="h-[calc(100%-6.5rem)] p-0">
          <ScrollArea className="h-full">
            <div className="space-y-5 p-6">
              <WhatIfPanel
                currentValue={whatIfValue}
                latestScenario={latestResponse?.what_if_analysis}
                onRunScenario={onRunScenario}
                loading={loading}
              />

              {loading && !hasAnyInsights ? (
                <div className="space-y-4">
                  <Skeleton className="h-48" />
                  <Skeleton className="h-40" />
                  <Skeleton className="h-52" />
                </div>
              ) : null}

              {!loading && !hasAnyInsights ? <EmptyPanelState /> : null}

              {filters.publications ? (
                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-800 dark:text-slate-100">
                    <BookOpenText className="h-4 w-4 text-sky-500 dark:text-sky-300" />
                    Research papers
                  </div>
                  {papers.length ? (
                    papers.map((paper, index) => (
                      <ResearchPaperCard paper={paper} index={index} key={`${paper.title}-${index}`} />
                    ))
                  ) : (
                    <Card>
                      <CardContent className="p-5 text-sm text-slate-500 dark:text-slate-400">
                        No publication cards available yet.
                      </CardContent>
                    </Card>
                  )}
                </section>
              ) : null}

              {filters.trials ? (
                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-800 dark:text-slate-100">
                    <TestTube2 className="h-4 w-4 text-sky-500 dark:text-sky-300" />
                    Clinical trials
                  </div>
                  {trials.length ? (
                    trials.map((trial, index) => (
                      <ClinicalTrialCard trial={trial} index={index} key={`${trial.title}-${index}`} />
                    ))
                  ) : (
                    <Card>
                      <CardContent className="p-5 text-sm text-slate-500 dark:text-slate-400">
                        No clinical trials matched the current filters.
                      </CardContent>
                    </Card>
                  )}
                </section>
              ) : null}

              {filters.risk ? (
                <section className="space-y-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-slate-800 dark:text-slate-100">
                    <Microscope className="h-4 w-4 text-sky-500 dark:text-sky-300" />
                    Risk analysis
                  </div>
                  {latestResponse?.risk_analysis ? (
                    <RiskAnalysisCard riskAnalysis={latestResponse.risk_analysis} />
                  ) : (
                    <Card>
                      <CardContent className="flex items-center gap-3 p-5 text-sm text-slate-500 dark:text-slate-400">
                        <AlertCircle className="h-4 w-4 text-amber-300" />
                        Risk analysis will appear after the first evidence run.
                      </CardContent>
                    </Card>
                  )}
                </section>
              ) : null}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </motion.div>
  );
}
