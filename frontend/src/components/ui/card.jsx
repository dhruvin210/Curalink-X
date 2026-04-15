import { cn } from "../../lib/utils";

export function Card({ className, ...props }) {
  return (
    <div
      className={cn(
        "rounded-[28px] border border-slate-200/70 bg-white/80 shadow-[0_24px_80px_rgba(2,6,23,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.045] dark:shadow-[0_24px_80px_rgba(2,6,23,0.26)]",
        className
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }) {
  return <div className={cn("flex flex-col gap-3 p-6", className)} {...props} />;
}

export function CardTitle({ className, ...props }) {
  return (
    <h3
      className={cn(
        "text-lg font-semibold tracking-tight text-slate-900 dark:text-slate-50",
        className
      )}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }) {
  return (
    <p className={cn("text-sm text-slate-500 dark:text-slate-400", className)} {...props} />
  );
}

export function CardContent({ className, ...props }) {
  return <div className={cn("px-6 pb-6", className)} {...props} />;
}
