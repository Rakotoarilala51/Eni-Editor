import { useEffect, useEffectEvent } from "react";

/** Keep the listener mounted while reading the latest program and dialog state. */
export function useExecutionShortcut(run: () => void, disabled: boolean) {
  const handleKeyDown = useEffectEvent((event: KeyboardEvent) => {
    if (disabled || event.isComposing || event.repeat) return;
    if (
      event.key === "F5" ||
      ((event.ctrlKey || event.metaKey) && event.key === "Enter")
    ) {
      event.preventDefault();
      run();
    }
  });

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);
}
