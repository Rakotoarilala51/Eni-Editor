'use client'
import { useState } from 'react';
import {
  ExplorerIcon,
  SearchIcon,
  GitIcon,
  RunOutlineIcon,
  ExtensionsIcon,
  AccountIcon,
  SettingsIcon,
} from './icons';

type NonImplementedId = 'ab-search' | 'ab-git' | 'ab-run' | 'ab-ext';

const ICON_BASE =
  'relative flex h-12 w-full items-center justify-center text-[#858585] cursor-pointer hover:text-[#d7d7d7] [&>svg]:h-[22px] [&>svg]:w-[22px]';

const ICON_ACTIVE =
  'text-white before:content-[\'\'] before:absolute before:left-0 before:top-1.5 before:bottom-1.5 before:w-0.5 before:bg-white';

/**
 * Barre d'activité verticale (Explorateur / Rechercher / Git / Exécuter / Extensions).
 * Comportement identique à l'original : cliquer sur une icône "non implémentée"
 * l'active brièvement (250ms) puis revient automatiquement sur "Explorateur".
 */
export default function ActivityBar() {
  const [active, setActive] = useState<'ab-explorer' | NonImplementedId>('ab-explorer');

  function clickNonImplemented(id: NonImplementedId) {
    setActive(id);
    setTimeout(() => setActive('ab-explorer'), 250);
  }

  return (
    <div className="flex w-12 flex-none flex-col justify-between border-r border-[#1b1b1b] bg-[#333333]">
      <div className="flex flex-col">
        <div
          className={`${ICON_BASE} ${active === 'ab-explorer' ? ICON_ACTIVE : ''}`}
          id="ab-explorer"
          title="Explorateur"
          onClick={() => setActive('ab-explorer')}
        >
          <ExplorerIcon />
        </div>
        <div
          className={`${ICON_BASE} ${active === 'ab-search' ? ICON_ACTIVE : ''}`}
          id="ab-search"
          title="Rechercher (non implémenté)"
          onClick={() => clickNonImplemented('ab-search')}
        >
          <SearchIcon />
        </div>
        <div
          className={`${ICON_BASE} ${active === 'ab-git' ? ICON_ACTIVE : ''}`}
          id="ab-git"
          title="Source Control (non implémenté)"
          onClick={() => clickNonImplemented('ab-git')}
        >
          <GitIcon />
        </div>
        <div
          className={`${ICON_BASE} ${active === 'ab-run' ? ICON_ACTIVE : ''}`}
          id="ab-run"
          title="Exécuter et déboguer (utilise le bouton ▷ de l'éditeur)"
          onClick={() => clickNonImplemented('ab-run')}
        >
          <RunOutlineIcon />
        </div>
        <div
          className={`${ICON_BASE} ${active === 'ab-ext' ? ICON_ACTIVE : ''}`}
          id="ab-ext"
          title="Extensions (non implémenté)"
          onClick={() => clickNonImplemented('ab-ext')}
        >
          <ExtensionsIcon />
        </div>
      </div>
      <div className="mb-2 flex flex-col">
        <div className={ICON_BASE} title="Compte (non implémenté)">
          <AccountIcon />
        </div>
        <div className={ICON_BASE} title="Paramètres (non implémenté)">
          <SettingsIcon />
        </div>
      </div>
    </div>
  );
}