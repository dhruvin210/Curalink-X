import { cn } from "../../lib/utils";

export function Progress({ value = 0, className, indicatorClassName }) {
  return (
    <div
      className={cn(
        "relative h-2 overflow-hidden rounded-full bg-white/10",
        className
      )}
    >
      <div
        className={cn(
          "h-full rounded-full bg-gradient-to-r from-emerald-400 via-sky-400 to-indigo-400 transition-all duration-500",
          indicatorClassName
        )}
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
