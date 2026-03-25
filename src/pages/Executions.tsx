import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";

type ExecutionRecord = {
  id: string;
  timestamp: string;
  goal: string;
  tool: string;
  decision: "ALLOW" | "STABILIZE" | "BLOCK";
  reason: string;
  result: any;
  status: string;
  auditId: string;
  proofRef: string;
};

type ReplayRecord = {
  execution: ExecutionRecord;
  proof: any;
  trace: Array<{
    id: string;
    execution_id: string;
    proof_id: string;
    audit_id: string;
    event_type: string;
    payload: any;
    created_at: string;
  }>;
};

function DecisionBadge({ decision }: { decision: ExecutionRecord["decision"] }) {
  const cls =
    decision === "ALLOW"
      ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
      : decision === "STABILIZE"
        ? "bg-amber-500/10 text-amber-500 border border-amber-500/20"
        : "bg-red-500/10 text-red-500 border border-red-500/20";

  return (
    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider ${cls}`}>
      {decision}
    </span>
  );
}

export default function Executions() {
  const [executions, setExecutions] = useState<ExecutionRecord[]>([]);
  const [query, setQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [selected, setSelected] = useState<ReplayRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [replayLoading, setReplayLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filters = ["ALL", "ALLOW", "BLOCK", "STABILIZE"];

  async function loadExecutions() {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/executions");
      if (!res.ok) throw new Error("Failed to load executions");
      const data = await res.json();
      setExecutions(Array.isArray(data) ? data : []);
    } catch (err: any) {
      setError(err?.message || "Failed to load executions");
    } finally {
      setLoading(false);
    }
  }

  async function openReplay(executionId: string) {
    setReplayLoading(true);
    try {
      const res = await fetch(`/api/replay/${executionId}`);
      if (!res.ok) throw new Error("Replay not found");
      const data = await res.json();
      setSelected(data);
    } catch (err: any) {
      setError(err?.message || "Failed to load replay");
    } finally {
      setReplayLoading(false);
    }
  }

  useEffect(() => {
    loadExecutions();
  }, []);

  const filtered = executions.filter((e) => {
    const matchesFilter = activeFilter === "ALL" ? true : e.decision === activeFilter;
    const q = query.trim().toLowerCase();
    const matchesQuery =
      q.length === 0 ||
      e.id.toLowerCase().includes(q) ||
      (e.goal || "").toLowerCase().includes(q) ||
      (e.tool || "").toLowerCase().includes(q) ||
      (e.reason || "").toLowerCase().includes(q);

    return matchesFilter && matchesQuery;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Operations Log</h1>
        <p className="text-muted-foreground">
          Real execution records with replayable proof and ledger trace.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2 bg-secondary/50 p-1 rounded-lg border border-border">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${
                activeFilter === f
                  ? "bg-background text-foreground shadow-sm border border-border/50"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search executions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 text-red-500 border border-red-500/20 rounded-xl px-4 py-3 text-sm">
          {error}
        </div>
      )}

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-border bg-secondary/20 flex items-center justify-between">
          <h3 className="font-semibold">Execution Stream</h3>
          <span className="text-xs text-muted-foreground">
            {loading ? "Loading..." : `${filtered.length} execution(s)`}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-secondary/30 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">ID</th>
                <th className="px-6 py-4 font-medium">Goal</th>
                <th className="px-6 py-4 font-medium">Tool</th>
                <th className="px-6 py-4 font-medium">Decision</th>
                <th className="px-6 py-4 font-medium">Reason</th>
                <th className="px-6 py-4 font-medium">Proof</th>
                <th className="px-6 py-4 font-medium">Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((e) => (
                <tr key={e.id} className="hover:bg-secondary/10 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs">{e.id}</td>
                  <td className="px-6 py-4 max-w-[220px] truncate">{e.goal}</td>
                  <td className="px-6 py-4">{e.tool}</td>
                  <td className="px-6 py-4">
                    <DecisionBadge decision={e.decision} />
                  </td>
                  <td className="px-6 py-4 text-muted-foreground max-w-[260px] truncate">
                    {e.reason}
                  </td>
                  <td
                    className="px-6 py-4 font-mono text-xs text-primary hover:underline cursor-pointer"
                    onClick={() => openReplay(e.id)}
                  >
                    {e.proofRef}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-muted-foreground truncate max-w-[140px]">
                    {e.auditId}
                  </td>
                </tr>
              ))}

              {!loading && filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-10 text-center text-muted-foreground">
                    No executions yet. Trigger /api/execute first.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {replayLoading && (
        <div className="text-sm text-muted-foreground">Loading replay…</div>
      )}

      {selected && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-5xl bg-background border border-border rounded-2xl shadow-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold">Execution Replay</h3>
                <p className="text-sm text-muted-foreground mt-1">{selected.execution.id}</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="p-2 rounded-md hover:bg-secondary/70 transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 p-6">
              <div className="bg-card border border-border rounded-xl p-5">
                <h4 className="font-semibold mb-4">Execution</h4>
                <div className="space-y-2 text-sm">
                  <div><span className="text-muted-foreground">Goal: </span>{selected.execution.goal}</div>
                  <div><span className="text-muted-foreground">Tool: </span>{selected.execution.tool}</div>
                  <div><span className="text-muted-foreground">Decision: </span>{selected.execution.decision}</div>
                  <div><span className="text-muted-foreground">Reason: </span>{selected.execution.reason}</div>
                  <div><span className="text-muted-foreground">Status: </span>{selected.execution.status}</div>
                  <div><span className="text-muted-foreground">Audit ID: </span><span className="font-mono text-xs">{selected.execution.auditId}</span></div>
                </div>
              </div>

              <div className="bg-card border border-border rounded-xl p-5">
                <h4 className="font-semibold mb-4">Proof</h4>
                <pre className="text-xs bg-secondary/40 rounded-lg p-4 overflow-x-auto border border-border whitespace-pre-wrap break-all">
{JSON.stringify(selected.proof, null, 2)}
                </pre>
              </div>
            </div>

            <div className="px-6 pb-6">
              <div className="bg-card border border-border rounded-xl p-5">
                <h4 className="font-semibold mb-4">Ledger Trace</h4>
                <div className="space-y-3">
                  {selected.trace?.length ? (
                    selected.trace.map((t) => (
                      <div key={t.id} className="rounded-lg border border-border p-4">
                        <div className="flex items-center justify-between gap-4">
                          <div className="font-medium">{t.event_type}</div>
                          <div className="text-xs text-muted-foreground">
                            {new Date(t.created_at).toLocaleString()}
                          </div>
                        </div>
                        <pre className="mt-3 text-xs bg-secondary/30 rounded-lg p-3 overflow-x-auto border border-border whitespace-pre-wrap break-all">
{JSON.stringify(t.payload, null, 2)}
                        </pre>
                      </div>
                    ))
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      No ledger trace available for this execution.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
