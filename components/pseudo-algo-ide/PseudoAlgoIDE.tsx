"use client";

import { useCallback, useState } from "react";
import StudioLayout from "./StudioLayout";
import PlaygroundToolbar from "./PlaygroundToolbar";
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
    <StudioLayout onOpenGallery={openGallery}>
      <section className="playground" aria-label="Espace de programmation">
        <PlaygroundToolbar
          title={title}
          stacked={stacked}
          onOpenDraft={() => select(DRAFT_FILE)}
          onDownload={download}
          onToggleLayout={() => setStacked((previous) => !previous)}
          onRun={run}
        />

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

      {galleryOpen && (
        <ExamplesGallery
          activeFile={activeFile}
          onSelect={select}
          onClose={closeGallery}
        />
      )}
    </StudioLayout>
  );
}
