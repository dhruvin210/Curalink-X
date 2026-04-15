import { motion } from "framer-motion";
import ReactMarkdown from "react-markdown";
import { Activity, AlertTriangle, FlaskConical, Sparkles } from "lucide-react";
import { useMemo } from "react";
import { useStreamingText } from "../../hooks/useStreamingText";
import { Badge } from "../ui/badge";
import { Card } from "../ui/card";

function buildAssistantHighlights(metadata = {}) {
  const items = [];

  if (metadata.meta?.disease) {
    items.push({
      icon: Activity,
      label: metadata.meta.disease
    });
  }

  if (metadata.research_insights?.length) {
    items.push({
      icon: FlaskConical,
      label: `${metadata.research_insights.length} papers`
    });
  }

  if (metadata.risk_analysis?.confidence_score) {
    items.push({
      icon: AlertTriangle,
      label: `Confidence ${metadata.risk_analysis.confidence_score}`
    });
  }

  return items.slice(0, 3);
}

export function MessageBubble({ message, isLatestAssistant }) {
  const isAssistant = message.role === "assistant";
  const streamedContent = useStreamingText(
    message.content || "",
    isAssistant && isLatestAssistant,
    6
  );

  const displayContent = isAssistant && isLatestAssistant ? streamedContent : message.content;
  const highlights = useMemo(
    () => (isAssistant ? buildAssistantHighlights(message.metadata) : []),
    [isAssistant, message.metadata]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 22 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}
    >
      <Card
        className={`max-w-3xl px-5 py-4 ${
          isAssistant
            ? "border-slate-200/70 bg-white/90 dark:border-white/10 dark:bg-slate-900/70"
            : "border-sky-500/20 bg-sky-500/10"
        }`}
      >
        <div className="mb-3 flex items-center gap-2">
          <Badge tone={isAssistant ? "info" : "neutral"}>
            {isAssistant ? "Curalink X" : "Researcher"}
          </Badge>
          {isAssistant ? <Sparkles className="h-4 w-4 text-sky-300" /> : null}
        </div>

        {highlights.length ? (
          <div className="mb-4 flex flex-wrap gap-2">
            {highlights.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
              >
                <Icon className="h-3.5 w-3.5 text-sky-500 dark:text-sky-300" />
                <span>{label}</span>
              </div>
            ))}
          </div>
        ) : null}

        <div className="max-w-none text-sm leading-7 text-slate-700 dark:text-slate-200 [&_p]:mb-3 [&_strong]:font-semibold [&_strong]:text-sky-600 dark:[&_strong]:text-sky-200 [&_ul]:mb-3 [&_ul]:list-disc [&_ul]:pl-5">
          <ReactMarkdown>{displayContent || " "}</ReactMarkdown>
        </div>
      </Card>
    </motion.div>
  );
}
