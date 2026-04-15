import { AnimatePresence, motion } from "framer-motion";
import { MessageSquareDashed } from "lucide-react";
import { useMemo } from "react";
import { useAutoScroll } from "../../hooks/useAutoScroll";
import { ScrollArea } from "../ui/scroll-area";
import { Skeleton } from "../ui/skeleton";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";

export function ChatFeed({ activeSession, loading, loadingSession }) {
  const messages = activeSession?.messages || [];
  const scrollRef = useAutoScroll([messages.length, loading]);

  const latestAssistantIndex = useMemo(
    () => [...messages].map((message) => message.role).lastIndexOf("assistant"),
    [messages]
  );

  if (!messages.length && !loading) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-[28px] border border-dashed border-white/10 bg-white/[0.03] px-8 py-14 text-center">
        <div className="mb-5 rounded-3xl border border-slate-200 bg-white p-5 dark:border-white/10 dark:bg-white/5">
          <MessageSquareDashed className="h-8 w-8 text-sky-500 dark:text-sky-300" />
        </div>
        <h3 className="text-xl font-semibold text-slate-950 dark:text-white">
          Start a medical research thread
        </h3>
        <p className="mt-2 max-w-md text-sm text-slate-600 dark:text-slate-400">
          Ask a treatment, disease, or trial question and Curalink X will synthesize
          ranked evidence, what-if analysis, and risk signals into the workspace.
        </p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-18rem)] pr-3" ref={scrollRef}>
      <div className="space-y-4 pb-4">
        {loadingSession ? (
          <div className="space-y-3">
            <Skeleton className="h-28 w-3/4" />
            <Skeleton className="ml-auto h-20 w-1/2" />
          </div>
        ) : null}

        <AnimatePresence initial={false}>
          {messages.map((message, index) => (
            <motion.div
              key={`${message.role}-${index}-${message.content?.slice(0, 16)}`}
              layout
            >
              <MessageBubble
                message={message}
                isLatestAssistant={index === latestAssistantIndex}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {loading ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <TypingIndicator />
          </motion.div>
        ) : null}
      </div>
    </ScrollArea>
  );
}
