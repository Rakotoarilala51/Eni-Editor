import { useCallback, useState } from "react";
import { FILES } from "@/lib/files";
import { DRAFT_FILE, INITIAL_CODE, INITIAL_FILE } from "../examples";

export function useAlgorithm() {
  const [contents, setContents] = useState<Record<string, string>>(() => ({
    ...FILES,
    [DRAFT_FILE]: INITIAL_CODE,
  }));
  const [activeFile, selectFile] = useState(INITIAL_FILE);
  const code = contents[activeFile];
  const updateCode = useCallback(
    (value: string) => {
      setContents((previous) =>
        previous[activeFile] === value
          ? previous
          : { ...previous, [activeFile]: value },
      );
    },
    [activeFile],
  );

  return { activeFile, code, selectFile, updateCode };
}
