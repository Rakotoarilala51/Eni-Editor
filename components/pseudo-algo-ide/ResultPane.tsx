import { memo } from "react";
import { Terminal, Trash2 } from "lucide-react";
import ProgramInput from "./ProgramInput";
import ProgramOutput from "./ProgramOutput";
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
      <ProgramOutput output={output} />
      <ProgramInput value={stdin} onChange={onStdinChange} />
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
