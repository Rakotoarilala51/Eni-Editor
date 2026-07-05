interface StdinViewProps {
  active: boolean;
  value: string;
  onChange: (value: string) => void;
}

/** Onglet ENTRÉE (STDIN) : valeurs consommées par lire(), une par ligne. */
export default function StdinView({ active, value, onChange }: StdinViewProps) {
  return (
    <div className={`panel-view${active ? ' active' : ''}`} id="stdinView">
      <div className="hint">
        Valeurs consommées par <code style={{ background: '#2d2d2d', padding: '1px 5px', borderRadius: 3 }}>lire()</code> — une par ligne.
      </div>
      <textarea
        id="stdinInput"
        spellCheck={false}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
