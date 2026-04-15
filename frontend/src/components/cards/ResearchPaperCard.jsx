import { motion } from "framer-motion";
import { ExternalLink } from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { getEvidenceTone } from "../../lib/utils";

export function ResearchPaperCard({ paper, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -4 }}
    >
      <Card className="overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone={getEvidenceTone(paper.evidence_strength)}>
              {paper.evidence_strength || "Emerging"} evidence
            </Badge>
            <Badge tone="info">{paper.credibility_badge || "Source"}</Badge>
          </div>
          <CardTitle className="text-base leading-7">{paper.title}</CardTitle>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {paper.authors} {" - "} {paper.year} {" - "} {paper.source}
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-7 text-slate-700 dark:text-slate-300">
            {paper.summary}
          </p>
          <Button asChild variant="secondary" size="sm">
            <a href={paper.url} target="_blank" rel="noreferrer">
              View Source
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
}
