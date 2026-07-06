"use client";

import { useState, useRef, useEffect } from "react";
import {
  FileCode2,
  FileText,
  File as FileIcon,
  Plus,
  ChevronRight,
  Folder,
  FolderOpen,
} from "lucide-react";

interface SidebarProps {
  fileNames: string[];
  activeFile: string | null;
  onOpenFile: (name: string) => void;
  onCreateFile: (name: string) => void;
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

/** Panneau EXPLORATEUR (liste des fichiers du "projet" + création de fichier). */
export default function Sidebar({
  fileNames,
  activeFile,
  onOpenFile,
  onCreateFile,
}: SidebarProps) {
  const [expanded, setExpanded] = useState(true);
  const [creating, setCreating] = useState(false);
  const [draftName, setDraftName] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (creating) inputRef.current?.focus();
  }, [creating]);

  function startCreating() {
    setExpanded(true);
    setDraftName("");
    setCreating(true);
  }

  function cancelCreating() {
    setCreating(false);
    setDraftName("");
  }

  function commitCreating() {
    const trimmed = draftName.trim();
    if (!trimmed) {
      cancelCreating();
      return;
    }
    const finalName = /\.[a-zA-Z0-9]+$/.test(trimmed)
      ? trimmed
      : `${trimmed}.algo`;
    if (fileNames.includes(finalName)) {
      return;
    }
    onCreateFile(finalName);
    cancelCreating();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") commitCreating();
    else if (e.key === "Escape") cancelCreating();
  }

  return (
    <div
      className="flex w-62.5 flex-none flex-col overflow-hidden border-r border-[#1b1b1b] bg-[#252526]"
      id="sidebar"
    >
      <div className="flex items-center justify-between px-5 pb-1.5 pt-2.5 text-[11px] font-semibold tracking-wider text-[#bbbbbb]">
        <span>EXPLORATEUR</span>
        <button
          type="button"
          title="Nouveau fichier"
          className="flex h-5 w-5 items-center justify-center rounded text-[#cccccc] transition-colors hover:bg-[#3a3d41] hover:text-white"
          onClick={startCreating}
        >
          <Plus className="h-3.5 w-3.5" />
        </button>
      </div>

      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="group flex items-center gap-1 px-2 py-1 text-[12.5px] font-bold tracking-[0.02em] text-[#cccccc] hover:bg-[#2a2d2e]"
        id="folderRow"
      >
        <ChevronRight
          className={`h-3.5 w-3.5 flex-none text-[#cccccc] transition-transform duration-150 ${
            expanded ? "rotate-90" : ""
          }`}
        />
        {expanded ? (
          <FolderOpen className="h-4 w-4 flex-none text-[#dcb67a]" />
        ) : (
          <Folder className="h-4 w-4 flex-none text-[#dcb67a]" />
        )}
        <span>PSEUDO-ALGO</span>
      </button>

      <div
        className={`flex flex-col overflow-hidden transition-[grid-template-rows] ${
          expanded ? "" : "hidden"
        }`}
        id="fileList"
      >
        {fileNames.map((name) => {
          const isActive = name === activeFile;
          return (
            <div
              key={name}
              className={`flex cursor-pointer items-center gap-1.5 whitespace-nowrap py-1 pl-8 pr-2 text-[12.5px] text-[#cccccc] transition-colors ${
                isActive ? "bg-[#37373d]" : "hover:bg-[#2a2d2e]"
              }`}
              onClick={() => onOpenFile(name)}
            >
              {getFileIcon(name)}
              <span className={isActive ? "text-white" : ""}>{name}</span>
            </div>
          );
        })}
        {creating && (
          <div className="flex items-center gap-1.5 py-1 pl-8 pr-2 text-[12.5px] text-[#cccccc]">
            <FileCode2 className="h-4 w-4 flex-none text-[#519aba]" />
            <input
              ref={inputRef}
              value={draftName}
              onChange={(e) => setDraftName(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={commitCreating}
              placeholder="nom-du-fichier.algo"
              className="w-full rounded-sm border border-[#1177bb] bg-[#3c3c3c] px-1.5 py-0.5 text-[12.5px] text-white outline-none"
            />
          </div>
        )}
      </div>
    </div>
  );
}
