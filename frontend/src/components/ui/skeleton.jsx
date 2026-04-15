import { cn } from "../../lib/utils";

export function Skeleton({ className, ...props }) {
  return (
    <div
      className={cn("animate-pulse rounded-2xl bg-white/8", className)}
      {...props}
    />
  );
}
