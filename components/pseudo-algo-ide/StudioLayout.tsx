import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowUpRight, Braces, ChevronDown, Grid2X2 } from "lucide-react";

interface StudioLayoutProps {
  children: ReactNode;
  onOpenGallery: () => void;
}

export default function StudioLayout({
  children,
  onOpenGallery,
}: StudioLayoutProps) {
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
        <button className="outline-button" onClick={onOpenGallery}>
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

      {children}
      <footer className="studio-footer">
        <span>Un espace pour apprendre, une ligne à la fois.</span>
        <button onClick={onOpenGallery}>
          Besoin d’inspiration ? Explorer les exemples{" "}
          <ArrowUpRight size={14} />
        </button>
      </footer>
    </main>
  );
}
