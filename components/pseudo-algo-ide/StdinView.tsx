interface StdinViewProps {
  active: boolean;
  value: string;
  onChange: (value: string) => void;
}

/** Onglet ENTRÉE (STDIN) : valeurs consommées par lire(), une par ligne. */
export default function StdinView({ active, value, onChange }: StdinViewProps) {
  return (
    <div
      className={`absolute inset-0 overflow-auto p-2.5 ${active ? 'block' : 'hidden'}`}
      id="stdinView"
    >
      <div className="mb-1.5 font-sans text-xs text-[#8a8a8a]">
        Valeurs consommées par{' '}
        <code className="rounded-[3px] bg-[#2d2d2d] px-1.25 py-px">lire()</code> — une
        par ligne.
      </div>
      <textarea
        id="stdinInput"
        spellCheck={false}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-[calc(100%-24px)] w-full resize-none rounded border border-[#3a3a3a] bg-[#1e1e1e] p-2 font-[Consolas,'Courier_New',ui-monospace,monospace] text-[13px] text-[#d4d4d4] outline-none focus:border-[#1177bb]"
      />
    </div>
  );
}