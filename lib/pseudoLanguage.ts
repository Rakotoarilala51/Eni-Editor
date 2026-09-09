import type * as Monaco from 'monaco-editor';

export const PSEUDOCODE_LANGUAGE_ID = 'pseudo-algo';
export const PSEUDOCODE_THEME_ID = 'pseudo-algo-dark';

let registered = false;

// Liste exacte reprise de KEYWORD_ALT (highlight.ts)
const KEYWORDS = [
  'si', 'alors', 'sinon', 'sinonsi', 'finsi',
  'tantque', 'faire', 'finfaire',
  'pour', 'haut', 'bas',
  'répéter', 'repeter', "jusqu'à", 'jusqua',
  'retourner',
  'debfonc', 'finfonc', 'debproc', 'finproc',
  'écrire', 'ecrire', 'lire',
  'vrai', 'faux', 'et', 'ou', 'non', 'mod', 'div',
  'entier', 'réel', 'reel', 'chaine', 'caractère', 'caractere',
  'booléen', 'booleen', 'vide',
  'arrêt', 'arret', 'nouveau', 'dr', 'd', 'pointeur', 'structure'
];

export function registerPseudocodeLanguage(monaco: typeof Monaco) {
  if (registered) return;
  registered = true;

  monaco.languages.register({ id: PSEUDOCODE_LANGUAGE_ID });

  monaco.languages.setLanguageConfiguration(PSEUDOCODE_LANGUAGE_ID, {
    comments: { lineComment: '//' },
    brackets: [['(', ')'], ['[', ']'], ['{', '}']],
    autoClosingPairs: [
      { open: '(', close: ')' },
      { open: '[', close: ']' },
      { open: '{', close: '}' },
      { open: '"', close: '"' },
      { open: 'ʺ', close: 'ʺ' },
    ],
  });

  monaco.languages.setMonarchTokensProvider(PSEUDOCODE_LANGUAGE_ID, {
    ignoreCase: true,
    keywords: KEYWORDS,

    tokenizer: {
      root: [
        // 1. commentaire //...
        [/\/\/.*$/, 'comment'],

        // 2. chaîne "..." ou ʺ...ʺ
        [/"(?:[^"\\]|\\.)*"/, 'string'],
        [/ʺ[^ʺ]*ʺ/, 'string'],

        // 3. nombre
        [/\b\d+(?:\.\d+)?\b/, 'number'],

        // 4/5. mot-clé, sinon appel de fonction si suivi de '(', sinon identifiant
        [/[A-Za-zÀ-ÖØ-öø-ÿ_][A-Za-zÀ-ÖØ-öø-ÿ0-9_]*(?=\s*\()/, {
          cases: {
            '@keywords': 'keyword',
            '@default': 'support.function',
          },
        }],
        [/[A-Za-zÀ-ÖØ-öø-ÿ_][A-Za-zÀ-ÖØ-öø-ÿ0-9_]*/, {
          cases: {
            '@keywords': 'keyword',
            '@default': 'identifier',
          },
        }],

        [/->|:=|<>|<=|>=|[=<>+\-*/]/, 'operator'],
        [/[.,;:]/, 'delimiter'],
        [/[()[\]{}]/, '@brackets'],
        [/\s+/, 'white'],
      ],
    },
  });

  // Correspondance approximative avec tes classes CSS tok-comment / tok-string /
  // tok-number / tok-keyword / tok-func — ajuste les couleurs si besoin.
  monaco.editor.defineTheme(PSEUDOCODE_THEME_ID, {
    base: 'vs-dark',
    inherit: true,
    rules: [
      { token: 'comment', foreground: '777a80', fontStyle: 'italic' },  // tok-comment
      { token: 'string', foreground: 'bfc1c5' },                        // tok-string
      { token: 'number', foreground: 'd7d8da' },                        // tok-number
      { token: 'keyword', foreground: 'ffffff', fontStyle: 'bold' },    // tok-keyword
      { token: 'support.function', foreground: 'eeeeee' },              // tok-func
      { token: 'operator', foreground: 'd4d4d4' },
    ],
    colors: {
      'editor.background': '#1f2228',
      'editor.foreground': '#d4d4d4',
      'editorLineNumber.foreground': '#858585',
    },
  });
}