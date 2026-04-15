import { motion } from "framer-motion";
import { ChevronDown, MapPin } from "lucide-react";
import { useState } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger
} from "../ui/collapsible";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

function getTrialTone(status = "") {
  const normalized = status.toLowerCase();
  if (normalized.includes("recruit")) {
    return "success";
  }
  if (normalized.includes("complete")) {
    return "warning";
  }
  return "neutral";
}

export function ClinicalTrialCard({ trial, index }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06 }}
      whileHover={{ y: -4 }}
    >
      <Card>
        <CardHeader className="gap-4">
          <div className="flex items-center justify-between gap-3">
            <Badge tone={getTrialTone(trial.status)}>{trial.status}</Badge>
            <div className="inline-flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <MapPin className="h-3.5 w-3.5 text-sky-500 dark:text-sky-300" />
              {trial.location || "Global"}
            </div>
          </div>
          <CardTitle className="text-base leading-7">{trial.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Collapsible open={open} onOpenChange={setOpen}>
            <CollapsibleTrigger className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-700 dark:border-white/10 dark:bg-white/[0.03] dark:text-slate-200">
              Eligibility details
              <ChevronDown
                className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`}
              />
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-3 text-sm leading-7 text-slate-600 dark:text-slate-400">
              {trial.eligibility}
            </CollapsibleContent>
          </Collapsible>
        </CardContent>
      </Card>
    </motion.div>
  );
}
