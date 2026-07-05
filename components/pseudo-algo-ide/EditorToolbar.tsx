import { PlayFillIcon } from './icons';

interface EditorToolbarProps {
  activeFile: string | null;
  onRun: () => void;
}

/** Barre au-dessus de l'éditeur : fil d'Ariane + bouton "Exécuter". */
export default function EditorToolbar({ activeFile, onRun }: EditorToolbarProps) {
  return (
    <div className="flex h-7.5 flex-none items-center justify-between border-b border-[#2a2a2a] bg-[#1e1e1e] px-2.5 text-xs text-[#8a8a8a]">
      <div className="flex items-center gap-1" id="breadcrumb">
        {activeFile ? (
          <>
            PSEUDO-ALGO <span className="opacity-50">›</span> {activeFile}
          </>
        ) : null}
      </div>
      <button
        className="flex items-center gap-1.5 rounded px-2 py-1 text-xs text-[#4ade80] hover:bg-[#3a3d41]"
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