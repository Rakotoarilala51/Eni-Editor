/**
 * Fichiers du projet d'exemple (mêmes exemples que la version originale)
 * + README désormais éditable comme un fichier texte normal dans CodeEditor.
 */

export const FILES: Record<string, string> = {
  "README.md": `# pseudo-algo

Interpréteur du pseudo-code du cours de Complexité Algorithmique (ENI).

## Utilisation

Ouvrez un fichier .algo dans l'explorateur, modifiez-le, puis cliquez sur ▷ Exécuter (ou F5).
La sortie s'affiche dans le panneau TERMINAL en bas. Les valeurs lues par lire() se saisissent
dans l'onglet ENTRÉE (STDIN), une valeur par ligne.

## Supporté

- déclarations : entier, réel, chaine, caractère, booléen, pointeur
- tableaux t[i] indexés à partir de 1, littéral pratique t := [1,2,3];
- affectation := ou <-
- écrire(...) / lire(...)
- si / alors / sinonsi / sinon / finsi
- tantque ... faire ... finfaire
- pour i := a haut/bas b faire ... finfaire
- répéter ... jusqu'à condition
- fonctions et procédures : debfonc/finfonc, debproc/finproc, paramètres d (valeur) et dr (référence)
- récursivité, et / ou / non, mod / div, concaténation avec &
- listes chaînées : nil, nouveau(p), laisser(p), accès aux champs via -> ou .
- structures : structure NOM ... fin;, type structure NOM alias;, y compris
  les champs auto-référentiels (structure NOM* champ;) pour les cellules chaînées

## Non supporté

Piles/files natives, fichiers, tableaux de structures dynamiques avancés : hors périmètre
de ce mini-langage exécutable.
`,

  "01-bonjour.algo": `écrire("Bonjour Aina, l'interpréteur fonctionne !");`,

  "02-factorielle.algo": `entier factorielle(d entier n)
debfonc
    entier fact, i;
    fact := 1;
    i := 2;
    tantque i <= n faire
        fact := fact * i;
        i := i + 1;
    finfaire;
    retourner fact;
finfonc;

entier n, r;
n := 6;
r := factorielle(n);
écrire("Factorielle de" & n & "=" & r);`,

  "03-sommes.algo": `entier somIter(d entier n)
debfonc
    entier i, s;
    i := 1; s := 0;
    tantque i <= n faire
        s := s + i;
        i := i + 1;
    finfaire;
    retourner s;
finfonc;

entier somRec(d entier n)
debfonc
    si n <= 0 alors
        retourner 0;
    sinon
        retourner n + somRec(n - 1);
    finsi;
finfonc;

écrire("Somme itérative 1..10 =" & somIter(10));
écrire("Somme récursive 1..10 =" & somRec(10));`,

  "04-dichotomie.algo": `booléen dichotomie(d entier t[], d entier n, d entier elem)
debfonc
    entier inf, sup, m;
    booléen trouve;
    trouve := faux;
    inf := 1; sup := n;
    tantque (inf <= sup) et (non trouve) faire
        m := (inf + sup) div 2;
        si t[m] = elem alors
            trouve := vrai;
        sinonsi t[m] < elem alors
            inf := m + 1;
        sinon
            sup := m - 1;
        finsi;
    finfaire;
    retourner trouve;
finfonc;

entier t[8];
t := [3, 7, 12, 19, 25, 33, 41, 50];
écrire("Tableau =" & t);
écrire("25 est présent ?" & dichotomie(t, 8, 25));
écrire("100 est présent ?" & dichotomie(t, 8, 100));`,

  "05-tri-insertion.algo": `vide triInsertion(dr entier t[], d entier n)
debfonc
    entier i, j, cle;
    i := 2;
    tantque i <= n faire
        cle := t[i];
        j := i - 1;
        tantque (j >= 1) et (t[j] > cle) faire
            t[j+1] := t[j];
            j := j - 1;
        finfaire;
        t[j+1] := cle;
        i := i + 1;
    finfaire;
finfonc;

entier v[6];
v := [5, 3, 8, 1, 9, 2];
écrire("Avant tri :" & v);
triInsertion(v, 6);
écrire("Après tri :" & v);`,

  "06-lecture-clavier.algo": `entier a, b;
écrire("Renseignez 2 valeurs dans l'onglet ENTRÉE (STDIN) du panneau du bas, puis Exécuter.");
lire(a);
lire(b);
écrire("Somme =" & (a + b));`,
  "07-liste-chainee.algo": `// Liste linéaire chaînée (cf. cours, chapitre 2.2)
// insertete : insertion en tête ; parcours1 : parcours récursif à l'endroit.

vide insertete(dr pointeur l, d entier elem)
debproc
    pointeur p;
    nouveau(p);
    p->info := elem;
    p->suivant := l;
    l := p;
finproc;

vide parcours1(d pointeur l)
debproc
    si l <> nil alors
        écrire(l->info);
        parcours1(l->suivant);
    finsi;
finproc;

vide parcours3(d pointeur l)
debproc
    tantque l <> nil faire
        écrire(l->info);
        l := l->suivant;
    finfaire;
finproc;

pointeur liste;
liste := nil;
insertete(liste, 3);
insertete(liste, 2);
insertete(liste, 1);

écrire("Parcours récursif (endroit) :");
parcours1(liste);

écrire("Parcours itératif :");
parcours3(liste);`,

  "08-structure-annuaire.algo": `// Structures + pointeur auto-référentiel (cf. cours, chapitre 2.2 / TD3)
// Un annuaire d'individus chaînés entre eux via le champ 'suivant'.

structure individu
    chaine nom, telephone;
    structure individu* suivant;
fin;

type structure individu personne;

vide ajouter(dr pointeur annuaire, d chaine nom, d chaine telephone)
debproc
    personne p;
    p.nom := nom;
    p.telephone := telephone;
    p.suivant := annuaire;
    annuaire := p;
finproc;

vide afficher(d pointeur annuaire)
debproc
    si annuaire <> nil alors
        écrire(annuaire->nom & " - " & annuaire->telephone);
        afficher(annuaire->suivant);
    finsi;
finproc;

pointeur annuaire;
annuaire := nil;
ajouter(annuaire, "Rakoto", "0341234567");
ajouter(annuaire, "Rasoa", "0339876543");
ajouter(annuaire, "Rabe", "0324455667");

écrire("Annuaire (du plus récent au plus ancien) :");
afficher(annuaire);`,
};
