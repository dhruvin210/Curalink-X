import { cn } from "../../lib/utils";

export function Textarea({ className, ...props }) {
  return (
    <textarea
      className={cn(
        "flex min-h-[120px] w-full rounded-[24px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 focus:border-sky-400/50 focus:ring-2 focus:ring-sky-400/30 dark:border-white/10 dark:bg-slate-950/40 dark:text-slate-50 dark:placeholder:text-slate-500",
        className
      )}
      {...props}
    />
  );
}
