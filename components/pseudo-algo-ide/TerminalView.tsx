"use client";

import { useEffect, useRef } from "react";

export interface TerminalLine {
  text: string;
  cls?: "prompt" | "error" | "meta";
}

interface TerminalViewProps {
  lines: TerminalLine[];
  active: boolean;
}

const CLS_COLOR: Record<NonNullable<TerminalLine["cls"]>, string> = {
  prompt: "text-[#4ade80]",
  error: "text-[#f14c4c]",
  meta: "text-[#3794ff]",
};

/** Panneau TERMINAL : affiche les lignes produites par écrire()/l'exécution. */
export default function TerminalView({ lines, active }: TerminalViewProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Équivalent de `terminalView.scrollTop = terminalView.scrollHeight`
  // à chaque nouvelle ligne (termLine()).
  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [lines]);

  return (
    <div
      className={`absolute inset-0 overflow-auto p-2 px-3.5 font-[Consolas,'Courier_New',ui-monospace,monospace] text-[13px] leading-[1.6] text-[#cccccc] ${
        active ? "block" : "hidden"
      }`}
      id="terminalView"
      ref={ref}
    >
      {lines.map((line, i) => (
        <div
          key={i}
          className={`whitespace-pre-wrap ${line.cls ? CLS_COLOR[line.cls] : ""}`}
        >
          {line.text}
        </div>
      ))}
    </div>
  );
}
