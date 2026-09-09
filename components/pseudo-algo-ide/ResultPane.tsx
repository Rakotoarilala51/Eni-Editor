import { memo } from "react";
import { ChevronDown, Terminal, Trash2 } from "lucide-react";
import type { ExecutionResult } from "@/lib/runProgram";

interface ResultPaneProps extends ExecutionResult {
  stdin: string;
  onStdinChange: (value: string) => void;
  onClear: () => void;
}

export default memo(function ResultPane({
  output,
  status,
  stdin,
  onStdinChange,
  onClear,
}: ResultPaneProps) {
  return (
    <section className="result-pane" aria-label="Résultat du programme">
      <div className="pane-heading">
        <h2>
          <Terminal size={16} /> Résultat
        </h2>
        <button
          className="icon-button"
          title="Effacer la sortie"
          aria-label="Effacer la sortie"
          onClick={onClear}
        >
          <Trash2 size={14} />
        </button>
      </div>
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
      <details className="input-section">
        <summary>
          Entrées du programme{" "}
          <span>
            lire() <ChevronDown size={13} />
          </span>
        </summary>
        <label htmlFor="program-input">
          Une valeur par ligne, à renseigner avant d’exécuter.
        </label>
        <textarea
          id="program-input"
          spellCheck={false}
          value={stdin}
          onChange={(event) => onStdinChange(event.target.value)}
          placeholder={"Exemple :\n12\n8"}
        />
      </details>
      <div className="pane-footer">
        <span className="execution-status">
          <span className="status-dot" />
          {status}
        </span>
        <span>OUTPUT</span>
      </div>
    </section>
  );
});
