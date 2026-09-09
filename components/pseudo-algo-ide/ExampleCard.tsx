import { memo } from "react";
import { ArrowUpRight, Check } from "lucide-react";
import type { Example } from "./examples";

interface ExampleCardProps {
  example: Example;
  selected: boolean;
  onSelect: (file: string) => void;
}

export default memo(function ExampleCard({
  example,
  selected,
  onSelect,
}: ExampleCardProps) {
  const { file, title, description, category } = example;
  return (
    <button className="example-card" onClick={() => onSelect(file)}>
      <span className="card-top">
        <span>{category}</span>
        {selected ? <Check size={17} /> : <ArrowUpRight size={17} />}
      </span>
      <span className="card-title">{title}</span>
      <span className="card-description">{description}</span>
      <span className="card-bottom">
        {file.slice(0, 2)} <span>OUVRIR L’EXEMPLE</span>
      </span>
    </button>
  );
});
