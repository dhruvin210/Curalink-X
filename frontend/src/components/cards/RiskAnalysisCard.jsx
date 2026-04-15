import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { clampScore } from "../../lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Progress } from "../ui/progress";

function getConfidenceLabel(score) {
  if (score >= 75) {
    return "High";
  }
  if (score >= 45) {
    return "Medium";
  }
  return "Low";
}

export function RiskAnalysisCard({ riskAnalysis }) {
  const confidence = clampScore(riskAnalysis?.confidence_score);

  return (
    <motion.div initial={{ opacity: 0, x: 18 }} animate={{ opacity: 1, x: 0 }}>
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="text-base">Risk Analysis</CardTitle>
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              <span>{getConfidenceLabel(confidence)} confidence</span>
              <span>{confidence}%</span>
            </div>
            <Progress value={confidence} />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-3xl border border-emerald-500/20 bg-emerald-500/10 p-4">
            <div className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-emerald-300">
              <CheckCircle2 className="h-4 w-4" />
              Benefits
            </div>
            <p className="text-sm leading-7 text-emerald-50/90">
              {riskAnalysis?.benefits || "Benefits will appear after synthesis."}
            </p>
          </div>
          <div className="rounded-3xl border border-rose-500/20 bg-rose-500/10 p-4">
            <div className="mb-2 inline-flex items-center gap-2 text-sm font-medium text-rose-300">
              <AlertTriangle className="h-4 w-4" />
              Risks
            </div>
            <p className="text-sm leading-7 text-rose-50/90">
              {riskAnalysis?.risks || "Risks will appear after synthesis."}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
