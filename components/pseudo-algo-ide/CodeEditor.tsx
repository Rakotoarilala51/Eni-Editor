'use client';

import { useEffect, useRef } from 'react';
import { highlightAlgo } from '@/lib/highlight';

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  onCursorChange: (label: string) => void;
}

const MONO_FONT = "font-[Consolas,'Courier_New',ui-monospace,monospace]";

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
    <div className="relative flex min-h-0 flex-1" id="editorContainer">
      <div
        className={`w-13 select-none overflow-hidden whitespace-pre bg-[#1e1e1e] py-2.5 pl-0 pr-2.5 text-right text-sm leading-5 text-[#858585] ${MONO_FONT}`}
        id="lineNumbers"
        ref={lineNumbersRef}
      >
        {lineNumbersText}
      </div>
      <div className="relative flex-1 overflow-hidden">
        <pre
          className={`pointer-events-none absolute inset-0 m-0 box-border overflow-auto whitespace-pre bg-transparent px-4 py-2.5 text-sm leading-5 text-[#d4d4d4] ${MONO_FONT}`}
          id="highlightLayer"
          ref={highlightPreRef}
        >
          <code ref={highlightCodeRef}></code>
        </pre>
        <textarea
          ref={textareaRef}
          className={`absolute inset-0 box-border resize-none overflow-auto whitespace-pre border-none bg-transparent px-4 py-2.5 text-sm leading-5 text-transparent caret-white outline-none ${MONO_FONT}`}
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