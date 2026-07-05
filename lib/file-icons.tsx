/**
 * Icônes de fichiers (explorateur + onglets).
 * (SVG extrait tel quel de fileIcon()/tabIcon() — logique/tracés inchangés,
 * juste convertis en composants React réutilisables)
 */

export function FileIcon({ name }: { name: string }) {
  if (name.endsWith('.md')) {
    return (
      <svg viewBox="0 0 24 24">
        <rect x="2" y="4" width="20" height="16" rx="1.5" fill="#1e6fb8" />
        <path d="M5 16V8h2.2l2.3 3 2.3-3H14v8h-2.2v-4.6L9.5 14l-2.3-2.6V16H5zm12.5 0-3-3.4h2V8h2v4.6h2L17.5 16z" fill="#fff" />
      </svg>
    );
  }
  return (
    <svg viewBox="0 0 24 24">
      <path d="M6 2h8l4 4v16H6z" fill="#2b2b2b" stroke="#4ade80" strokeWidth={1.2} />
      <path
        d="M9 12l-2 2 2 2M15 12l2 2-2 2M13 10l-2 8"
        stroke="#4ade80"
        strokeWidth={1.3}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Alias : les onglets utilisent la même icône que l'explorateur (tabIcon === fileIcon) */
export function TabIcon({ name }: { name: string }) {
  return <FileIcon name={name} />;
}
