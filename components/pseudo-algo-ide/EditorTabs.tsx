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
    <div className="tabs" id="tabs">
      {openTabs.map((name) => (
        <div
          key={name}
          className={`tab${name === activeFile ? ' active' : ''}`}
          onClick={() => onSelectTab(name)}
        >
          <TabIcon name={name} />
          <span>{name}</span>
          <span
            className="tab-close"
            onClick={(e) => {
              e.stopPropagation();
              onCloseTab(name);
            }}
          >
            &#10005;
          </span>
        </div>
      ))}
    </div>
  );
}
