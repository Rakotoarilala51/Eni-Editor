"use client";

import { useEffect, useRef, useState } from "react";
import "./pseudo-algo-ide.css";

import { FILES } from "@/lib/files";
import {
  tokenize,
  Parser,
  Interpreter,
  PseudoError,
  StopSignal,
  type InterpreterIO,
} from "@/lib/interpreter";

import TitleBar from "./TitleBar";
import ActivityBar from "./ActivityBar";
import Sidebar from "./Sidebar";
import EditorTabs from "./EditorTabs";
import EditorToolbar from "./EditorToolbar";
import CodeEditor from "./CodeEditor";
import Watermark from "./Watermark";
import BottomPanel, { type PanelViewId } from "./BottomPanel";
import type { TerminalLine } from "./TerminalView";
import StatusBar from "./StatusBar";

export default function PseudoAlgoIDE() {
  const [contents, setContents] = useState<Record<string, string>>(() => ({
    ...FILES,
  }));
  const [fileNames, setFileNames] = useState<string[]>(() =>
    Object.keys(FILES),
  );
  const [openTabs, setOpenTabs] = useState<string[]>([]);
  const [activeFile, setActiveFile] = useState<string | null>(null);

  const [cursorLabel, setCursorLabel] = useState("Ln 1, Col 1");
  const [langLabel, setLangLabel] = useState("Pseudo-code Algo");

  const [activePanelView, setActivePanelView] =
    useState<PanelViewId>("terminalView");
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([]);
  const [stdinValue, setStdinValue] = useState("");

  function openFile(name: string) {
    setOpenTabs((prev) => (prev.includes(name) ? prev : [...prev, name]));
    setActiveFile(name);
  }

  function closeTab(name: string) {
    const idx = openTabs.indexOf(name);
    if (idx === -1) return;
    const next = [...openTabs.slice(0, idx), ...openTabs.slice(idx + 1)];
    setOpenTabs(next);
    if (activeFile === name) {
      setActiveFile(next.length ? next[Math.max(0, idx - 1)] : null);
    }
  }

  /** Crée un nouveau fichier vide, l'ajoute à l'explorateur et l'ouvre dans l'éditeur. */
  function createFile(name: string) {
    setContents((prev) => {
      if (name in prev) return prev; // sécurité : ne pas écraser un fichier existant
      return { ...prev, [name]: "" };
    });
    setFileNames((prev) => (prev.includes(name) ? prev : [...prev, name]));
    openFile(name);
  }

  useEffect(() => {
    if (!activeFile) return;
    if (activeFile.endsWith(".md")) {
      setLangLabel("Markdown");
    } else {
      setLangLabel("Pseudo-code Algo");
    }
    setCursorLabel("Ln 1, Col 1");
  }, [activeFile]);

  function handleCodeChange(newValue: string) {
    if (!activeFile) return;
    setContents((prev) => ({ ...prev, [activeFile]: newValue }));
  }

  function pushTermLine(text: string, cls?: TerminalLine["cls"]) {
    setTerminalLines((prev) => [...prev, { text, cls }]);
  }

  function runProgram() {
    if (!activeFile || !activeFile.endsWith(".algo")) {
      setActivePanelView("terminalView");
      pushTermLine(
        `Impossible d'exécuter "${activeFile || "(aucun fichier)"}" — sélectionnez un fichier .algo.`,
        "error",
      );
      return;
    }
    setActivePanelView("terminalView");
    // équivalent de terminalView.innerHTML=''; puis termLine('$ pseudo-algo run ...')
    setTerminalLines([
      { text: `$ pseudo-algo run ${activeFile}`, cls: "prompt" },
    ]);

    const src = contents[activeFile];
    const stdinLines = stdinValue.split(/\r?\n/);
    let idx = 0;
    const io: InterpreterIO = {
      write(s: string) {
        pushTermLine(s);
      },
      read() {
        return idx < stdinLines.length ? stdinLines[idx++] : "";
      },
    };
    try {
      const tokens = tokenize(src);
      const parser = new Parser(tokens);
      const program = parser.parseProgram();
      const interp = new Interpreter(io);
      interp.run(program);
      pushTermLine(`[terminé] ${activeFile} — code de sortie 0`, "meta");
    } catch (e: any) {
      if (e instanceof StopSignal)
        pushTermLine("--- Arrêt du programme ---", "meta");
      else if (e instanceof PseudoError)
        pushTermLine("Erreur : " + e.message, "error");
      else if (e instanceof RangeError)
        pushTermLine(
          "Erreur : récursion trop profonde (pile d'appels dépassée)",
          "error",
        );
      else pushTermLine("Erreur interne : " + (e?.message || e), "error");
    }
  }

  const runProgramRef = useRef(runProgram);
  runProgramRef.current = runProgram;
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "F5" || (e.ctrlKey && e.key === "Enter")) {
        e.preventDefault();
        runProgramRef.current();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    openFile("README.md");
    openFile("02-factorielle.algo");
  }, []);

  return (
    <div className="pseudo-algo-ide">
      <div className="vscode">
        <TitleBar onRun={runProgram} />
        <div className="main">
          <ActivityBar />
          <Sidebar
            fileNames={fileNames}
            activeFile={activeFile}
            onOpenFile={openFile}
            onCreateFile={createFile}
          />
          <div className="editor-area">
            <EditorTabs
              openTabs={openTabs}
              activeFile={activeFile}
              onSelectTab={setActiveFile}
              onCloseTab={closeTab}
            />
            <EditorToolbar activeFile={activeFile} onRun={runProgram} />

            {activeFile ? (
              <CodeEditor
                value={contents[activeFile]}
                onChange={handleCodeChange}
                onCursorChange={setCursorLabel}
              />
            ) : (
              <Watermark />
            )}
          </div>
        </div>

        <BottomPanel
          activeView={activePanelView}
          onChangeView={setActivePanelView}
          terminalLines={terminalLines}
          onClearTerminal={() => setTerminalLines([])}
          stdinValue={stdinValue}
          onStdinChange={setStdinValue}
        />

        <StatusBar cursorLabel={cursorLabel} langLabel={langLabel} />
      </div>
    </div>
  );
}
