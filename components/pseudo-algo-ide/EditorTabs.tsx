import { TabIcon } from '@/lib/file-icons';

interface EditorTabsProps {
  openTabs: string[];
  activeFile: string | null;
  onSelectTab: (name: string) => void;
  onCloseTab: (name: string) => void;
}


/** Rangée d'onglets ouverts au-dessus de l'éditeur. */
export default function EditorTabs({ openTabs, activeFile, onSelectTab, onCloseTab }: EditorTabsProps) {
  return (
    <div className="flex flex-none overflow-x-auto bg-[#2d2d2d]" id="tabs">
      {openTabs.map((name) => {
        const isActive = name === activeFile;
        return (
          <div
            key={name}
            className={`group flex h-8.75 cursor-pointer items-center gap-2 whitespace-nowrap border-r border-[#1b1b1b] pl-3 pr-2.5 text-[13px] ${
              isActive ? 'bg-[#1e1e1e] text-white' : 'bg-[#2d2d2d] text-[#969696]'
            }`}
            onClick={() => onSelectTab(name)}
          >
            <TabIcon name={name} />
            <span>{name}</span>
            <span
              className={`flex h-4.5 w-4.5 items-center justify-center rounded text-sm text-[#cccccc] hover:bg-[#5a5a5a] ${
                isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
              }`}
              onClick={(e) => {
                e.stopPropagation();
                onCloseTab(name);
              }}
            >
              &#10005;
            </span>
          </div>
        );
      })}
    </div>
  );
}