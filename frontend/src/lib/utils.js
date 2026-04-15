import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatRelativeSession(dateValue) {
  if (!dateValue) {
    return "No activity yet";
  }

  const date = new Date(dateValue);
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(date);
}

export function getEvidenceTone(strength = "") {
  const normalized = strength.toLowerCase();

  if (normalized.includes("high") || normalized.includes("strong")) {
    return "success";
  }
  if (normalized.includes("moderate")) {
    return "warning";
  }
  return "danger";
}

export function clampScore(value) {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(numeric * 100)));
}
