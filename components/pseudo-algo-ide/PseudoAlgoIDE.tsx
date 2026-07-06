'use client';

import { useEffect, useRef, useState } from 'react';
import './pseudo-algo-ide.css';

import { FILES, README_HTML } from '@/lib/files';
import {
  tokenize,
  Parser,
  Interpreter,
  PseudoError,
  StopSignal,
  type InterpreterIO,
} from '@/lib/interpreter';

import TitleBar from './TitleBar';
import ActivityBar from './ActivityBar';
import Sidebar from './Sidebar';
import EditorTabs from './EditorTabs';
import EditorToolbar from './EditorToolbar';
import CodeEditor from './CodeEditor';
import ReadmeView from './ReadmeView';
import Watermark from './Watermark';
import BottomPanel, { type PanelViewId } from './BottomPanel';
import type { TerminalLine } from './TerminalView';
import StatusBar from './StatusBar';

const DEFAULT_ALGO_CONTENT = `écrire("Nouveau programme");`;
const STORAGE_KEY = 'pseudo-algo:files';
export default function PseudoAlgoIDE() {
  const [contents, setContents] = useState<Record<string, string>>({ ...FILES });
  const [openTabs, setOpenTabs] = useState<string[]>([]);
  const [activeFile, setActiveFile] = useState<string | null>(null);

  const [cursorLabel, setCursorLabel] = useState('Ln 1, Col 1');
  const [langLabel, setLangLabel] = useState('Pseudo-code Algo');

  const [activePanelView, setActivePanelView] = useState<PanelViewId>('terminalView');
  const [terminalLines, setTerminalLines] = useState<TerminalLine[]>([]);
  const [stdinValue, setStdinValue] = useState('');

  //  dynamique désormais, basé sur `contents` (qui contient aussi les nouveaux fichiers)
  const fileNames = Object.keys(contents);

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

  useEffect(() => {
    if (!activeFile) return;
    if (activeFile === 'README.md') {
      setLangLabel('Markdown');
    } else {
      setLangLabel('Pseudo-code Algo');
      setCursorLabel('Ln 1, Col 1');
    }
  }, [activeFile]);

  function handleCodeChange(newValue: string) {
    if (!activeFile) return;
    setContents((prev) => ({ ...prev, [activeFile]: newValue }));
  }

  function pushTermLine(text: string, cls?: TerminalLine['cls']) {
    setTerminalLines((prev) => [...prev, { text, cls }]);
  }

  function runProgram() {
    if (!activeFile || !activeFile.endsWith('.algo')) {
      setActivePanelView('terminalView');
      pushTermLine(`Impossible d'exécuter "${activeFile || '(aucun fichier)'}" — sélectionnez un fichier .algo.`, 'error');
      return;
    }
    setActivePanelView('terminalView');
    setTerminalLines([{ text: `$ pseudo-algo run ${activeFile}`, cls: 'prompt' }]);

    const src = contents[activeFile];
    const stdinLines = stdinValue.split(/\r?\n/);
    let idx = 0;
    const io: InterpreterIO = {
      write(s: string) { pushTermLine(s); },
      read() { return idx < stdinLines.length ? stdinLines[idx++] : ''; },
    };
    try {
      const tokens = tokenize(src);
      const parser = new Parser(tokens);
      const program = parser.parseProgram();
      const interp = new Interpreter(io);
      interp.run(program);
      pushTermLine(`[terminé] ${activeFile} — code de sortie 0`, 'meta');
    } catch (e: any) {
      if (e instanceof StopSignal) pushTermLine('--- Arrêt du programme ---', 'meta');
      else if (e instanceof PseudoError) pushTermLine('Erreur : ' + e.message, 'error');
      else if (e instanceof RangeError) pushTermLine("Erreur : récursion trop profonde (pile d'appels dépassée)", 'error');
      else pushTermLine('Erreur interne : ' + (e?.message || e), 'error');
    }
  }

  const runProgramRef = useRef(runProgram);
  runProgramRef.current = runProgram;
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'F5' || (e.ctrlKey && e.key === 'Enter')) {
        e.preventDefault();
        runProgramRef.current();
      }
    }
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    openFile('README.md');
    openFile('02-factorielle.algo');
  }, []);

  /* Création de fichier */
  function createAlgoFile(
    fileName: string,
    existingContents: Record<string, string>
  ): { success: boolean; contents?: Record<string, string>; fileName?: string; error?: string } {
    let name = fileName.trim();
    if (!name) return { success: false, error: "Le nom du fichier est requis." };
    if (!name.endsWith(".algo")) name += ".algo";
    if (existingContents[name] !== undefined) {
      return { success: false, error: "Un fichier avec ce nom existe déjà." };
    }
    if (!/^[a-zA-Z0-9_-]+\.algo$/.test(name)) {
      return { success: false, error: "Nom invalide (lettres, chiffres, - et _ uniquement)." };
    }
    return {
      success: true,
      contents: { ...existingContents, [name]: DEFAULT_ALGO_CONTENT },
      fileName: name,
    };
  }

  function handleCreateFile(fileName: string) {
    const result = createAlgoFile(fileName, contents);
    if (result.success) {
      setContents(result.contents!);
      openFile(result.fileName!); // ouvre aussi un onglet pour le nouveau fichier
      return { success: true };
    }
    return { success: false, error: result.error };
  }
  //Enregistre dans localStorage


function loadStoredFiles(): Record<string, string> | null {
  if (typeof window === 'undefined') return null; // SSR guard
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null; // JSON corrompu, on ignore
  }
}

function saveFiles(files: Record<string, string>) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(files));
  } catch (e) {
    console.error('Impossible de sauvegarder les fichiers :', e);
  }
}

//GetFichier

// Chargement de localStorage APRÈS le montage (donc après l'hydration)
useEffect(() => {
  const stored = loadStoredFiles();
  if (stored) {
    setContents(stored);
  }
}, []); // tableau vide = une seule fois au montage

// Sauvegarde automatique à chaque modification
useEffect(() => {
  saveFiles(contents);
}, [contents]);

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
            onCreateFile={handleCreateFile}
          />
          <div className="editor-area">
            <EditorTabs
              openTabs={openTabs}
              activeFile={activeFile}
              onSelectTab={setActiveFile}
              onCloseTab={closeTab}
            />
            <EditorToolbar activeFile={activeFile} onRun={runProgram} />

            {activeFile === 'README.md' && <ReadmeView html={README_HTML} />}

            {activeFile && activeFile !== 'README.md' && (
              <CodeEditor
                value={contents[activeFile]}
                onChange={handleCodeChange}
                onCursorChange={setCursorLabel}
              />
            )}

            {!activeFile && <Watermark />}
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