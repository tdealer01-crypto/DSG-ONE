import { Download, History, Terminal, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { useAgent } from "../context/AgentContext";

export default function Ledger() {
  const { ledger } = useAgent();

  const mockEvents = [
    { id: 'm1', ts: "2026-03-24T12:45:12Z", type: "DECISION", detail: "Agent Data-Sync-Bot action ALLOWED", hash: "0x8f4a...e21b", status: 'SUCCESS' },
    { id: 'm2', ts: "2026-03-24T12:45:12Z", type: "PROOF", detail: "Z3 verification SAT (Safe)", hash: "0x7e3b...d10a", status: 'SUCCESS' },
    { id: 'm3', ts: "2026-03-24T12:44:05Z", type: "DECISION", detail: "Agent Support-Agent-1 action ALLOWED", hash: "0x9b2c...f32c", status: 'SUCCESS' },
    { id: 'm4', ts: "2026-03-24T12:42:30Z", type: "DECISION", detail: "Agent Infra-Scaler action STABILIZED", hash: "0x1a7d...a45d", status: 'SUCCESS' },
    { id: 'm5', ts: "2026-03-24T12:40:15Z", type: "DECISION", detail: "Agent Data-Sync-Bot action BLOCKED", hash: "0x2b8e...b56e", status: 'REJECTED' },
  ];

  const realEvents = ledger.map(entry => ({
    id: entry.id,
    ts: entry.timestamp,
    type: "ACTION",
    detail: `[${entry.tool}] ${entry.goal}`,
    hash: entry.auditId,
    status: entry.status,
    decision: entry.decision,
    reason: entry.reason,
    result: entry.result
  }));

  const allEvents = [...realEvents, ...mockEvents].sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime());

  const getStatusIcon = (status: string, decision?: string) => {
    if (status === 'SUCCESS' && decision !== 'BLOCK') return <CheckCircle2 size={16} className="text-emerald-500" />;
    if (status === 'FAILED') return <XCircle size={16} className="text-destructive" />;
    if (status === 'REJECTED' || decision === 'BLOCK') return <XCircle size={16} className="text-destructive" />;
    if (decision === 'STABILIZE') return <AlertTriangle size={16} className="text-amber-500" />;
    return <Terminal size={16} className="text-muted-foreground" />;
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
          {allEvents.map((e) => (
            <div key={e.id} className="relative">
              <div className="absolute -left-[31px] top-1.5 w-3 h-3 rounded-full bg-background border-2 border-primary" />
              
              <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6">
                <div className="text-sm font-mono text-muted-foreground w-24 shrink-0 pt-1">
                  {new Date(e.ts).toLocaleTimeString()}
                </div>
                
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    {getStatusIcon(e.status, e.decision)}
                    <span className="text-xs font-bold tracking-wider text-primary">{e.type}</span>
                    <span className="text-sm font-medium">{e.detail}</span>
                    <span className="text-xs font-mono text-muted-foreground bg-secondary/50 px-2 py-1 rounded ml-auto">
                      {e.hash}
                    </span>
                  </div>
                  
                  {e.decision && (
                    <div className="ml-7 text-sm text-muted-foreground">
                      <span className="font-semibold">Validator:</span> {e.decision} - {e.reason}
                    </div>
                  )}
                  
                  {e.result && (
                    <div className="ml-7 mt-2 bg-secondary/30 rounded-md p-3 font-mono text-xs overflow-x-auto border border-border/50">
                      {JSON.stringify(e.result, null, 2)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          
          {allEvents.length === 0 && (
            <div className="text-center text-muted-foreground py-8">
              No events recorded yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
