import { useEffect, useState } from "react";

export function useStreamingText(text = "", enabled = true, speed = 10) {
  const [visibleText, setVisibleText] = useState(enabled ? "" : text);

  useEffect(() => {
    if (!enabled) {
      setVisibleText(text);
      return undefined;
    }

    setVisibleText("");

    let index = 0;
    const timer = window.setInterval(() => {
      index += 1;
      setVisibleText(text.slice(0, index));

      if (index >= text.length) {
        window.clearInterval(timer);
      }
    }, speed);

    return () => window.clearInterval(timer);
  }, [enabled, speed, text]);

  return visibleText;
}
