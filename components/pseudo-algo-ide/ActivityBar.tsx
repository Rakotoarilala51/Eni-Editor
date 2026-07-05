'use client';

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
    <div className="activitybar">
      <div className="ab-group">
        <div
          className={`ab-icon${active === 'ab-explorer' ? ' active' : ''}`}
          id="ab-explorer"
          title="Explorateur"
          onClick={() => setActive('ab-explorer')}
        >
          <ExplorerIcon />
        </div>
        <div
          className={`ab-icon${active === 'ab-search' ? ' active' : ''}`}
          id="ab-search"
          title="Rechercher (non implémenté)"
          onClick={() => clickNonImplemented('ab-search')}
        >
          <SearchIcon />
        </div>
        <div
          className={`ab-icon${active === 'ab-git' ? ' active' : ''}`}
          id="ab-git"
          title="Source Control (non implémenté)"
          onClick={() => clickNonImplemented('ab-git')}
        >
          <GitIcon />
        </div>
        <div
          className={`ab-icon${active === 'ab-run' ? ' active' : ''}`}
          id="ab-run"
          title="Exécuter et déboguer (utilise le bouton ▷ de l'éditeur)"
          onClick={() => clickNonImplemented('ab-run')}
        >
          <RunOutlineIcon />
        </div>
        <div
          className={`ab-icon${active === 'ab-ext' ? ' active' : ''}`}
          id="ab-ext"
          title="Extensions (non implémenté)"
          onClick={() => clickNonImplemented('ab-ext')}
        >
          <ExtensionsIcon />
        </div>
      </div>
      <div className="ab-group" style={{ marginBottom: 8 }}>
        <div className="ab-icon" title="Compte (non implémenté)">
          <AccountIcon />
        </div>
        <div className="ab-icon" title="Paramètres (non implémenté)">
          <SettingsIcon />
        </div>
      </div>
    </div>
  );
}
