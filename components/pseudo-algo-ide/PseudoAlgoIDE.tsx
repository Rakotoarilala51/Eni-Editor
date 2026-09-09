"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import {
  ArrowDownToLine,
  ArrowUpRight,
  Braces,
  ChevronDown,
  Columns2,
  Grid2X2,
  Play,
  Plus,
  Rows2,
} from "lucide-react";
import CodePane from "./CodePane";
import ResultPane from "./ResultPane";
import ExamplesGallery from "./ExamplesGallery";
import { DRAFT_FILE, EXAMPLES } from "./examples";
import { useAlgorithm } from "./hooks/useAlgorithm";
import { useProgramExecution } from "./hooks/useProgramExecution";
import { useExecutionShortcut } from "./hooks/useExecutionShortcut";
import "./pseudo-algo-ide.css";

export default function PseudoAlgoIDE() {
  const { activeFile, code, selectFile, updateCode } = useAlgorithm();
  const { output, status, stdin, setStdin, run, clear } =
    useProgramExecution(code);
  const [stacked, setStacked] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const title =
    EXAMPLES.find((example) => example.file === activeFile)?.title ??
    "Mon algorithme";
  const openGallery = useCallback(() => setGalleryOpen(true), []);
  const closeGallery = useCallback(() => setGalleryOpen(false), []);

  useExecutionShortcut(run, galleryOpen);

  const select = useCallback(
    (file: string) => {
      selectFile(file);
      clear();
      closeGallery();
    },
    [selectFile, clear, closeGallery],
  );

  function download() {
    const url = URL.createObjectURL(
      new Blob([code], { type: "text/plain;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = activeFile;
    link.click();
    // Let the browser start the download before releasing the object URL.
    setTimeout(() => URL.revokeObjectURL(url), 0);
  }

  return (
    <main className="algo-studio">
      <header className="studio-header">
        <Link href="/" className="brand" aria-label="ENI Algo, accueil">
          <Braces size={29} strokeWidth={1.3} />
          <span>
            eni<span className="brand-muted"> / </span>algo
          </span>
        </Link>
        <span className="header-caption">LE LABORATOIRE D’ALGORITHMES</span>
        <button className="outline-button" onClick={openGallery}>
          <Grid2X2 size={15} /> Exemples <ChevronDown size={13} />
        </button>
      </header>

      <section className="studio-intro">
        <div>
          <p className="eyebrow">PSEUDO-CODE · ENI</p>
          <h1>Une idée. Un algorithme.</h1>
          <p>Écrivez, exécutez, comprenez. Tout simplement.</p>
        </div>
        <div className="intro-index">
          <span>01 — CODE</span>
          <span>02 — RÉSULTAT</span>
        </div>
      </section>

      <section className="playground" aria-label="Espace de programmation">
        <div className="playground-toolbar">
          <div className="project-name">
            <span className="project-mark">/</span>
            <span>{title}</span>
            <span className="language-badge">.algo</span>
          </div>
          <div className="toolbar-actions">
            <button
              className="icon-button"
              title="Ouvrir mon brouillon"
              aria-label="Ouvrir mon brouillon"
              onClick={() => select(DRAFT_FILE)}
            >
              <Plus size={17} />
            </button>
            <button
              className="icon-button"
              title="Télécharger le code"
              aria-label="Télécharger le code"
              onClick={download}
            >
              <ArrowDownToLine size={17} />
            </button>
            <button
              className="icon-button layout-toggle"
              title="Changer la disposition"
              aria-label="Empiler les panneaux"
              aria-pressed={stacked}
              onClick={() => setStacked((previous) => !previous)}
            >
              {stacked ? <Columns2 size={17} /> : <Rows2 size={17} />}
            </button>
            <span className="toolbar-divider" />
            <button className="run-button" onClick={run}>
              <Play size={14} fill="currentColor" /> Exécuter <kbd>Ctrl ↵</kbd>
            </button>
          </div>
        </div>

        <div className={`workspace ${stacked ? "stacked" : ""}`}>
          <CodePane
            key={activeFile}
            activeFile={activeFile}
            code={code}
            onChange={updateCode}
          />
          <ResultPane
            output={output}
            status={status}
            stdin={stdin}
            onStdinChange={setStdin}
            onClear={clear}
          />
        </div>
      </section>
      <footer className="studio-footer">
        <span>Un espace pour apprendre, une ligne à la fois.</span>
        <button onClick={openGallery}>
          Besoin d’inspiration ? Explorer les exemples{" "}
          <ArrowUpRight size={14} />
        </button>
      </footer>

      {galleryOpen && (
        <ExamplesGallery
          activeFile={activeFile}
          onSelect={select}
          onClose={closeGallery}
        />
      )}
    </main>
  );
}
