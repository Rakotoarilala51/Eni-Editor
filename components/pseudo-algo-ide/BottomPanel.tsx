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

const PLACEHOLDER_CLASS = 'p-3.5 text-[12.5px] text-[#8a8a8a] font-sans';

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
    <div className="flex h-57.5 flex-none flex-col border-t border-[#1b1b1b] bg-[#1e1e1e]">
      <div className="flex h-8.75 items-center gap-0.5 border-b border-[#2a2a2a] px-2.5">
        {PANEL_TABS.map((tab) => (
          <div
            key={tab.view}
            className={`flex h-8.75 cursor-pointer items-center border-b px-2.5 text-[11px] uppercase tracking-[0.03em] ${
              activeView === tab.view
                ? 'border-white text-white'
                : 'border-transparent text-[#8a8a8a]'
            }`}
            data-view={tab.view}
            onClick={() => onChangeView(tab.view)}
          >
            {tab.label}
          </div>
        ))}
        <div className="ml-auto flex gap-1.5">
          <button
            id="clearTermBtn"
            className="rounded font-sans text-[11px] text-[#8a8a8a] hover:bg-[#3a3d41] hover:text-white px-2 py-1"
            onClick={onClearTerminal}
          >
            Effacer
          </button>
        </div>
      </div>
      <div className="relative min-h-0 flex-1">
        <TerminalView lines={terminalLines} active={activeView === 'terminalView'} />
        <StdinView active={activeView === 'stdinView'} value={stdinValue} onChange={onStdinChange} />
        <div
          className={`absolute inset-0 overflow-auto ${activeView === 'problemsView' ? 'block' : 'hidden'}`}
          id="problemsView"
        >
          <div className={PLACEHOLDER_CLASS}>Aucun problème détecté dans l&apos;espace de travail.</div>
        </div>
        <div
          className={`absolute inset-0 overflow-auto ${activeView === 'outputView' ? 'block' : 'hidden'}`}
          id="outputView"
        >
          <div className={PLACEHOLDER_CLASS}>
            Aucune tâche de compilation configurée — utilisez « Exécuter » pour lancer l&apos;interpréteur.
          </div>
        </div>
        <div
          className={`absolute inset-0 overflow-auto ${activeView === 'debugView' ? 'block' : 'hidden'}`}
          id="debugView"
        >
          <div className={PLACEHOLDER_CLASS}>Aucune session de débogage active.</div>
        </div>
      </div>
    </div>
  );
}