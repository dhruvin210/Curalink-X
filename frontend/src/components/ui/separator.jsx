import { cn } from "../../lib/utils";

export function Separator({ className, orientation = "horizontal" }) {
  return (
    <div
      className={cn(
        orientation === "horizontal"
          ? "h-px w-full bg-white/10"
          : "h-full w-px bg-white/10",
        className
      )}
    />
  );
}
