"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowDownToLine, ArrowUpRight, Braces, Check, ChevronDown, Columns2, Grid2X2, Play, Plus, Rows2, Search, Terminal, Trash2, X } from "lucide-react";
import { FILES } from "@/lib/files";
import { tokenize, Parser, Interpreter, PseudoError, StopSignal } from "@/lib/interpreter";
import CodeEditor from "./CodeEditor";
import "./pseudo-algo-ide.css";

const examples = [
  ["01-bonjour.algo", "Bonjour, monde", "Les premiers pas : afficher un message.", "Fondamentaux"],
  ["02-factorielle.algo", "Factorielle", "Fonctions, variables et boucle tant que.", "Fondamentaux"],
  ["03-sommes.algo", "Sommes", "Deux approches : itérative et récursive.", "Récursivité"],
  ["04-dichotomie.algo", "Recherche dichotomique", "Retrouver un élément dans un tableau trié.", "Tableaux"],
  ["05-tri-insertion.algo", "Tri par insertion", "Ordonner un tableau, élément par élément.", "Tableaux"],
  ["06-lecture-clavier.algo", "Lecture au clavier", "Lire des valeurs et calculer leur somme.", "Fondamentaux"],
  ["07-liste-chainee.algo", "Liste chaînée", "Manipuler des pointeurs et parcourir une liste.", "Structures"],
  ["08-structure-annuaire.algo", "Annuaire", "Construire un annuaire avec des structures.", "Structures"],
];
const blank = '// Votre prochain algorithme commence ici.\n\nécrire("Bonjour !");\n';
type Output = { text: string; kind?: "error" | "meta" };

export default function PseudoAlgoIDE() {
  const [contents, setContents] = useState<Record<string, string>>({ ...FILES, "mon-algorithme.algo": blank });
  const [activeFile, setActiveFile] = useState("02-factorielle.algo");
  const [cursor, setCursor] = useState("Ln 1, Col 1");
  const [stdin, setStdin] = useState("");
  const [output, setOutput] = useState<Output[]>([]);
  const [status, setStatus] = useState("Prêt à exécuter");
  const [stacked, setStacked] = useState(false);
  const [query, setQuery] = useState("");
  const dialog = useRef<HTMLDialogElement>(null);
  const title = examples.find(([file]) => file === activeFile)?.[1] ?? "Mon algorithme";
  const code = contents[activeFile];

  const run = useCallback(() => {
    const lines: Output[] = [];
    const inputs = stdin.split(/\r?\n/);
    let index = 0;
    const start = performance.now();
    try {
      const program = new Parser(tokenize(code)).parseProgram();
      new Interpreter({ write: (text) => { lines.push({ text }); }, read: () => inputs[index++] ?? "" }).run(program);
      setStatus(`Terminé en ${(performance.now() - start).toFixed(1)} ms`);
      lines.push({ text: "Exécution terminée · code de sortie 0", kind: "meta" });
    } catch (error: unknown) {
      if (error instanceof StopSignal) {
        lines.push({ text: "Arrêt du programme", kind: "meta" });
        setStatus("Programme arrêté");
      } else {
        const message = error instanceof PseudoError ? error.message : error instanceof RangeError ? "Récursion trop profonde." : error instanceof Error ? error.message : String(error);
        lines.push({ text: `Erreur : ${message}`, kind: "error" });
        setStatus("Erreur d’exécution");
      }
    }
    setOutput(lines);
  }, [code, stdin]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (!dialog.current?.open && (event.key === "F5" || ((event.ctrlKey || event.metaKey) && event.key === "Enter"))) {
        event.preventDefault();
        run();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [run]);

  function select(file: string) {
    setActiveFile(file);
    setOutput([]);
    setStatus("Prêt à exécuter");
    setCursor("Ln 1, Col 1");
    dialog.current?.close();
  }

  function download() {
    const url = URL.createObjectURL(new Blob([code], { type: "text/plain;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = activeFile;
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <main className="algo-studio">
      <header className="studio-header">
        <Link href="/" className="brand" aria-label="ENI Algo, accueil"><Braces size={29} strokeWidth={1.3} /><span>eni<span className="brand-muted"> / </span>algo</span></Link>
        <span className="header-caption">LE LABORATOIRE D’ALGORITHMES</span>
        <button className="outline-button" onClick={() => { setQuery(""); dialog.current?.showModal(); }}><Grid2X2 size={15} /> Exemples <ChevronDown size={13} /></button>
      </header>

      <section className="studio-intro">
        <div><p className="eyebrow">PSEUDO-CODE · ENI</p><h1>Une idée. Un algorithme.</h1><p>Écrivez, exécutez, comprenez. Tout simplement.</p></div>
        <div className="intro-index"><span>01 — CODE</span><span>02 — RÉSULTAT</span></div>
      </section>

      <section className="playground" aria-label="Espace de programmation">
        <div className="playground-toolbar">
          <div className="project-name"><span className="project-mark">/</span><span>{title}</span><span className="language-badge">.algo</span></div>
          <div className="toolbar-actions">
            <button className="icon-button" title="Ouvrir mon brouillon" aria-label="Ouvrir mon brouillon" onClick={() => select("mon-algorithme.algo")}><Plus size={17} /></button>
            <button className="icon-button" title="Télécharger le code" aria-label="Télécharger le code" onClick={download}><ArrowDownToLine size={17} /></button>
            <button className="icon-button layout-toggle" title="Changer la disposition" aria-label="Empiler les panneaux" aria-pressed={stacked} onClick={() => setStacked(!stacked)}>{stacked ? <Columns2 size={17} /> : <Rows2 size={17} />}</button>
            <span className="toolbar-divider" />
            <button className="run-button" onClick={run}><Play size={14} fill="currentColor" /> Exécuter <kbd>Ctrl ↵</kbd></button>
          </div>
        </div>

        <div className={`workspace ${stacked ? "stacked" : ""}`}>
          <section className="code-pane" aria-label="Code source">
            <div className="pane-heading"><h2><Braces size={16} /> Code</h2><span>PSEUDO-CODE</span></div>
            <CodeEditor value={code} onChange={(value) => setContents((previous) => ({ ...previous, [activeFile]: value }))} onCursorChange={setCursor} />
            <div className="pane-footer"><span>{activeFile}</span><span>{cursor}</span></div>
          </section>
          <section className="result-pane" aria-label="Résultat du programme">
            <div className="pane-heading"><h2><Terminal size={16} /> Résultat</h2><button className="icon-button" title="Effacer la sortie" aria-label="Effacer la sortie" onClick={() => { setOutput([]); setStatus("Prêt à exécuter"); }}><Trash2 size={14} /></button></div>
            <div className="output" role="log" aria-label="Sortie du programme" aria-live="polite">
              {output.length ? output.map((line, index) => <div className={`output-line ${line.kind ?? ""}`} key={index}><span className="output-prefix">{line.kind === "error" ? "!" : line.kind === "meta" ? "↳" : "›"}</span><span>{line.text}</span></div>) : <div className="empty-output"><span className="empty-symbol">&gt;_</span><h3>À vous de jouer.</h3><p>Exécutez votre algorithme.<br />Son résultat apparaîtra ici.</p><span className="empty-shortcut">CTRL + ENTRÉE</span></div>}
            </div>
            <details className="input-section"><summary>Entrées du programme <span>lire() <ChevronDown size={13} /></span></summary><label htmlFor="program-input">Une valeur par ligne, à renseigner avant d’exécuter.</label><textarea id="program-input" spellCheck={false} value={stdin} onChange={(event) => setStdin(event.target.value)} placeholder={'Exemple :\n12\n8'} /></details>
            <div className="pane-footer"><span className="execution-status"><span className="status-dot" />{status}</span><span>OUTPUT</span></div>
          </section>
        </div>
      </section>
      <footer className="studio-footer"><span>Un espace pour apprendre, une ligne à la fois.</span><button onClick={() => { setQuery(""); dialog.current?.showModal(); }}>Besoin d’inspiration ? Explorer les exemples <ArrowUpRight size={14} /></button></footer>

      <dialog ref={dialog} className="examples-dialog" onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }} aria-labelledby="examples-title">
        <div className="gallery-heading"><div><p className="eyebrow">LA BIBLIOTHÈQUE</p><h2 id="examples-title">Un point de départ.</h2><p>Choisissez un exemple et faites-le vôtre.</p></div><button className="icon-button" aria-label="Fermer les exemples" onClick={() => dialog.current?.close()}><X size={20} /></button></div>
        <div className="gallery-search"><Search size={17} /><input aria-label="Rechercher un exemple" placeholder="Rechercher un algorithme…" value={query} onChange={(event) => setQuery(event.target.value)} /></div>
        <div className="examples-grid">{examples.filter((example) => example.join(" ").toLocaleLowerCase("fr").includes(query.toLocaleLowerCase("fr"))).map(([file, name, description, category], index) => <button className="example-card" key={file} onClick={() => select(file)}><span className="card-top"><span>{category}</span>{activeFile === file ? <Check size={17} /> : <ArrowUpRight size={17} />}</span><span className="card-title">{name}</span><span className="card-description">{description}</span><span className="card-bottom">{String(index + 1).padStart(2, "0")} <span>OUVRIR L’EXEMPLE</span></span></button>)}</div>
        {!examples.some((example) => example.join(" ").toLocaleLowerCase("fr").includes(query.toLocaleLowerCase("fr"))) && <p className="no-results">Aucun exemple trouvé. Essayez « tableaux » ou « sommes ».</p>}
        <p className="gallery-note">Vos modifications restent disponibles en changeant d’exemple pendant cette session. Téléchargez votre code pour le conserver.</p>
      </dialog>
    </main>
  );
}
