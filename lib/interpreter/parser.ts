import type { Token, AstNode } from './types';
import { normalize } from './utils';
import { PseudoError } from './errors';

/**
 * Parseur (analyse syntaxique) du pseudo-code.
 * (extrait tel quel de <script> — logique inchangée)
 */

export const TYPE_KEYWORDS = ['entier', 'reel', 'chaine', 'caractere', 'booleen'];
export const RESERVED = [
  'si', 'tantque', 'pour', 'repeter', 'ecrire', 'lire', 'retourner', 'arret', 'sinon', 'sinonsi',
  'finsi', 'finfaire', 'finfonc', 'finproc', 'alors', 'faire', 'haut', 'bas', "jusqu'a", 'jusqua',
  'vrai', 'faux', 'non', 'et', 'ou', 'mod', 'div', 'vide', 'debfonc', 'debproc',
];

export class Parser {
  toks: Token[];
  pos: number;

  constructor(tokens: Token[]) {
    this.toks = tokens;
    this.pos = 0;
  }

  peek(o = 0): Token { return this.toks[this.pos + o] || this.toks[this.toks.length - 1]; }
  at(word: string): boolean { const t = this.peek(); return t.type === 'IDENT' && normalize(t.value) === word; }
  atAny(words: string[]): boolean { const t = this.peek(); return t.type === 'IDENT' && words.includes(normalize(t.value)); }
  atOp(sym: string): boolean { const t = this.peek(); return t.type === 'OP' && t.value === sym; }
  next(): Token { return this.toks[this.pos++]; }
  err(msg: string): never {
    const t = this.peek();
    throw new PseudoError(`${msg} (près de "${t.value === null ? 'fin du fichier' : t.value}")`);
  }
  expectOp(sym: string): Token { if (!this.atOp(sym)) this.err(`'${sym}' attendu`); return this.next(); }
  expectKw(word: string): Token { if (!this.at(word)) this.err(`mot-clé '${word}' attendu`); return this.next(); }
  optSemi(): void { if (this.atOp(';')) this.next(); }

  parseProgram(): AstNode {
    const body: AstNode[] = [];
    while (this.peek().type !== 'EOF') body.push(this.parseStatement());
    return { type: 'Program', body };
  }

  isTypeKeyword(): boolean { const t = this.peek(); return t.type === 'IDENT' && TYPE_KEYWORDS.includes(normalize(t.value)); }
  isVideKeyword(): boolean { return this.at('vide'); }

  parseStatement(): AstNode {
    if (this.isTypeKeyword() || this.isVideKeyword()) {
      const p1 = this.peek(1), p2 = this.peek(2);
      if (p1 && p1.type === 'IDENT' && p2 && p2.type === 'OP' && p2.value === '(') return this.parseFuncDecl();
      if (this.isVideKeyword()) this.err("'vide' ne peut apparaître que comme type de retour d'une fonction/procédure");
      return this.parseVarDecl();
    }
    if (this.at('si')) return this.parseIf();
    if (this.at('tantque')) return this.parseWhile();
    if (this.at('pour')) return this.parseFor();
    if (this.at('repeter')) return this.parseRepeat();
    if (this.at('ecrire')) return this.parseWrite();
    if (this.at('lire')) return this.parseRead();
    if (this.at('retourner')) return this.parseReturn();
    if (this.at('arret')) { this.next(); this.optSemi(); return { type: 'Stop' }; }
    return this.parseAssignOrExpr();
  }

  parseVarDecl(): AstNode {
    this.next();
    const decls: { name: string; size: AstNode | null }[] = [];
    while (true) {
      const nameTok = this.next();
      if (nameTok.type !== 'IDENT') this.err('nom de variable attendu');
      let size: AstNode | null = null;
      if (this.atOp('[')) { this.next(); size = this.parseExpr(); this.expectOp(']'); }
      decls.push({ name: nameTok.value, size });
      if (this.atOp(',')) { this.next(); continue; }
      break;
    }
    this.optSemi();
    return { type: 'VarDecl', decls };
  }

  parseFuncDecl(): AstNode {
    const isProc = this.isVideKeyword();
    this.next();
    const nameTok = this.next();
    this.expectOp('(');
    const params: { mode: string; name: string }[] = [];
    if (this.at('vide')) this.next();
    else {
      while (!this.atOp(')')) {
        let mode = 'd';
        if (this.atAny(['d', 'dr', 'r'])) {
          const save = this.pos;
          const modWord = normalize(this.peek().value);
          this.next();
          if (this.isTypeKeyword()) mode = modWord === 'd' ? 'd' : 'dr';
          else this.pos = save;
        }
        if (this.isTypeKeyword()) this.next(); else this.err('type de paramètre attendu');
        const pname = this.next();
        if (pname.type !== 'IDENT') this.err('nom de paramètre attendu');
        if (this.atOp('[')) { this.next(); if (!this.atOp(']')) this.parseExpr(); this.expectOp(']'); }
        params.push({ mode, name: pname.value });
        if (this.atOp(',')) { this.next(); continue; }
        break;
      }
    }
    this.expectOp(')');
    if (!(this.at('debfonc') || this.at('debproc'))) this.err("'debfonc' ou 'debproc' attendu");
    this.next();
    const body = this.parseStatementList(['finfonc', 'finproc']);
    if (!(this.at('finfonc') || this.at('finproc'))) this.err("'finfonc' ou 'finproc' attendu");
    this.next(); this.optSemi();
    return { type: 'FuncDecl', name: nameTok.value, params, isProc, body };
  }

  parseStatementList(terminators: string[]): AstNode[] {
    const body: AstNode[] = [];
    while (true) {
      const t = this.peek();
      if (t.type === 'EOF') break;
      if (t.type === 'IDENT' && terminators.includes(normalize(t.value))) break;
      body.push(this.parseStatement());
    }
    return body;
  }

  parseIf(): AstNode {
    this.next();
    const cond = this.parseExpr();
    this.expectKw('alors');
    const thenBody = this.parseStatementList(['sinonsi', 'sinon', 'finsi']);
    const elifs: { cond: AstNode; body: AstNode[] }[] = [];
    while (this.at('sinonsi')) {
      this.next();
      const c = this.parseExpr();
      this.expectKw('alors');
      const b = this.parseStatementList(['sinonsi', 'sinon', 'finsi']);
      elifs.push({ cond: c, body: b });
    }
    let elseBody: AstNode[] | null = null;
    if (this.at('sinon')) { this.next(); elseBody = this.parseStatementList(['finsi']); }
    this.expectKw('finsi'); this.optSemi();
    return { type: 'If', cond, thenBody, elifs, elseBody };
  }

  parseWhile(): AstNode {
    this.next();
    const cond = this.parseExpr();
    this.expectKw('faire');
    const body = this.parseStatementList(['finfaire']);
    this.expectKw('finfaire'); this.optSemi();
    return { type: 'While', cond, body };
  }

  parseFor(): AstNode {
    this.next();
    const nameTok = this.next();
    if (nameTok.type !== 'IDENT') this.err('variable de boucle attendue');
    this.expectOp(':=');
    const start = this.parseExpr();
    let dir: string;
    if (this.at('haut')) { this.next(); dir = 'haut'; }
    else if (this.at('bas')) { this.next(); dir = 'bas'; }
    else { this.err("'haut' ou 'bas' attendu"); }
    const end = this.parseExpr();
    this.expectKw('faire');
    const body = this.parseStatementList(['finfaire']);
    this.expectKw('finfaire'); this.optSemi();
    return { type: 'For', varName: nameTok.value, start, end, dir, body };
  }

  parseRepeat(): AstNode {
    this.next();
    const body = this.parseStatementList(['jusqua', "jusqu'a"]);
    if (!(this.at('jusqua') || this.at("jusqu'a"))) this.err("'jusqu'à' attendu");
    this.next();
    const cond = this.parseExpr();
    this.optSemi();
    return { type: 'Repeat', body, cond };
  }

  parseWrite(): AstNode {
    this.next(); this.expectOp('(');
    const args: AstNode[] = [];
    if (!this.atOp(')')) { args.push(this.parseExpr()); while (this.atOp(',')) { this.next(); args.push(this.parseExpr()); } }
    this.expectOp(')'); this.optSemi();
    return { type: 'Write', args };
  }

  parseRead(): AstNode {
    this.next(); this.expectOp('(');
    const targets: AstNode[] = [this.parseLValue()];
    while (this.atOp(',')) { this.next(); targets.push(this.parseLValue()); }
    this.expectOp(')'); this.optSemi();
    return { type: 'Read', targets };
  }

  parseReturn(): AstNode {
    this.next();
    let expr: AstNode | null = null;
    if (!this.atOp(';') && this.peek().type !== 'EOF' && !this.isBlockEnd()) expr = this.parseExpr();
    this.optSemi();
    return { type: 'Return', expr };
  }

  isBlockEnd(): boolean {
    const t = this.peek();
    if (t.type !== 'IDENT') return false;
    return ['finfonc', 'finproc', 'finsi', 'finfaire', 'sinon', 'sinonsi', 'jusqua', "jusqu'a"].includes(normalize(t.value));
  }

  parseLValue(): AstNode {
    const nameTok = this.next();
    if (nameTok.type !== 'IDENT') this.err('identificateur attendu');
    let node: AstNode = { type: 'Ident', name: nameTok.value };
    while (this.atOp('[')) { this.next(); const idx = this.parseExpr(); this.expectOp(']'); node = { type: 'Index', obj: node, index: idx }; }
    return node;
  }

  parseAssignOrExpr(): AstNode {
    const startPos = this.pos;
    if (this.peek().type === 'IDENT' && !RESERVED.includes(normalize(this.peek().value))) {
      const lv = this.parseLValue();
      if (this.atOp(':=')) { this.next(); const value = this.parseExpr(); this.optSemi(); return { type: 'Assign', target: lv, value }; }
      this.pos = startPos;
    }
    const expr = this.parseExpr();
    this.optSemi();
    return { type: 'ExprStmt', expr };
  }

  parseExpr(): AstNode { return this.parseOr(); }
  parseOr(): AstNode { let l = this.parseAnd(); while (this.at('ou')) { this.next(); l = { type: 'Logical', op: 'ou', left: l, right: this.parseAnd() }; } return l; }
  parseAnd(): AstNode { let l = this.parseNot(); while (this.at('et')) { this.next(); l = { type: 'Logical', op: 'et', left: l, right: this.parseNot() }; } return l; }
  parseNot(): AstNode { if (this.at('non')) { this.next(); return { type: 'Unary', op: 'non', expr: this.parseNot() }; } return this.parseComparison(); }
  parseComparison(): AstNode {
    let l = this.parseConcat();
    const ops = ['=', '<>', '<', '<=', '>', '>='];
    while (this.peek().type === 'OP' && ops.includes(this.peek().value)) {
      const op = this.next().value; l = { type: 'Binary', op, left: l, right: this.parseConcat() };
    }
    return l;
  }
  parseConcat(): AstNode { let l = this.parseAdditive(); while (this.atOp('&')) { this.next(); l = { type: 'Binary', op: '&', left: l, right: this.parseAdditive() }; } return l; }
  parseAdditive(): AstNode {
    let l = this.parseMultiplicative();
    while (this.atOp('+') || this.atOp('-')) { const op = this.next().value; l = { type: 'Binary', op, left: l, right: this.parseMultiplicative() }; }
    return l;
  }
  parseMultiplicative(): AstNode {
    let l = this.parseUnary();
    while (this.atOp('*') || this.atOp('/') || this.at('mod') || this.at('div')) {
      let op: string;
      if (this.atOp('*') || this.atOp('/')) op = this.next().value; else op = normalize(this.next().value);
      l = { type: 'Binary', op, left: l, right: this.parseUnary() };
    }
    return l;
  }
  parseUnary(): AstNode {
    if (this.atOp('-') || this.atOp('+')) { const op = this.next().value; return { type: 'Unary', op, expr: this.parseUnary() }; }
    return this.parsePostfix();
  }
  parsePostfix(): AstNode {
    let node = this.parsePrimary();
    while (true) {
      if (this.atOp('[')) { this.next(); const idx = this.parseExpr(); this.expectOp(']'); node = { type: 'Index', obj: node, index: idx }; }
      else if (this.atOp('(') && node.type === 'Ident') {
        this.next(); const args: AstNode[] = [];
        if (!this.atOp(')')) { args.push(this.parseExpr()); while (this.atOp(',')) { this.next(); args.push(this.parseExpr()); } }
        this.expectOp(')'); node = { type: 'Call', name: node.name, args };
      } else break;
    }
    return node;
  }
  parsePrimary(): AstNode {
    const t = this.peek();
    if (t.type === 'NUMBER') { this.next(); return { type: 'Literal', value: t.value }; }
    if (t.type === 'STRING') { this.next(); return { type: 'Literal', value: t.value }; }
    if (this.at('vrai')) { this.next(); return { type: 'Literal', value: true }; }
    if (this.at('faux')) { this.next(); return { type: 'Literal', value: false }; }
    if (this.atOp('(')) { this.next(); const e = this.parseExpr(); this.expectOp(')'); return e; }
    if (this.atOp('[')) {
      this.next(); const els: AstNode[] = [];
      if (!this.atOp(']')) { els.push(this.parseExpr()); while (this.atOp(',')) { this.next(); els.push(this.parseExpr()); } }
      this.expectOp(']');
      return { type: 'ArrayLiteral', elements: els };
    }
    if (t.type === 'IDENT') { this.next(); return { type: 'Ident', name: t.value }; }
    this.err('expression attendue');
  }
}
