import { useEffect, useState } from "react";

export default function Proofs() {
  const [proofs, setProofs] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/proofs")
      .then((res) => res.json())
      .then((data) => setProofs(data))
      .catch(() => setProofs([]));
  }, []);

  return (
    <div style={{ padding: 20 }}>
      <h1>Proofs</h1>

      <pre style={{
        background: "#111",
        color: "#0f0",
        padding: 16,
        borderRadius: 8,
        overflow: "auto"
      }}>
        {JSON.stringify(proofs, null, 2)}
      </pre>
    </div>
  );
}
