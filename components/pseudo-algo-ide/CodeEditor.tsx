"use client";

import { memo, useCallback, useEffect, useRef } from "react";
import Editor, { type OnMount, type OnChange } from "@monaco-editor/react";
import type * as monacoEditor from "monaco-editor";
import {
  registerPseudocodeLanguage,
  PSEUDOCODE_LANGUAGE_ID,
  PSEUDOCODE_THEME_ID,
} from "@/lib/pseudoLanguage";
import { registerBlockAutoClose } from "@/lib/blockAutoClose";

const EDITOR_OPTIONS: monacoEditor.editor.IStandaloneEditorConstructionOptions =
  {
    fontFamily: "var(--font-geist-mono), monospace",
    fontSize: 13,
    lineHeight: 24,
    tabSize: 4,
    insertSpaces: true,
    minimap: { enabled: false },
    scrollBeyondLastLine: false,
    automaticLayout: true,
    renderLineHighlight: "line",
    padding: { top: 24, bottom: 24 },
    lineNumbers: "on",
    lineNumbersMinChars: 3,
    glyphMargin: false,
    folding: false,
    overviewRulerLanes: 0,
    wordWrap: "on",
  };

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  onCursorChange: (label: string) => void;
}

export default memo(function CodeEditor({
  value,
  onChange,
  onCursorChange,
}: CodeEditorProps) {
  const cleanupRef = useRef<(() => void) | null>(null);

  useEffect(() => () => cleanupRef.current?.(), []);

  const handleMount: OnMount = useCallback(
    (editor, monaco) => {
      cleanupRef.current?.();
      registerPseudocodeLanguage(monaco);
      monaco.editor.setModelLanguage(
        editor.getModel()!,
        PSEUDOCODE_LANGUAGE_ID,
      );
      monaco.editor.setTheme(PSEUDOCODE_THEME_ID);
      const blockSubscription = registerBlockAutoClose(editor, monaco);

      const cursorSubscription = editor.onDidChangeCursorPosition((e) => {
        onCursorChange(`Ln ${e.position.lineNumber}, Col ${e.position.column}`);
      });

      // Force un premier recalcul de layout une fois monté dans son conteneur
      // à taille définie (évite une gouttière de numéros de ligne mal calculée
      // au premier rendu, notamment dans un parent flex).
      const frame = requestAnimationFrame(() => editor.layout());
      cleanupRef.current = () => {
        cancelAnimationFrame(frame);
        cursorSubscription.dispose();
        blockSubscription.dispose();
      };
    },
    [onCursorChange],
  );

  const handleChange: OnChange = useCallback(
    (val) => {
      onChange(val ?? "");
    },
    [onChange],
  );

  return (
    <div className="relative min-h-0 flex-1" id="editorContainer">
      <div className="absolute inset-0">
        <Editor
          loading={
            <span className="text-xs text-white/50">
              Chargement de l’éditeur…
            </span>
          }
          value={value}
          language={PSEUDOCODE_LANGUAGE_ID}
          theme={PSEUDOCODE_THEME_ID}
          onChange={handleChange}
          onMount={handleMount}
          height="100%"
          width="100%"
          options={EDITOR_OPTIONS}
        />
      </div>
    </div>
  );
});
