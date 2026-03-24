import { useEffect, useState } from "react";

export default function ProofsV2() {
  const [proofs, setProofs] = useState<any[]>([]);
  const [selected, setSelected] = useState<any>(null);

  useEffect(() => {
    fetch("/api/proofs")
      .then(r => r.json())
      .then(setProofs);
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Proof Viewer V2</h1>

      {proofs.map((p) => (
        <div
          key={p.id}
          style={{ border: "1px solid #444", padding: 10, marginBottom: 10, cursor: "pointer" }}
          onClick={() => setSelected(p)}
        >
          {p.id} — {p.decision}
        </div>
      ))}

      {selected && (
        <div style={{ marginTop: 20 }}>
          <h2>Proof Detail</h2>
          <pre>{JSON.stringify(selected, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}
