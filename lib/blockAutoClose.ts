import type * as Monaco from 'monaco-editor';
import type { editor as MonacoEditor } from 'monaco-editor';

// Paires bloc ouvrant -> fermant, basées sur KEYWORD_ALT
const BLOCK_PAIRS: Record<string, string> = {
  debfonc: 'finfonc',
  debproc: 'finproc',
  si: 'finsi',
  pour: 'finpour',
  tantque: 'finfaire',
  répéter: "jusqu'à",
  repeter: 'jusqua',
};

// Construit une regex qui matche une des clés en fin de ligne (mot entier)
const OPEN_KEYWORDS = Object.keys(BLOCK_PAIRS);
const OPEN_RE = new RegExp(`\\b(${OPEN_KEYWORDS.join('|')})\\s*$`, 'i');

export function registerBlockAutoClose(
  editor: MonacoEditor.IStandaloneCodeEditor,
  monaco: typeof Monaco
) {
  editor.onKeyDown((e) => {
    if (e.keyCode !== monaco.KeyCode.Enter) return;

    const model = editor.getModel();
    const position = editor.getPosition();
    if (!model || !position) return;

    const lineContent = model.getLineContent(position.lineNumber);
    const beforeCursor = lineContent.slice(0, position.column - 1);
    const match = beforeCursor.match(OPEN_RE);
    if (!match) return; // comportement Entrée normal

    const openKeyword = match[1].toLowerCase();
    const closeKeyword = BLOCK_PAIRS[openKeyword];
    if (!closeKeyword) return;

    // On empêche l'insertion de retour à la ligne par défaut
    e.preventDefault();
    e.stopPropagation();

    const indentMatch = lineContent.match(/^(\s*)/);
    const baseIndent = indentMatch ? indentMatch[1] : '';
    const innerIndent = baseIndent + '    '; // 4 espaces, cohérent avec ton Tab

    const insertText = `\n${innerIndent}\n${baseIndent}${closeKeyword}`;

    editor.executeEdits('block-auto-close', [
      {
        range: new monaco.Range(
          position.lineNumber,
          position.column,
          position.lineNumber,
          position.column
        ),
        text: insertText,
        forceMoveMarkers: true,
      },
    ]);

    // Place le curseur sur la ligne vide intermédiaire
    editor.setPosition({
      lineNumber: position.lineNumber + 1,
      column: innerIndent.length + 1,
    });
  });
}