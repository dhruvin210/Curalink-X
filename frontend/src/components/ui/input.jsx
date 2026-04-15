import { cn } from "../../lib/utils";

export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        "flex h-11 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/30 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-50 dark:placeholder:text-slate-500",
        className
      )}
      {...props}
    />
  );
}
