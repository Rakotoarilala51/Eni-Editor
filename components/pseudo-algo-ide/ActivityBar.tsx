"use client";

import { useState } from "react";
import {
  Files,
  Search,
  GitBranch,
  Play,
  Blocks,
  User,
  Settings,
} from "lucide-react";

type NonImplementedId = "ab-search" | "ab-git" | "ab-run" | "ab-ext";
type ActivityId = "ab-explorer" | NonImplementedId;

const ICON_BASE =
  "group relative flex h-12 w-full items-center justify-center text-[#858585] cursor-pointer transition-colors hover:text-[#d7d7d7]";

const ICON_ACTIVE =
  "text-white before:content-[''] before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-0.5 before:rounded-full before:bg-white before:transition-all";

const ICON_INACTIVE =
  "before:content-[''] before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-0.5 before:rounded-full before:bg-transparent before:transition-all";

interface ActivityIconProps {
  id: string;
  title: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function ActivityIcon({
  id,
  title,
  active,
  onClick,
  children,
}: ActivityIconProps) {
  return (
    <div
      className={`${ICON_BASE} ${active ? ICON_ACTIVE : ICON_INACTIVE}`}
      id={id}
      onClick={onClick}
    >
      <div className="flex h-8 w-8 items-center justify-center rounded-md transition-colors group-hover:bg-white/10 [&>svg]:h-5.5 [&>svg]:w-5.5">
        {children}
      </div>
      <span className="pointer-events-none absolute left-13 top-1/2 z-50 -translate-y-1/2 whitespace-nowrap rounded-md border border-[#1b1b1b] bg-[#252526] px-2 py-1 text-xs text-[#cccccc] opacity-0 shadow-lg transition-opacity delay-300 group-hover:opacity-100">
        {title}
      </span>
    </div>
  );
}

export default function ActivityBar() {
  const [active, setActive] = useState<ActivityId>("ab-explorer");

  function clickNonImplemented(id: NonImplementedId) {
    setActive(id);
    setTimeout(() => setActive("ab-explorer"), 250);
  }

  return (
    <div className="flex w-12 flex-none flex-col justify-between border-r border-[#1b1b1b] bg-[#333333]">
      <div className="flex flex-col">
        <ActivityIcon
          id="ab-explorer"
          title="Explorateur"
          active={active === "ab-explorer"}
          onClick={() => setActive("ab-explorer")}
        >
          <Files />
        </ActivityIcon>
        <ActivityIcon
          id="ab-search"
          title="Rechercher (non implémenté)"
          active={active === "ab-search"}
          onClick={() => clickNonImplemented("ab-search")}
        >
          <Search />
        </ActivityIcon>
        <ActivityIcon
          id="ab-git"
          title="Source Control (non implémenté)"
          active={active === "ab-git"}
          onClick={() => clickNonImplemented("ab-git")}
        >
          <GitBranch />
        </ActivityIcon>
        <ActivityIcon
          id="ab-run"
          title="Exécuter et déboguer (utilise le bouton ▷ de l'éditeur)"
          active={active === "ab-run"}
          onClick={() => clickNonImplemented("ab-run")}
        >
          <Play />
        </ActivityIcon>
        <ActivityIcon
          id="ab-ext"
          title="Extensions (non implémenté)"
          active={active === "ab-ext"}
          onClick={() => clickNonImplemented("ab-ext")}
        >
          <Blocks />
        </ActivityIcon>
      </div>
      <div className="mb-2 flex flex-col">
        <ActivityIcon
          id="ab-account"
          title="Compte (non implémenté)"
          active={false}
          onClick={() => {}}
        >
          <User />
        </ActivityIcon>
        <ActivityIcon
          id="ab-settings"
          title="Paramètres (non implémenté)"
          active={false}
          onClick={() => {}}
        >
          <Settings />
        </ActivityIcon>
      </div>
    </div>
  );
}
