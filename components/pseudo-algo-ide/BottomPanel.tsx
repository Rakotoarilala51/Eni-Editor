import TerminalView, { TerminalLine } from './TerminalView';
import StdinView from './StdinView';

export type PanelViewId = 'problemsView' | 'outputView' | 'debugView' | 'terminalView' | 'stdinView';

interface BottomPanelProps {
  activeView: PanelViewId;
  onChangeView: (view: PanelViewId) => void;
  terminalLines: TerminalLine[];
  onClearTerminal: () => void;
  stdinValue: string;
  onStdinChange: (value: string) => void;
}

const PANEL_TABS: { view: PanelViewId; label: string }[] = [
  { view: 'problemsView', label: 'Problèmes' },
  { view: 'outputView', label: 'Sortie' },
  { view: 'debugView', label: 'Console de débogage' },
  { view: 'terminalView', label: 'Terminal' },
  { view: 'stdinView', label: 'Entrée (stdin)' },
];

/** Panneau du bas : Problèmes / Sortie / Console de débogage / Terminal / Entrée (stdin). */
export default function BottomPanel({
  activeView,
  onChangeView,
  terminalLines,
  onClearTerminal,
  stdinValue,
  onStdinChange,
}: BottomPanelProps) {
  return (
    <div className="panel">
      <div className="panel-tabs">
        {PANEL_TABS.map((tab) => (
          <div
            key={tab.view}
            className={`panel-tab${activeView === tab.view ? ' active' : ''}`}
            data-view={tab.view}
            onClick={() => onChangeView(tab.view)}
          >
            {tab.label}
          </div>
        ))}
        <div className="panel-actions">
          <button id="clearTermBtn" onClick={onClearTerminal}>
            Effacer
          </button>
        </div>
      </div>
      <div className="panel-body">
        <TerminalView lines={terminalLines} active={activeView === 'terminalView'} />
        <StdinView active={activeView === 'stdinView'} value={stdinValue} onChange={onStdinChange} />
        <div className={`panel-view${activeView === 'problemsView' ? ' active' : ''}`} id="problemsView">
          <div className="placeholder-text">Aucun problème détecté dans l&apos;espace de travail.</div>
        </div>
        <div className={`panel-view${activeView === 'outputView' ? ' active' : ''}`} id="outputView">
          <div className="placeholder-text">
            Aucune tâche de compilation configurée — utilisez « Exécuter » pour lancer l&apos;interpréteur.
          </div>
        </div>
        <div className={`panel-view${activeView === 'debugView' ? ' active' : ''}`} id="debugView">
          <div className="placeholder-text">Aucune session de débogage active.</div>
        </div>
      </div>
    </div>
  );
}
