interface ReadmeViewProps {
  html: string;
}

/** Rendu du "README.md" (contenu HTML statique fourni par l'application). */
export default function ReadmeView({ html }: ReadmeViewProps) {
  return (
    <div className="relative min-h-0 flex-1" id="readmeContainer">
      <div
        id="readmeView"
        className="absolute inset-0 overflow-auto whitespace-pre-wrap p-[18px_26px] font-[Consolas,'Courier_New',ui-monospace,monospace] text-[13px] leading-[1.75] text-[#cfcfcf] [&_code]:rounded-[3px] [&_code]:bg-[#2d2d2d] [&_code]:px-1.25 [&_code]:py-px [&_code]:text-[#ce9178] [&_h1]:m-0 [&_h1]:mb-1.5 [&_h1]:font-sans [&_h1]:text-[19px] [&_h1]:text-white [&_h2]:mb-1.5 [&_h2]:mt-5.5 [&_h2]:font-sans [&_h2]:text-sm [&_h2]:text-[#4ade80]"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}