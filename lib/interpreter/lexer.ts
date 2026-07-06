import type { Token } from './types';

/**
 * Lexer du pseudo-code. (extrait tel quel de <script> — logique inchangée)
 * Ajout : opérateur '->' pour l'accès aux champs d'un pointeur (listes chaînées).
 */
export function tokenize(src: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  const n = src.length;
  const isDigit = (c: string) => c >= '0' && c <= '9';
  const isIdentStart = (c: string) => /[A-Za-zÀ-ÖØ-öø-ÿ_]/.test(c);
  const isIdentPart = (c: string) => /[A-Za-zÀ-ÖØ-öø-ÿ0-9_']/.test(c);
  const TWO: Record<string, string> = {
    ':=': ':=', '<-': ':=', '<=': '<=', '>=': '>=', '<>': '<>', '!=': '<>',
    '->': '->',
  };
  const UNI: Record<string, string> = { '≠': '<>', '≤': '<=', '≥': '>=' };

  while (i < n) {
    const c = src[i];
    if (c === ' ' || c === '\t' || c === '\r' || c === '\n') { i++; continue; }
    if (c === '/' && src[i + 1] === '/') { while (i < n && src[i] !== '\n') i++; continue; }
    if (isDigit(c) || (c === '.' && isDigit(src[i + 1]))) {
      const start = i;
      while (i < n && isDigit(src[i])) i++;
      if (src[i] === '.' && isDigit(src[i + 1])) { i++; while (i < n && isDigit(src[i])) i++; }
      tokens.push({ type: 'NUMBER', value: parseFloat(src.slice(start, i)), pos: start });
      continue;
    }
    if (c === '"' || c === 'ʺ' || c === '“' || c === '”') {
      const q = c;
      const closing = q === '“' ? '”' : (q === '”' ? '“' : q);
      i++;
      let buf = '';
      while (i < n && src[i] !== q && src[i] !== closing) { buf += src[i]; i++; }
      i++;
      tokens.push({ type: 'STRING', value: buf, pos: i });
      continue;
    }
    if (isIdentStart(c)) {
      const start = i;
      while (i < n && isIdentPart(src[i])) i++;
      tokens.push({ type: 'IDENT', value: src.slice(start, i), pos: start });
      continue;
    }
    const two = src.slice(i, i + 2);
    if (TWO[two]) { tokens.push({ type: 'OP', value: TWO[two], pos: i }); i += 2; continue; }
    if (UNI[c]) { tokens.push({ type: 'OP', value: UNI[c], pos: i }); i++; continue; }
    if ('+-*/=<>&(),;[].:'.includes(c)) { tokens.push({ type: 'OP', value: c, pos: i }); i++; continue; }
    i++;
  }
  tokens.push({ type: 'EOF', value: null, pos: n });
  return tokens;
}