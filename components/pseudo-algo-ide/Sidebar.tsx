import { useState } from "react";
import { FileCode2, FileText, File as FileIcon, FilePlus2 } from "lucide-react";

interface SidebarProps {
  fileNames: string[];
  activeFile: string | null;
  onOpenFile: (name: string) => void;
  /** Retourne { success, error? } — la logique de création reste chez le parent (qui possède `files`). */
  onCreateFile: (name: string) => { success: boolean; error?: string };
}

/** Choisit une icône Lucide selon l'extension du fichier. */
function getFileIcon(name: string) {
  if (name.endsWith(".md")) {
    return <FileText className="h-4 w-4 flex-none text-[#8a8a8a]" />;
  }
  if (name.endsWith(".algo")) {
    return <FileCode2 className="h-4 w-4 flex-none text-[#519aba]" />;
  }
  return <FileIcon className="h-4 w-4 flex-none text-[#cccccc]" />;
}

/** Panneau EXPLORATEUR (liste des fichiers du "projet"). */
export default function Sidebar({
  fileNames,
  activeFile,
  onOpenFile,
  onCreateFile,
}: SidebarProps) {
  const [showInput, setShowInput] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleConfirm() {
    const result = onCreateFile(newFileName);

    if (!result.success) {
      setError(result.error ?? "Erreur inconnue.");
      return;
    }

    setNewFileName("");
    setError(null);
    setShowInput(false);
  }

  function handleCancel() {
    setNewFileName("");
    setError(null);
    setShowInput(false);
  }

  return (
    <div
      className="flex w-62.5 flex-none flex-col overflow-hidden border-r border-[#1b1b1b] bg-[#252526]"
      id="sidebar"
    >
      <div className="px-5 pb-1.5 pt-2.5 text-[11px] font-semibold tracking-wider text-[#bbbbbb]">
        EXPLORATEUR
      </div>
      <div
        className="flex cursor-pointer items-center justify-between px-2 py-0.75 text-[12.5px] font-bold tracking-[0.02em] text-[#cccccc]"
        id="folderRow"
      >
        <span className="flex items-center gap-1">
          <span className="w-4 text-center text-[10px] text-[#cccccc]">▾</span>
          PSEUDO-ALGO
        </span>
        <FilePlus2
          size={16}
          className="mr-1 hover:scale-105"
          onClick={() => setShowInput(true)}
        />
      </div>

      {showInput && (
        <div className="flex flex-col gap-1 px-2 py-1">
          <input
            autoFocus
            type="text"
            placeholder="nom-du-fichier.algo"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleConfirm();
              if (e.key === "Escape") handleCancel();
            }}
            onBlur={handleConfirm}
            className="rounded-sm border border-[#3c3c3c] bg-[#3c3c3c] px-1.5 py-0.5 text-[12.5px] text-white outline-none focus:border-[#007fd4]"
          />
          {error && (
            <span className="px-0.5 text-[11px] text-[#f48771]">{error}</span>
          )}
        </div>
      )}

      <div className="flex flex-col" id="fileList">
        {fileNames.map((name) => {
          const isActive = name === activeFile;
          return (
            <div
              key={name}
              className={`flex cursor-pointer items-center gap-1.5 whitespace-nowrap py-0.75 pl-7 pr-2 text-[12.5px] text-[#cccccc] ${
                isActive ? "bg-[#37373d]" : "hover:bg-[#2a2d2e]"
              }`}
              onClick={() => onOpenFile(name)}
            >
              {getFileIcon(name)}
              <span className={isActive ? "text-white" : ""}>{name}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}