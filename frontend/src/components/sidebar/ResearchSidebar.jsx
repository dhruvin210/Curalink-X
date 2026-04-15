import { AnimatePresence, motion } from "framer-motion";
import {
  BookmarkPlus,
  Filter,
  History,
  MoonStar,
  Plus,
  Search,
  SunMedium
} from "lucide-react";
import { formatRelativeSession } from "../../lib/utils";
import { useThemeContext } from "../../hooks/useThemeContext";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";
import { Switch } from "../ui/switch";

export function ResearchSidebar({
  sessions,
  savedQueries,
  activeSessionId,
  filters,
  onSelectSession,
  onNewSession,
  onFilterChange
}) {
  const { isDark, toggleTheme } = useThemeContext();

  return (
    <motion.aside
      initial={{ opacity: 0, x: -24 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex h-full flex-col gap-4"
    >
      <Card className="overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-sky-500 dark:text-sky-300">
                Curalink X
              </p>
              <CardTitle className="mt-2 text-2xl leading-tight">
                AI Medical Research Copilot
              </CardTitle>
            </div>
            <Button
              variant="secondary"
              size="icon"
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {isDark ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button className="w-full justify-start" onClick={onNewSession}>
            <Plus className="h-4 w-4" />
            New investigation
          </Button>

          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input
              value={filters.disease}
              onChange={(event) => onFilterChange("disease", event.target.value)}
              placeholder="Filter by disease..."
              className="pl-11"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-sky-300" />
            <CardTitle className="text-base">Insight Filters</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            ["publications", "Publications"],
            ["trials", "Clinical trials"],
            ["risk", "Risk analysis"]
          ].map(([key, label]) => (
            <div key={key} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] px-4 py-3">
              <span className="text-sm text-slate-700 dark:text-slate-300">{label}</span>
              <Switch
                checked={filters[key]}
                onCheckedChange={(checked) => onFilterChange(key, checked)}
              />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="min-h-0 flex-1">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <History className="h-4 w-4 text-sky-300" />
            <CardTitle className="text-base">Chat History</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="flex min-h-0 flex-1 flex-col gap-4">
          <ScrollArea className="h-[280px]">
            <div className="space-y-3 pr-3">
              <AnimatePresence initial={false}>
                {sessions.map((session) => (
                  <motion.button
                    key={session.sessionId}
                    whileHover={{ x: 4 }}
                    type="button"
                    onClick={() => {
                      void onSelectSession(session.sessionId);
                    }}
                    className={`w-full rounded-2xl border px-4 py-3 text-left transition ${
                      activeSessionId === session.sessionId
                        ? "border-sky-500/30 bg-sky-500/10"
                        : "border-slate-200/70 bg-white/60 hover:border-slate-300 hover:bg-white dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-white/20 dark:hover:bg-white/[0.05]"
                    }`}
                  >
                    <div className="text-sm font-medium text-slate-900 dark:text-white">
                      {session.title}
                    </div>
                    <div className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      {formatRelativeSession(session.updatedAt)}
                    </div>
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
          </ScrollArea>

          <Separator />

          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
              <BookmarkPlus className="h-4 w-4 text-sky-500 dark:text-sky-300" />
              Saved queries
            </div>
            <div className="flex flex-wrap gap-2">
              {savedQueries.length ? (
                savedQueries.map((item) => (
                  <Badge key={item.id} tone="neutral" className="normal-case tracking-normal">
                    {item.summary}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-slate-500 dark:text-slate-500">No saved queries yet.</span>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.aside>
  );
}
