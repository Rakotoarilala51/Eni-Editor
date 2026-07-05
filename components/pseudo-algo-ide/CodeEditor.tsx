'use client';

import { useEffect, useRef } from 'react';
import { highlightAlgo } from '@/lib/highlight';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  onCursorChange: (label: string) => void;
}

/**
 * Éditeur de code : numéros de ligne + calque de surbrillance (lecture seule,
 * superposé) + textarea transparent pour la saisie/le curseur.
 * Reprend exactement la logique de synchronisation de l'original
 * (renderLineNumbers / renderHighlight / syncScroll / updateCursorStatus),
 * simplement pilotée par des refs React au lieu de sélections DOM directes.
 */
export default function CodeEditor({ value, onChange, onCursorChange }: CodeEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightCodeRef = useRef<HTMLElement>(null);
  const highlightPreRef = useRef<HTMLPreElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  // renderLineNumbers()
  let lineNumbersText = '';
  const lines = value.split('\n').length;
  for (let i = 1; i <= lines; i++) lineNumbersText += i + '\n';

  // renderHighlight()
  useEffect(() => {
    if (highlightCodeRef.current) {
      highlightCodeRef.current.innerHTML = highlightAlgo(value) + '\n';
    }
  }, [value]);

  function updateCursorStatus() {
    const el = textareaRef.current;
    if (!el) return;
    const val = el.value.slice(0, el.selectionStart ?? 0);
    const parts = val.split('\n');
    const ln = parts.length;
    const col = parts[parts.length - 1].length + 1;
    onCursorChange(`Ln ${ln}, Col ${col}`);
  }

  function syncScroll() {
    const ta = textareaRef.current;
    if (!ta) return;
    if (lineNumbersRef.current) lineNumbersRef.current.scrollTop = ta.scrollTop;
    if (highlightPreRef.current) {
      highlightPreRef.current.scrollTop = ta.scrollTop;
      highlightPreRef.current.scrollLeft = ta.scrollLeft;
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === 'Tab') {
      e.preventDefault();
      const ta = textareaRef.current;
      if (!ta) return;
      const start = ta.selectionStart, end = ta.selectionEnd;
      const newValue = ta.value.slice(0, start) + '    ' + ta.value.slice(end);
      onChange(newValue);
      // repositionne le curseur après les 4 espaces insérés, une fois le
      // textarea remis à jour avec la nouvelle valeur
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 4;
        }
      });
    }
  }

  return (
    <div className="editor-container" id="editorContainer">
      <div className="line-numbers" id="lineNumbers" ref={lineNumbersRef}>
        {lineNumbersText}
      </div>
      <div className="code-wrap">
        <pre className="highlight-layer" id="highlightLayer" ref={highlightPreRef}>
          <code ref={highlightCodeRef}></code>
        </pre>
        <textarea
          ref={textareaRef}
          className="code-input"
          id="codeInput"
          spellCheck={false}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onScroll={syncScroll}
          onKeyUp={updateCursorStatus}
          onClick={updateCursorStatus}
          onKeyDown={handleKeyDown}
        />
      </div>
    </div>
  );
}
