'use client';

import { useEffect, useRef } from 'react';

export interface TerminalLine {
  text: string;
  cls?: 'prompt' | 'error' | 'meta';
}

interface TerminalViewProps {
  lines: TerminalLine[];
  active: boolean;
}

/** Panneau TERMINAL : affiche les lignes produites par écrire()/l'exécution. */
export default function TerminalView({ lines, active }: TerminalViewProps) {
  const ref = useRef<HTMLDivElement>(null);

  // Équivalent de `terminalView.scrollTop = terminalView.scrollHeight`
  // à chaque nouvelle ligne (termLine()).
  useEffect(() => {
    if (ref.current) ref.current.scrollTop = ref.current.scrollHeight;
  }, [lines]);

  return (
    <div className={`panel-view${active ? ' active' : ''}`} id="terminalView" ref={ref}>
      {lines.map((line, i) => (
        <div key={i} className={`line${line.cls ? ' ' + line.cls : ''}`}>
          {line.text}
        </div>
      ))}
    </div>
  );
}
