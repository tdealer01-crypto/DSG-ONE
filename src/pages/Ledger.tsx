import { Download, History } from "lucide-react";

export default function Ledger() {
  const events = [
    { ts: "2026-03-24T12:45:12Z", type: "DECISION", detail: "Agent Data-Sync-Bot action ALLOWED", hash: "0x8f4a...e21b" },
    { ts: "2026-03-24T12:45:12Z", type: "PROOF", detail: "Z3 verification SAT (Safe)", hash: "0x7e3b...d10a" },
    { ts: "2026-03-24T12:44:05Z", type: "DECISION", detail: "Agent Support-Agent-1 action ALLOWED", hash: "0x9b2c...f32c" },
    { ts: "2026-03-24T12:44:05Z", type: "PROOF", detail: "Z3 verification SAT (Safe)", hash: "0x6d2a...c099" },
    { ts: "2026-03-24T12:42:30Z", type: "DECISION", detail: "Agent Infra-Scaler action STABILIZED", hash: "0x1a7d...a45d" },
    { ts: "2026-03-24T12:40:15Z", type: "DECISION", detail: "Agent Data-Sync-Bot action BLOCKED", hash: "0x2b8e...b56e" },
    { ts: "2026-03-24T12:38:50Z", type: "SYSTEM", detail: "Policy 'strict-read-only' updated by admin", hash: "0x5c19...b888" },
  ];

  const typeColors: Record<string, string> = {
    DECISION: "text-primary",
    PROOF: "text-success",
    POLICY: "text-warning",
    AGENT: "text-foreground",
    SYSTEM: "text-muted-foreground",
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Ledger / Audit</h1>
          <p className="text-muted-foreground">Immutable event timeline. Every decision, proof, and state change is recorded.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground border border-border rounded-md text-sm font-medium hover:bg-secondary/80 transition-colors">
          <Download size={16} /> Export Ledger
        </button>
      </div>

      <div className="bg-card border border-border rounded-xl p-6">
        <div className="relative pl-6 border-l border-border/50 ml-4 space-y-8">
          {events.map((e, i) => (
            <div key={i} className="relative">
              <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-background border-2 border-primary" />
              
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
                <div className="text-sm font-mono text-muted-foreground w-24 shrink-0">
                  {new Date(e.ts).toLocaleTimeString()}
                </div>
                <div className={`text-xs font-bold tracking-wider w-20 shrink-0 ${typeColors[e.type] || "text-foreground"}`}>
                  {e.type}
                </div>
                <div className="text-sm font-medium flex-1">
                  {e.detail}
                </div>
                <div className="text-xs font-mono text-muted-foreground bg-secondary/50 px-2 py-1 rounded">
                  {e.hash}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
