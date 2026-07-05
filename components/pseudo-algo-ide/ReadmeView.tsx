interface ReadmeViewProps {
  html: string;
}

/** Rendu du "README.md" (contenu HTML statique fourni par l'application). */
export default function ReadmeView({ html }: ReadmeViewProps) {
  return (
    <div className="editor-container" id="readmeContainer">
      <div id="readmeView" dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}
