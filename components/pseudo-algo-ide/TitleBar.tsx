import { LogoIcon } from './icons';

interface TitleBarProps {
  onRun: () => void;
}

/** Barre de titre façon VS Code (menus décoratifs + contrôles fenêtre). */
export default function TitleBar({ onRun }: TitleBarProps) {
  return (
    <div className="titlebar">
      <div className="tb-icon">
        <LogoIcon />
      </div>
      <div className="tb-menu" title="Menus décoratifs (démo)">
        <span>Fichier</span>
        <span>Édition</span>
        <span>Sélection</span>
        <span>Affichage</span>
        <span>Aller à</span>
        <span id="menuRun" onClick={onRun}>Exécuter</span>
        <span>Terminal</span>
        <span>Aide</span>
      </div>
      <div className="tb-title">interpreteur-pseudocode — Pseudo Algo IDE — Visual Studio Code</div>
      <div className="tb-controls">
        <span>&#8211;</span>
        <span>&#9633;</span>
        <span className="close">&#10005;</span>
      </div>
    </div>
  );
}
