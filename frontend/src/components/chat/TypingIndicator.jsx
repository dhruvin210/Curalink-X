import { motion } from "framer-motion";

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 rounded-full border border-white/10 bg-white/5 px-4 py-2">
      {[0, 1, 2].map((dot) => (
        <motion.span
          key={dot}
          className="h-2 w-2 rounded-full bg-sky-300"
          animate={{ opacity: [0.25, 1, 0.25], y: [0, -2, 0] }}
          transition={{ duration: 1.1, repeat: Infinity, delay: dot * 0.12 }}
        />
      ))}
      <span className="ml-2 text-xs uppercase tracking-[0.22em] text-slate-400">
        Synthesizing
      </span>
    </div>
  );
}
