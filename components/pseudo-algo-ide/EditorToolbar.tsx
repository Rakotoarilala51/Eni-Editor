import { PlayFillIcon } from './icons';

interface EditorToolbarProps {
  activeFile: string | null;
  onRun: () => void;
}

/** Barre au-dessus de l'éditeur : fil d'Ariane + bouton "Exécuter". */
export default function EditorToolbar({ activeFile, onRun }: EditorToolbarProps) {
  return (
    <div className="editor-toolbar">
      <div className="breadcrumb" id="breadcrumb">
        {activeFile ? (
          <>
            PSEUDO-ALGO <span className="sep">›</span> {activeFile}
          </>
        ) : null}
      </div>
      <button
        className="run-btn primary"
        id="runBtn"
        title="Exécuter le fichier pseudo-code (F5)"
        onClick={onRun}
      >
        <PlayFillIcon />
        Exécuter
      </button>
    </div>
  );
}
