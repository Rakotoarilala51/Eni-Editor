import { memo, useId } from "react";
import { ChevronDown } from "lucide-react";

interface ProgramInputProps {
  value: string;
  onChange: (value: string) => void;
}

export default memo(function ProgramInput({
  value,
  onChange,
}: ProgramInputProps) {
  const inputId = useId();
  return (
    <details className="input-section">
      <summary>
        Entrées du programme{" "}
        <span>
          lire() <ChevronDown size={13} />
        </span>
      </summary>
      <label htmlFor={inputId}>
        Une valeur par ligne, à renseigner avant d’exécuter.
      </label>
      <textarea
        id={inputId}
        spellCheck={false}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={"Exemple :\n12\n8"}
      />
    </details>
  );
});
