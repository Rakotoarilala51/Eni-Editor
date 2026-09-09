import { memo } from "react";
import type { OutputLine } from "@/lib/runProgram";

interface ProgramOutputProps {
  output: readonly OutputLine[];
}

// Input changes do not need to render the previous execution's output again.
export default memo(function ProgramOutput({ output }: ProgramOutputProps) {
  return (
    <div
      className="output"
      role="log"
      aria-label="Sortie du programme"
      aria-live="polite"
    >
      {output.length ? (
        output.map((line, index) => (
          <div className={`output-line ${line.kind ?? ""}`} key={index}>
            <span className="output-prefix">
              {line.kind === "error" ? "!" : line.kind === "meta" ? "↳" : "›"}
            </span>
            <span>{line.text}</span>
          </div>
        ))
      ) : (
        <div className="empty-output">
          <span className="empty-symbol">&gt;_</span>
          <h3>À vous de jouer.</h3>
          <p>
            Exécutez votre algorithme.
            <br />
            Son résultat apparaîtra ici.
          </p>
          <span className="empty-shortcut">CTRL + ENTRÉE</span>
        </div>
      )}
    </div>
  );
});
