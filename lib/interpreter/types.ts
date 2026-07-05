/**
 * Types partagés par le lexer, le parseur et l'interpréteur.
 * (extrait de <script> — logique inchangée, uniquement typé)
 */

export type TokenType = 'NUMBER' | 'STRING' | 'IDENT' | 'OP' | 'EOF';

export interface Token {
  type: TokenType;
  value: any;
  pos: number;
}

/** Nœud d'AST générique : la grammaire du pseudo-code produit des formes
 *  variées (VarDecl, Assign, If, While, For, Repeat, FuncDecl, Binary, ...),
 *  on garde donc une forme ouverte pour ne pas modifier la logique d'origine. */
export interface AstNode {
  type: string;
  [key: string]: any;
}

export interface InterpreterIO {
  write(s: string): void;
  read(): string;
}
