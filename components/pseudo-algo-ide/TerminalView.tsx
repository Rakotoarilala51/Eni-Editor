"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { ChevronRight, XCircle, Info, TerminalSquare } from "lucide-react";

export interface TerminalLine {
  text: string;
  cls?: "prompt" | "error" | "meta";
}

interface TerminalViewProps {
  lines: TerminalLine[];
  active: boolean;
}

type LineStyle = { text: string; icon: ReactNode };
type LineCls = NonNullable<TerminalLine["cls"]>;

const LINE_STYLE: Record<LineCls, LineStyle> = {
  prompt: {
    text: "text-[#4ade80]",
    icon: (
      <ChevronRight className="mt-0.75 h-3.5 w-3.5 flex-none text-[#4ade80]" />
    ),
  },
  error: {
    text: "text-[#f14c4c]",
    icon: <XCircle className="mt-0.75 h-3.5 w-3.5 flex-none text-[#f14c4c]" />,
  },
  meta: {
    text: "text-[#3794ff]",
    icon: <Info className="mt-0.75 h-3.5 w-3.5 flex-none text-[#3794ff]" />,
  },
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
      className={`absolute inset-0 overflow-auto font-[Consolas,'Courier_New',ui-monospace,monospace] text-[13px] leading-[1.7] text-[#cccccc] ${
        active ? "block" : "hidden"
      }`}
      id="terminalView"
      ref={ref}
    >
      {lines.length === 0 ? (
        <div className="flex h-full flex-col items-center justify-center gap-2 px-4 text-center text-[#5a5a5a]">
          <TerminalSquare className="h-7 w-7 text-[#3a3a3a]" />
          <div className="text-xs">
            Aucune sortie pour l&apos;instant — exécutez un fichier{" "}
            <code className="rounded-[3px] bg-[#2d2d2d] px-1.5 py-px text-[#ce9178]">
              .algo
            </code>{" "}
            (bouton ▷ ou F5) pour voir le résultat ici.
          </div>
        </div>
      ) : (
        <div className="p-2.5 px-4">
          {lines.map((line, i) => {
            const style = line.cls ? LINE_STYLE[line.cls] : null;
            return (
              <div
                key={i}
                className="flex items-start gap-1.5 py-px hover:bg-white/3"
              >
                {style ? (
                  style.icon
                ) : (
                  <span className="mt-0.75 h-3.5 w-3.5 flex-none" />
                )}
                <span
                  className={`whitespace-pre-wrap break-all ${style ? style.text : ""}`}
                >
                  {line.text}
                </span>
              </div>
            );
          })}
          {active && (
            <div className="flex items-center gap-1.5 py-px">
              <ChevronRight className="h-3.5 w-3.5 flex-none text-[#4ade80]" />
              <span className="inline-block h-3.5 w-1.75 animate-pulse bg-[#cccccc]" />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
