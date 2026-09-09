import { memo, useEffect, useRef, useState } from "react";
import { Search, X } from "lucide-react";
import ExampleCard from "./ExampleCard";
import { EXAMPLES } from "./examples";

interface ExamplesGalleryProps {
  activeFile: string;
  onSelect: (file: string) => void;
  onClose: () => void;
}

export default memo(function ExamplesGallery({
  activeFile,
  onSelect,
  onClose,
}: ExamplesGalleryProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [query, setQuery] = useState("");
  const normalizedQuery = query.toLocaleLowerCase("fr");
  const filteredExamples = EXAMPLES.filter((example) =>
    Object.values(example)
      .join(" ")
      .toLocaleLowerCase("fr")
      .includes(normalizedQuery),
  );

  useEffect(() => {
    dialog.current?.showModal();
  }, []);

  return (
    <dialog
      ref={dialog}
      onClose={onClose}
      className="examples-dialog"
      onClick={(event) => {
        if (event.target === event.currentTarget) dialog.current?.close();
      }}
      aria-labelledby="examples-title"
    >
      <div className="gallery-heading">
        <div>
          <p className="eyebrow">LA BIBLIOTHÈQUE</p>
          <h2 id="examples-title">Un point de départ.</h2>
          <p>Choisissez un exemple et faites-le vôtre.</p>
        </div>
        <button
          className="icon-button"
          aria-label="Fermer les exemples"
          onClick={() => dialog.current?.close()}
        >
          <X size={20} />
        </button>
      </div>
      <div className="gallery-search">
        <Search size={17} />
        <input
          aria-label="Rechercher un exemple"
          placeholder="Rechercher un algorithme…"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </div>
      <div className="examples-grid">
        {filteredExamples.map((example) => (
          <ExampleCard
            key={example.file}
            example={example}
            selected={activeFile === example.file}
            onSelect={onSelect}
          />
        ))}
      </div>
      {filteredExamples.length === 0 && (
        <p className="no-results">
          Aucun exemple trouvé. Essayez « tableaux » ou « sommes ».
        </p>
      )}
      <p className="gallery-note">
        Vos modifications restent disponibles en changeant d’exemple pendant
        cette session. Téléchargez votre code pour le conserver.
      </p>
    </dialog>
  );
});
