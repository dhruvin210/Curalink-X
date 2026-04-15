import { cva } from "class-variance-authority";
import { cn } from "../../lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]",
  {
    variants: {
      tone: {
        neutral:
          "border-slate-200 bg-slate-100 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300",
        success: "border-emerald-500/20 bg-emerald-500/10 text-emerald-300",
        warning: "border-amber-500/20 bg-amber-500/10 text-amber-300",
        danger: "border-rose-500/20 bg-rose-500/10 text-rose-300",
        info: "border-sky-500/20 bg-sky-500/10 text-sky-300"
      }
    },
    defaultVariants: {
      tone: "neutral"
    }
  }
);

export function Badge({ className, tone, ...props }) {
  return <span className={cn(badgeVariants({ tone }), className)} {...props} />;
}
