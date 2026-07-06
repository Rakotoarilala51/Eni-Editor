/**
 * Mise en surbrillance (fausse coloration syntaxique) pour les fichiers .algo.
 * (extrait tel quel de <script> — logique inchangée)
 */

const KEYWORD_ALT =
  "si|alors|sinon|sinonsi|finsi|tantque|faire|finfaire|pour|haut|bas|répéter|repeter|jusqu'à|jusqua|retourner|debfonc|finfonc|debproc|finproc|écrire|ecrire|lire|vrai|faux|et|ou|non|mod|div|entier|réel|reel|chaine|caractère|caractere|booléen|booleen|vide|arrêt|arret|nouveau|dr|d|pointeur|structure";

const HL_RE = new RegExp(
  '(\\/\\/.*$)' +                              // 1 commentaire
  '|("(?:[^"\\\\]|\\\\.)*"|ʺ[^ʺ]*ʺ)' +           // 2 chaîne
  '|(\\b\\d+(?:\\.\\d+)?\\b)' +                  // 3 nombre
  '|(\\b(?:' + KEYWORD_ALT + ')\\b)' +           // 4 mot-clé
  '|([A-Za-zÀ-ÖØ-öø-ÿ_][A-Za-zÀ-ÖØ-öø-ÿ0-9_]*)(?=\\s*\\()', // 5 appel de fonction
  'gmi'
);

export function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function highlightAlgo(code: string): string {
  const escaped = escapeHtml(code);
  return escaped.replace(HL_RE, (m, comment, str, num, kw, func) => {
    if (comment) return `<span class="tok-comment">${m}</span>`;
    if (str) return `<span class="tok-string">${m}</span>`;
    if (num) return `<span class="tok-number">${m}</span>`;
    if (kw) return `<span class="tok-keyword">${m}</span>`;
    if (func) return `<span class="tok-func">${m}</span>`;
    return m;
  });
}
