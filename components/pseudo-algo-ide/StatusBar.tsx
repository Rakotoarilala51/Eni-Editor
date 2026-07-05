import { GitBranch } from 'lucide-react';

interface StatusBarProps {
  cursorLabel: string;
  langLabel: string;
}

const SB_ITEM = 'flex h-full cursor-default items-center gap-[5px] px-1.5 hover:bg-white/[0.12]';

/** Barre de statut bleue en bas de l'IDE. */
export default function StatusBar({ cursorLabel, langLabel }: StatusBarProps) {
  return (
    <div className="flex h-5.5 flex-none items-center justify-between bg-[#007acc] px-2.5 text-xs text-white">
      <div className="flex h-full items-center gap-3.5">
        <div className={SB_ITEM}>
          <GitBranch className="h-3.25 w-3.25" /> main
        </div>
        <div className={SB_ITEM} id="sbProblems">
          ⊗ 0  ⚠ 0
        </div>
      </div>
      <div className="flex h-full items-center gap-3.5">
        <div className={SB_ITEM} id="sbPos">{cursorLabel}</div>
        <div className={SB_ITEM}>Espaces : 4</div>
        <div className={SB_ITEM}>UTF-8</div>
        <div className={SB_ITEM} id="sbLang">{langLabel}</div>
      </div>
    </div>
  );
}