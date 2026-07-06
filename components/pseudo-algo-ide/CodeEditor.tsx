"use client";

import { useCallback, useRef } from "react";
import Editor, { type OnMount, type OnChange } from "@monaco-editor/react";
import type * as monacoEditor from "monaco-editor";
import {
  registerPseudocodeLanguage,
  PSEUDOCODE_LANGUAGE_ID,
  PSEUDOCODE_THEME_ID,
} from "@/lib/pseudoLanguage";
import { registerBlockAutoClose } from "@/lib/blockAutoClose";

interface CodeEditorProps {
  value: string;
  onChange: (value: string) => void;
  onCursorChange: (label: string) => void;
}

export default function CodeEditor({
  value,
  onChange,
  onCursorChange,
}: CodeEditorProps) {
  const editorRef = useRef<monacoEditor.editor.IStandaloneCodeEditor | null>(
    null,
  );

  const handleMount: OnMount = useCallback(
    (editor, monaco) => {
      editorRef.current = editor;
      registerPseudocodeLanguage(monaco);
      monaco.editor.setModelLanguage(
        editor.getModel()!,
        PSEUDOCODE_LANGUAGE_ID,
      );
      monaco.editor.setTheme(PSEUDOCODE_THEME_ID);
      registerBlockAutoClose(editor, monaco);

      editor.onDidChangeCursorPosition((e) => {
        onCursorChange(`Ln ${e.position.lineNumber}, Col ${e.position.column}`);
      });

      // Force un premier recalcul de layout une fois monté dans son conteneur
      // à taille définie (évite une gouttière de numéros de ligne mal calculée
      // au premier rendu, notamment dans un parent flex).
      requestAnimationFrame(() => editor.layout());
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
          value={value}
          language={PSEUDOCODE_LANGUAGE_ID}
          theme={PSEUDOCODE_THEME_ID}
          onChange={handleChange}
          onMount={handleMount}
          height="100%"
          width="100%"
          options={{
            fontFamily: "Consolas, 'Courier New', ui-monospace, monospace",
            fontSize: 14,
            lineHeight: 20,
            tabSize: 4,
            insertSpaces: true,
            minimap: { enabled: true },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            renderLineHighlight: "line",
            padding: { top: 10, bottom: 10 },
            lineNumbers: "on",
            lineNumbersMinChars: 3,
            glyphMargin: false,
          }}
        />
      </div>
    </div>
  );
}
