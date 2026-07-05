/**
 * Fonctions utilitaires de conversion / comparaison utilisées par
 * l'interpréteur. (extrait tel quel de <script> — logique inchangée)
 */

export function normalize(s: unknown): string {
  return String(s)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export function toNumber(v: any): number {
  if (typeof v === 'number') return v;
  if (typeof v === 'boolean') return v ? 1 : 0;
  if (typeof v === 'string') {
    const n = parseFloat(v);
    return isNaN(n) ? 0 : n;
  }
  return 0;
}

export function toDisplay(v: any): string {
  if (v === undefined || v === null) return '';
  if (typeof v === 'boolean') return v ? 'vrai' : 'faux';
  if (Array.isArray(v)) return '[' + v.slice(1).join(', ') + ']';
  return String(v);
}

export function truthy(v: any): boolean {
  if (typeof v === 'boolean') return v;
  if (typeof v === 'number') return v !== 0;
  if (typeof v === 'string') return v.length > 0;
  return !!v;
}

export function looseEq(a: any, b: any): boolean {
  if (typeof a === 'boolean' || typeof b === 'boolean') return truthy(a) === truthy(b);
  if (typeof a === 'number' || typeof b === 'number') return toNumber(a) === toNumber(b);
  return a === b;
}
