import {
  tokenize,
  Parser,
  Interpreter,
  StopSignal,
} from "./interpreter";

export type OutputLine = { text: string; kind?: "error" | "meta" };
export interface ExecutionResult {
  output: OutputLine[];
  status: string;
}

export function runProgram(code: string, stdin: string): ExecutionResult {
  const lines: OutputLine[] = [];
  const inputs = stdin.split(/\r?\n/);
  let index = 0;
  const start = performance.now();
  let status: string;
  try {
    const program = new Parser(tokenize(code)).parseProgram();
    new Interpreter({
      write: (text) => {
        lines.push({ text });
      },
      read: () => inputs[index++] ?? "",
    }).run(program);
    status = `Terminé en ${(performance.now() - start).toFixed(1)} ms`;
    lines.push({ text: "Exécution terminée · code de sortie 0", kind: "meta" });
  } catch (error: unknown) {
    if (error instanceof StopSignal) {
      lines.push({ text: "Arrêt du programme", kind: "meta" });
      status = "Programme arrêté";
    } else {
      const message =
        error instanceof RangeError
          ? "Récursion trop profonde."
          : error instanceof Error
            ? error.message
            : String(error);
      lines.push({ text: `Erreur : ${message}`, kind: "error" });
      status = "Erreur d’exécution";
    }
  }
  return { output: lines, status };
}
