/**
 * Icônes SVG statiques de l'interface (barre de titre, barre d'activité,
 * barre de statut, bouton Exécuter). Tracés extraits tels quels du HTML
 * d'origine — uniquement convertis en composants React.
 */

export function LogoIcon() {
  return (
    <svg viewBox="0 0 24 24" width={16} height={16} fill="#5eead4">
      <path d="M12 2 3 7v10l9 5 9-5V7l-9-5zm0 2.2 6.6 3.7-6.6 3.7-6.6-3.7L12 4.2zM5 9.3l6 3.4v7L5 16.3v-7zm8 10.4v-7l6-3.4v7l-6 3.4z" />
    </svg>
  );
}

export function ExplorerIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
      <path d="M4 5h6l2 2h8v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z" />
    </svg>
  );
}

export function SearchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
      <circle cx={10.5} cy={10.5} r={6.5} />
      <line x1={15.5} y1={15.5} x2={21} y2={21} />
    </svg>
  );
}

export function GitIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
      <circle cx={6} cy={6} r={2.2} />
      <circle cx={6} cy={18} r={2.2} />
      <circle cx={18} cy={9} r={2.2} />
      <path d="M6 8.2V15.8M6 8c3 0 6 .5 6 4v0c0 1.4 2.7 1.6 4.5.7" />
    </svg>
  );
}

export function RunOutlineIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
      <path d="M6 4l14 8-14 8V4z" />
    </svg>
  );
}

export function ExtensionsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
      <rect x={4} y={4} width={7} height={7} />
      <rect x={13} y={4} width={7} height={7} />
      <rect x={4} y={13} width={7} height={7} />
      <rect x={13} y={13} width={7} height={7} />
    </svg>
  );
}

export function AccountIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
      <circle cx={12} cy={8} r={3.2} />
      <path d="M5 20c1.5-4 5-5.5 7-5.5s5.5 1.5 7 5.5" />
    </svg>
  );
}

export function SettingsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6}>
      <circle cx={12} cy={12} r={2.8} />
      <path d="M19 12a7 7 0 0 0-.1-1.2l2-1.5-2-3.4-2.3.9a7 7 0 0 0-2-1.2L14.2 3H9.8l-.4 2.6a7 7 0 0 0-2 1.2l-2.3-.9-2 3.4 2 1.5A7 7 0 0 0 5 12c0 .4 0 .8.1 1.2l-2 1.5 2 3.4 2.3-.9c.6.5 1.3.9 2 1.2l.4 2.6h4.4l.4-2.6c.7-.3 1.4-.7 2-1.2l2.3.9 2-3.4-2-1.5c.1-.4.1-.8.1-1.2z" />
    </svg>
  );
}

export function PlayFillIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

export function BranchIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
      <circle cx={6} cy={6} r={2.2} />
      <circle cx={6} cy={18} r={2.2} />
      <path d="M6 8.2V15.8" />
    </svg>
  );
}
