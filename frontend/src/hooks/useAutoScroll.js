import { useEffect, useRef } from "react";

export function useAutoScroll(dependencies = []) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current) {
      return;
    }

    ref.current.scrollTo({
      top: ref.current.scrollHeight,
      behavior: "smooth"
    });
  }, dependencies);

  return ref;
}
