import { BrainCircuit, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";

export function WhatIfPanel({ currentValue, latestScenario, onRunScenario, loading }) {
  const [value, setValue] = useState(currentValue || "");

  useEffect(() => {
    setValue(currentValue || "");
  }, [currentValue]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    await onRunScenario(value);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <BrainCircuit className="h-5 w-5 text-sky-300" />
          <CardTitle className="text-base">What-if Analysis</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <Input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="What if I take Vitamin D?"
          />
          <Button type="submit" className="w-full" disabled={loading || !value.trim()}>
            <Sparkles className="h-4 w-4" />
            {loading ? "Analyzing..." : "Simulate scenario"}
          </Button>
        </form>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-4">
          <p className="text-xs uppercase tracking-[0.2em] text-sky-500 dark:text-sky-300">
            Predicted impact
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-700 dark:text-slate-300">
            {latestScenario?.assessment ||
              "Run a what-if scenario to estimate benefit and caution signals."}
          </p>
          <p className="mt-3 text-sm leading-7 text-slate-500 dark:text-slate-500">
            {latestScenario?.caution || "Caution notes will appear here."}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
