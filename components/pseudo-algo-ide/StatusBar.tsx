import { BranchIcon } from './icons';

interface StatusBarProps {
  cursorLabel: string;
  langLabel: string;
}

/** Barre de statut bleue en bas de l'IDE. */
export default function StatusBar({ cursorLabel, langLabel }: StatusBarProps) {
  return (
    <div className="statusbar">
      <div className="sb-group">
        <div className="sb-item">
          <BranchIcon /> main
        </div>
        <div className="sb-item" id="sbProblems">
          ⊗ 0  ⚠ 0
        </div>
      </div>
      <div className="sb-group">
        <div className="sb-item" id="sbPos">{cursorLabel}</div>
        <div className="sb-item">Espaces : 4</div>
        <div className="sb-item">UTF-8</div>
        <div className="sb-item" id="sbLang">{langLabel}</div>
      </div>
    </div>
  );
}
