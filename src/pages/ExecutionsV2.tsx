import { useState } from "react";

export default function ExecutionsV2() {
  const [id, setId] = useState("");
  const [data, setData] = useState<any>(null);

  async function load() {
    const res = await fetch("/api/replay/" + id);
    const json = await res.json();
    setData(json);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Replay Viewer V2</h1>

      <input value={id} onChange={(e) => setId(e.target.value)} />
      <button onClick={load}>Load</button>

      {data && (
        <>
          <h2>Execution</h2>
          <pre>{JSON.stringify(data.execution, null, 2)}</pre>

          <h2>Proof</h2>
          <pre>{JSON.stringify(data.proof, null, 2)}</pre>

          <h2>Trace</h2>
          <pre>{JSON.stringify(data.trace, null, 2)}</pre>
        </>
      )}
    </div>
  );
}
