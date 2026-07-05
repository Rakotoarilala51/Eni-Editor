import { LogoIcon } from "./icons";

interface TitleBarProps {
  onRun: () => void;
}

const TB_CONTROL_ITEM =
  "flex h-[30px] w-11 items-center justify-center text-[11px] hover:bg-[#4b4b4b]";

/** Barre de titre façon VS Code (menus décoratifs + contrôles fenêtre). */
export default function TitleBar({ onRun }: TitleBarProps) {
  return (
    <div className="flex h-7.5 flex-none select-none items-center border-b border-[#1b1b1b] bg-[#3c3c3c] text-[12.5px] text-[#cccccc] [-webkit-app-region:drag]">
      <div className="flex w-7.5 items-center justify-center opacity-85">
        <LogoIcon />
      </div>
      <div className="flex gap-0.5" title="Menus décoratifs (démo)">
        <span className="cursor-default rounded px-2 py-1 hover:bg-[#505050]">
          Fichier
        </span>
        <span className="cursor-default rounded px-2 py-1 hover:bg-[#505050]">
          Édition
        </span>
        <span className="cursor-default rounded px-2 py-1 hover:bg-[#505050]">
          Sélection
        </span>
        <span className="cursor-default rounded px-2 py-1 hover:bg-[#505050]">
          Affichage
        </span>
        <span className="cursor-default rounded px-2 py-1 hover:bg-[#505050]">
          Aller à
        </span>
        <span
          id="menuRun"
          className="cursor-default rounded px-2 py-1 hover:bg-[#505050]"
          onClick={onRun}
        >
          Exécuter
        </span>
        <span className="cursor-default rounded px-2 py-1 hover:bg-[#505050]">
          Terminal
        </span>
        <span className="cursor-default rounded px-2 py-1 hover:bg-[#505050]">
          Aide
        </span>
      </div>
      <div className="flex-1 text-center text-xs text-[#a8a8a8]">
        interpreteur-pseudocode — Pseudo Algo IDE — Visual Studio Code
      </div>
      <div className="flex">
        <span className={TB_CONTROL_ITEM}>&#8211;</span>
        <span className={TB_CONTROL_ITEM}>&#9633;</span>
        <span className={`${TB_CONTROL_ITEM} hover:bg-[#e81123]!`}>
          &#10005;
        </span>
      </div>
    </div>
  );
}
