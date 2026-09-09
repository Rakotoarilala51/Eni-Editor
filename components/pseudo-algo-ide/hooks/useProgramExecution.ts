import { useCallback, useState } from "react";
import { runProgram, type ExecutionResult } from "@/lib/runProgram";

const IDLE: ExecutionResult = { output: [], status: "Prêt à exécuter" };

export function useProgramExecution(code: string) {
  const [stdin, setStdin] = useState("");
  const [result, setResult] = useState(IDLE);
  const run = useCallback(
    () => setResult(runProgram(code, stdin)),
    [code, stdin],
  );
  const clear = useCallback(() => setResult(IDLE), []);

  return { ...result, stdin, setStdin, run, clear };
}
