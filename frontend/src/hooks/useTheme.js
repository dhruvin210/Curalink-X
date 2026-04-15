import { useEffect, useState } from "react";

const STORAGE_KEY = "curalink-theme";

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored || "dark";
  });

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    window.localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  return {
    theme,
    isDark: theme === "dark",
    toggleTheme: () => setTheme((current) => (current === "dark" ? "light" : "dark"))
  };
}
