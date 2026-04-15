import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  CornerDownLeft,
  Filter,
  MessageSquareText,
  SendHorizonal,
  Sparkles
} from "lucide-react";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "../ui/collapsible";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";

const structuredFields = [
  { id: "disease", label: "Disease", placeholder: "Parkinson's disease" },
  { id: "query", label: "Research focus", placeholder: "Deep brain stimulation" },
  { id: "location", label: "Location", placeholder: "Mumbai" },
  { id: "age", label: "Age", placeholder: "58" },
  { id: "gender", label: "Gender", placeholder: "Male" },
  { id: "whatIf", label: "What-if treatment", placeholder: "Vitamin D" }
];

const quickPrompts = [
  "Latest evidence for Parkinson's disease",
  "Show matching clinical trials",
  "What if I take Vitamin D?"
];

export function QueryComposer({ formState, onChange, onSubmit, loading }) {
  const [showStructuredFields, setShowStructuredFields] = useState(true);

  const hasInput = Boolean(
    formState.naturalLanguage?.trim() ||
      formState.query?.trim() ||
      formState.disease?.trim() ||
      formState.location?.trim() ||
      formState.whatIf?.trim()
  );

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();

      if (!loading && hasInput) {
        event.currentTarget.form?.requestSubmit();
      }
    }
  };

  return (
    <div className="rounded-[32px] border border-slate-200/70 bg-white/88 p-6 shadow-[0_24px_80px_rgba(2,6,23,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-slate-950/72 dark:shadow-[0_24px_80px_rgba(2,6,23,0.3)]">
      <div className="mb-5 flex flex-wrap items-start justify-between gap-4">
        <div className="max-w-3xl">
          <p className="text-xs uppercase tracking-[0.28em] text-sky-500 dark:text-sky-300">
            Evidence Intake
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">
            Turn complex medical questions into ranked evidence, trial signals, and risk insight
          </h2>
          <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-400">
            Ask naturally, or combine your message with structured disease and treatment
            fields to guide the research pipeline.
          </p>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-sky-500/20 bg-sky-500/10 px-4 py-2 text-xs uppercase tracking-[0.22em] text-sky-700 dark:text-sky-200">
          <Sparkles className="h-4 w-4" />
          OpenAI reasoning copilot
        </div>
      </div>

      <form onSubmit={onSubmit} className="space-y-4">
        <div className="overflow-hidden rounded-[30px] border border-slate-200 bg-white shadow-[inset_0_1px_0_rgba(255,255,255,0.7)] dark:border-white/10 dark:bg-slate-950/60 dark:shadow-none">
          <div className="flex items-start justify-between gap-4 border-b border-slate-200/80 px-5 py-4 dark:border-white/10">
            <div className="inline-flex items-start gap-3 text-sm text-slate-700 dark:text-slate-200">
              <div className="rounded-2xl bg-sky-500/10 p-2 text-sky-600 dark:text-sky-300">
                <MessageSquareText className="h-4 w-4" />
              </div>
              <div>
                <div className="font-medium">Ask your medical research question</div>
                <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                  Enter sends your query. Shift + Enter adds a new line.
                </div>
              </div>
            </div>

            <div className="hidden items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-xs text-slate-500 dark:bg-white/[0.05] dark:text-slate-400 md:inline-flex">
              <CornerDownLeft className="h-3.5 w-3.5" />
              Press Enter to send
            </div>
          </div>

          <div className="px-5 pb-5 pt-4">
            <Textarea
              name="naturalLanguage"
              value={formState.naturalLanguage}
              onChange={onChange}
              onKeyDown={handleKeyDown}
              placeholder="Example: What is the latest evidence for deep brain stimulation in Parkinson's disease, and how would Vitamin D change the risk-benefit profile?"
              className="min-h-[170px] resize-none rounded-[24px] border border-slate-200 bg-slate-50/90 px-4 py-4 text-base leading-7 text-slate-900 shadow-none focus:ring-2 dark:border-white/10 dark:bg-slate-900/80 dark:text-slate-50"
            />

            <div className="mt-4 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
              <div className="space-y-2">
                <div className="text-[11px] font-medium uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
                  Quick prompts
                </div>
                <div className="flex flex-wrap gap-2">
                  {quickPrompts.map((prompt) => (
                    <button
                      key={prompt}
                      type="button"
                      onClick={() =>
                        onChange({
                          target: {
                            name: "naturalLanguage",
                            value: prompt
                          }
                        })
                      }
                      className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600 transition hover:border-sky-300 hover:bg-sky-50 hover:text-sky-700 dark:border-white/10 dark:bg-white/[0.04] dark:text-slate-300 dark:hover:border-sky-500/40 dark:hover:bg-sky-500/10 dark:hover:text-sky-200"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex w-full flex-col gap-2 xl:w-auto xl:min-w-[250px]">
                <Button
                  type="submit"
                  size="lg"
                  className="h-14 w-full rounded-[22px] text-sm"
                  disabled={loading || !hasInput}
                >
                  <SendHorizonal className="h-4 w-4" />
                  {loading ? "Running evidence pipeline..." : "Send message"}
                </Button>
                <div className="text-center text-[11px] uppercase tracking-[0.2em] text-slate-500 dark:text-slate-500">
                  Structured inputs below are optional
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-[26px] border border-slate-200/70 bg-slate-50/75 px-4 py-3 dark:border-white/10 dark:bg-white/[0.03]">
          <Collapsible open={showStructuredFields} onOpenChange={setShowStructuredFields}>
            <div className="flex items-center justify-between gap-3">
              <div className="inline-flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                <Filter className="h-4 w-4 text-sky-500 dark:text-sky-300" />
                Structured query metadata
                <span className="rounded-full bg-slate-200 px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] text-slate-600 dark:bg-white/10 dark:text-slate-400">
                  Optional
                </span>
              </div>

              <CollapsibleTrigger asChild>
                <Button type="button" size="sm" variant="ghost">
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      showStructuredFields ? "rotate-180" : ""
                    }`}
                  />
                </Button>
              </CollapsibleTrigger>
            </div>

            <AnimatePresence initial={false}>
              {showStructuredFields ? (
                <CollapsibleContent forceMount asChild>
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="grid gap-3 pt-4 md:grid-cols-2 xl:grid-cols-3">
                      {structuredFields.map((field) => (
                        <div key={field.id} className="space-y-2">
                          <label className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-500">
                            {field.label}
                          </label>
                          <Input
                            type={field.id === "age" ? "number" : "text"}
                            name={field.id}
                            value={formState[field.id]}
                            onChange={onChange}
                            placeholder={field.placeholder}
                          />
                        </div>
                      ))}
                    </div>
                  </motion.div>
                </CollapsibleContent>
              ) : null}
            </AnimatePresence>
          </Collapsible>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <p className="max-w-2xl text-sm text-slate-600 dark:text-slate-400">
            Curalink X expands your query, retrieves PubMed, OpenAlex, and clinical
            trial data, then reranks the strongest evidence before synthesis.
          </p>
          <div className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-500">
            Designed for structured medical research
          </div>
        </div>
      </form>
    </div>
  );
}
