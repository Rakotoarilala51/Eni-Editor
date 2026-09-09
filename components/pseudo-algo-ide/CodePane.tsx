import { memo, useState } from "react";
import { Braces } from "lucide-react";
import CodeEditor from "./CodeEditor";

interface CodePaneProps {
  activeFile: string;
  code: string;
  onChange: (value: string) => void;
}

export default memo(function CodePane({
  activeFile,
  code,
  onChange,
}: CodePaneProps) {
  const [cursor, setCursor] = useState("Ln 1, Col 1");
  return (
    <section className="code-pane" aria-label="Code source">
      <div className="pane-heading">
        <h2>
          <Braces size={16} /> Code
        </h2>
        <span>PSEUDO-CODE</span>
      </div>
      <CodeEditor value={code} onChange={onChange} onCursorChange={setCursor} />
      <div className="pane-footer">
        <span>{activeFile}</span>
        <span>{cursor}</span>
      </div>
    </section>
  );
});
