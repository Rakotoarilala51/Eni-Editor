/**
 * Erreurs et signaux de contrôle de l'interpréteur.
 * (extrait tel quel de <script> — logique inchangée)
 */

export class PseudoError extends Error {}

export class ReturnSignal {
  value: any;
  constructor(value: any) {
    this.value = value;
  }
}

export class StopSignal {}
