import { FileCode2, FileText, File as FileIcon } from "lucide-react";

interface SidebarProps {
  fileNames: string[];
  activeFile: string | null;
  onOpenFile: (name: string) => void;
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
}: SidebarProps) {
  return (
    <div
      className="flex w-62.5 flex-none flex-col overflow-hidden border-r border-[#1b1b1b] bg-[#252526]"
      id="sidebar"
    >
      <div className="px-5 pb-1.5 pt-2.5 text-[11px] font-semibold tracking-wider text-[#bbbbbb]">
        EXPLORATEUR
      </div>
      <div
        className="flex cursor-pointer items-center gap-1 px-2 py-0.75 text-[12.5px] font-bold tracking-[0.02em] text-[#cccccc]"
        id="folderRow"
      >
        <span className="w-4 text-center text-[10px] text-[#cccccc]">▾</span>
        <span>PSEUDO-ALGO</span>
      </div>
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