export interface Example {
  file: string;
  title: string;
  description: string;
  category: string;
}

export const EXAMPLES: readonly Example[] = [
  {
    file: "01-bonjour.algo",
    title: "Bonjour, monde",
    description: "Les premiers pas : afficher un message.",
    category: "Fondamentaux",
  },
  {
    file: "02-factorielle.algo",
    title: "Factorielle",
    description: "Fonctions, variables et boucle tant que.",
    category: "Fondamentaux",
  },
  {
    file: "03-sommes.algo",
    title: "Sommes",
    description: "Deux approches : itérative et récursive.",
    category: "Récursivité",
  },
  {
    file: "04-dichotomie.algo",
    title: "Recherche dichotomique",
    description: "Retrouver un élément dans un tableau trié.",
    category: "Tableaux",
  },
  {
    file: "05-tri-insertion.algo",
    title: "Tri par insertion",
    description: "Ordonner un tableau, élément par élément.",
    category: "Tableaux",
  },
  {
    file: "06-lecture-clavier.algo",
    title: "Lecture au clavier",
    description: "Lire des valeurs et calculer leur somme.",
    category: "Fondamentaux",
  },
  {
    file: "07-liste-chainee.algo",
    title: "Liste chaînée",
    description: "Manipuler des pointeurs et parcourir une liste.",
    category: "Structures",
  },
  {
    file: "08-structure-annuaire.algo",
    title: "Annuaire",
    description: "Construire un annuaire avec des structures.",
    category: "Structures",
  },
];

export const DRAFT_FILE = "mon-algorithme.algo";
export const INITIAL_FILE = "02-factorielle.algo";
export const INITIAL_CODE =
  '// Votre prochain algorithme commence ici.\n\nécrire("Bonjour !");\n';
