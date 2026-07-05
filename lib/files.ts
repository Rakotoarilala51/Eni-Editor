/**
 * Fichiers du projet d'exemple (mêmes exemples que la version originale)
 * + README affiché dans l'onglet "README.md".
 * (extrait tel quel de <script> — logique/contenu inchangés)
 */

export const FILES: Record<string, string> = {
"README.md": `README`,

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
écrire("Somme =" & (a + b));`
};

export const README_HTML = `<h1>pseudo-algo</h1>
<div style="color:#8a8a8a;margin-bottom:14px;">Interpréteur du pseudo-code du cours de Complexité Algorithmique (ENI).</div>

<h2>Utilisation</h2>
Ouvrez un fichier <code>.algo</code> dans l'explorateur, modifiez-le, puis cliquez sur <code>▷ Exécuter</code> (ou F5).
La sortie s'affiche dans le panneau <code>TERMINAL</code> en bas. Les valeurs lues par <code>lire()</code> se saisissent
dans l'onglet <code>ENTRÉE (STDIN)</code>, une valeur par ligne.

<h2>Supporté</h2>
- déclarations : entier, réel, chaine, caractère, booléen
- tableaux t[i] indexés à partir de 1, littéral pratique t := [1,2,3];
- affectation := ou <-
- écrire(...) / lire(...)
- si / alors / sinonsi / sinon / finsi
- tantque ... faire ... finfaire
- pour i := a haut/bas b faire ... finfaire
- répéter ... jusqu'à condition
- fonctions et procédures : debfonc/finfonc, debproc/finproc, paramètres d (valeur) et dr (référence)
- récursivité, et / ou / non, mod / div, concaténation avec &

<h2>Non supporté</h2>
Pointeurs, listes chaînées, structures (structure...fin), piles/files natives : ce sont des exercices sur la
mémoire adressée qui ne se traduisent pas directement dans ce mini-langage exécutable.
`;
