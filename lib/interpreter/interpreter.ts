import type { AstNode, InterpreterIO } from './types';
import { normalize, toNumber, toDisplay, truthy, looseEq } from './utils';
import { PseudoError, ReturnSignal, StopSignal } from './errors';

/**
 * Environnement d'exécution (portée des variables) et interpréteur.
 * (extrait tel quel de <script> — logique inchangée)
 */

interface Box { value: any; }

export class Env {
  vars: Map<string, Box>;
  parent: Env | null;

  constructor(parent: Env | null = null) {
    this.vars = new Map();
    this.parent = parent;
  }
  declare(name: string, value: any): void { this.vars.set(name, { value }); }
  getBox(name: string): Box | null {
    let e: Env | null = this;
    while (e) { if (e.vars.has(name)) return e.vars.get(name)!; e = e.parent; }
    return null;
  }
  get(name: string): any {
    const b = this.getBox(name);
    if (!b) throw new PseudoError(`Variable non déclarée : ${name}`);
    return b.value;
  }
  set(name: string, value: any): void {
    const b = this.getBox(name);
    if (!b) throw new PseudoError(`Variable non déclarée : ${name}`);
    b.value = value;
  }
}

export class Interpreter {
  io: InterpreterIO;
  functions: Map<string, AstNode>;
  global: Env;

  constructor(io: InterpreterIO) {
    this.io = io;
    this.functions = new Map();
    this.global = new Env();
  }

  run(program: AstNode): void {
    for (const s of program.body) if (s.type === 'FuncDecl') this.functions.set(normalize(s.name), s);
    for (const s of program.body) if (s.type !== 'FuncDecl') this.exec(s, this.global);
  }

  exec(stmt: AstNode, env: Env): void {
    switch (stmt.type) {
      case 'VarDecl':
        for (const d of stmt.decls) {
          if (d.size != null) {
            const size = Math.trunc(toNumber(this.eval(d.size, env)));
            env.declare(d.name, new Array(Math.max(size, 0) + 1).fill(0));
          } else env.declare(d.name, 0);
        }
        return;
      case 'Assign': this.assignTo(stmt.target, this.eval(stmt.value, env), env); return;
      case 'Write': this.io.write(stmt.args.map((a: AstNode) => toDisplay(this.eval(a, env))).join(' ')); return;
      case 'Read':
        for (const target of stmt.targets) {
          const raw = this.io.read();
          const val = /^-?\d+(\.\d+)?$/.test((raw || '').trim()) ? parseFloat(raw) : raw;
          this.assignTo(target, val, env);
        }
        return;
      case 'If':
        if (truthy(this.eval(stmt.cond, env))) { this.execList(stmt.thenBody, env); return; }
        for (const ei of stmt.elifs) if (truthy(this.eval(ei.cond, env))) { this.execList(ei.body, env); return; }
        if (stmt.elseBody) this.execList(stmt.elseBody, env);
        return;
      case 'While': {
        let guard = 0;
        while (truthy(this.eval(stmt.cond, env))) {
          this.execList(stmt.body, env);
          if (++guard > 2000000) throw new PseudoError("Boucle tantque : trop d'itérations (sécurité)");
        }
        return;
      }
      case 'For': {
        const startVal = Math.trunc(toNumber(this.eval(stmt.start, env)));
        const endVal = Math.trunc(toNumber(this.eval(stmt.end, env)));
        if (!env.vars.has(stmt.varName)) env.declare(stmt.varName, startVal); else env.set(stmt.varName, startVal);
        let guard = 0;
        if (stmt.dir === 'haut') {
          for (let i = startVal; i <= endVal; i++) {
            env.set(stmt.varName, i); this.execList(stmt.body, env);
            if (++guard > 2000000) throw new PseudoError("Boucle pour : trop d'itérations (sécurité)");
          }
        } else {
          for (let i = startVal; i >= endVal; i--) {
            env.set(stmt.varName, i); this.execList(stmt.body, env);
            if (++guard > 2000000) throw new PseudoError("Boucle pour : trop d'itérations (sécurité)");
          }
        }
        return;
      }
      case 'Repeat': {
        let guard = 0;
        do {
          this.execList(stmt.body, env);
          if (++guard > 2000000) throw new PseudoError("Boucle répéter : trop d'itérations (sécurité)");
        } while (!truthy(this.eval(stmt.cond, env)));
        return;
      }
      case 'Return': throw new ReturnSignal(stmt.expr ? this.eval(stmt.expr, env) : undefined);
      case 'Stop': throw new StopSignal();
      case 'ExprStmt': this.eval(stmt.expr, env); return;
      default: throw new PseudoError('Instruction inconnue : ' + stmt.type);
    }
  }

  execList(list: AstNode[], env: Env): void { for (const s of list) this.exec(s, env); }

  assignTo(target: AstNode, value: any, env: Env): void {
    if (target.type === 'Ident') { env.set(target.name, value); return; }
    if (target.type === 'Index') {
      const arr = this.eval(target.obj, env);
      if (!Array.isArray(arr)) throw new PseudoError("Cette variable n'est pas un tableau");
      const idx = Math.trunc(toNumber(this.eval(target.index, env)));
      if (idx < 0) throw new PseudoError('Indice de tableau négatif');
      for (let k = arr.length; k <= idx; k++) arr[k] = 0;
      arr[idx] = value;
      return;
    }
    throw new PseudoError("Cible d'affectation invalide");
  }

  eval(node: AstNode, env: Env): any {
    switch (node.type) {
      case 'Literal': return node.value;
      case 'Ident': return env.get(node.name);
      case 'ArrayLiteral': return [0, ...node.elements.map((e: AstNode) => this.eval(e, env))];
      case 'Index': {
        const arr = this.eval(node.obj, env);
        if (!Array.isArray(arr)) throw new PseudoError("Indexation sur une variable qui n'est pas un tableau");
        return arr[Math.trunc(toNumber(this.eval(node.index, env)))];
      }
      case 'Unary': {
        const v = this.eval(node.expr, env);
        if (node.op === 'non') return !truthy(v);
        if (node.op === '-') return -toNumber(v);
        return +toNumber(v);
      }
      case 'Logical': {
        const l = truthy(this.eval(node.left, env));
        if (node.op === 'ou') return l || truthy(this.eval(node.right, env));
        return l && truthy(this.eval(node.right, env));
      }
      case 'Binary': {
        if (node.op === '&') return toDisplay(this.eval(node.left, env)) + toDisplay(this.eval(node.right, env));
        const l = this.eval(node.left, env), r = this.eval(node.right, env);
        switch (node.op) {
          case '+': return (typeof l === 'string' || typeof r === 'string') ? (toDisplay(l) + toDisplay(r)) : toNumber(l) + toNumber(r);
          case '-': return toNumber(l) - toNumber(r);
          case '*': return toNumber(l) * toNumber(r);
          case '/': return toNumber(l) / toNumber(r);
          case 'mod': { const a = toNumber(l), b = toNumber(r); return ((a % b) + b) % b; }
          case 'div': return Math.trunc(toNumber(l) / toNumber(r));
          case '=': return looseEq(l, r);
          case '<>': return !looseEq(l, r);
          case '<': return toNumber(l) < toNumber(r);
          case '<=': return toNumber(l) <= toNumber(r);
          case '>': return toNumber(l) > toNumber(r);
          case '>=': return toNumber(l) >= toNumber(r);
        }
        break;
      }
      case 'Call': return this.callFunction(node.name, node.args, env);
      default: throw new PseudoError('Expression inconnue : ' + node.type);
    }
  }

  callFunction(name: string, argNodes: AstNode[], env: Env): any {
    const fn = this.functions.get(normalize(name));
    if (!fn) throw new PseudoError(`Fonction ou procédure non définie : ${name}`);
    const callEnv = new Env(this.global);
    fn.params.forEach((p: { mode: string; name: string }, i: number) => {
      const argNode = argNodes[i];
      if (!argNode) { callEnv.declare(p.name, 0); return; }
      if (p.mode === 'dr' && argNode.type === 'Ident') {
        const box = env.getBox(argNode.name);
        if (box) { callEnv.vars.set(p.name, box); return; }
      }
      const val = this.eval(argNode, env);
      callEnv.declare(p.name, Array.isArray(val) ? val.slice() : val);
    });
    try { this.execList(fn.body, callEnv); }
    catch (sig) { if (sig instanceof ReturnSignal) return sig.value; throw sig; }
    return undefined;
  }
}
