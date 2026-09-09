import { ArrowDownToLine, Columns2, Play, Plus, Rows2 } from "lucide-react";

interface PlaygroundToolbarProps {
  title: string;
  stacked: boolean;
  onOpenDraft: () => void;
  onDownload: () => void;
  onToggleLayout: () => void;
  onRun: () => void;
}

export default function PlaygroundToolbar({
  title,
  stacked,
  onOpenDraft,
  onDownload,
  onToggleLayout,
  onRun,
}: PlaygroundToolbarProps) {
  return (
    <div className="playground-toolbar">
      <div className="project-name">
        <span className="project-mark">/</span>
        <span>{title}</span>
        <span className="language-badge">.algo</span>
      </div>
      <div className="toolbar-actions">
        <button
          className="icon-button"
          title="Ouvrir mon brouillon"
          aria-label="Ouvrir mon brouillon"
          onClick={onOpenDraft}
        >
          <Plus size={17} />
        </button>
        <button
          className="icon-button"
          title="Télécharger le code"
          aria-label="Télécharger le code"
          onClick={onDownload}
        >
          <ArrowDownToLine size={17} />
        </button>
        <button
          className="icon-button layout-toggle"
          title="Changer la disposition"
          aria-label="Empiler les panneaux"
          aria-pressed={stacked}
          onClick={onToggleLayout}
        >
          {stacked ? <Columns2 size={17} /> : <Rows2 size={17} />}
        </button>
        <span className="toolbar-divider" />
        <button className="run-button" onClick={onRun}>
          <Play size={14} fill="currentColor" /> Exécuter <kbd>Ctrl ↵</kbd>
        </button>
      </div>
    </div>
  );
}
