import { FileIcon } from '@/lib/file-icons';

interface SidebarProps {
  fileNames: string[];
  activeFile: string | null;
  onOpenFile: (name: string) => void;
}

/** Panneau EXPLORATEUR (liste des fichiers du "projet"). */
export default function Sidebar({ fileNames, activeFile, onOpenFile }: SidebarProps) {
  return (
    <div className="sidebar" id="sidebar">
      <div className="sidebar-header">EXPLORATEUR</div>
      <div className="folder-row" id="folderRow">
        <span className="chev">▾</span>
        <span>PSEUDO-ALGO</span>
      </div>
      <div className="file-list" id="fileList">
        {fileNames.map((name) => (
          <div
            key={name}
            className={`file-row${name === activeFile ? ' selected' : ''}`}
            onClick={() => onOpenFile(name)}
          >
            <FileIcon name={name} />
            <span className={name === activeFile ? 'fname-active' : ''}>{name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
