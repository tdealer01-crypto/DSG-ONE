import { useState } from "react";
import { Filter, Search } from "lucide-react";

export default function Executions() {
  const [activeFilter, setActiveFilter] = useState("ALL");
  const filters = ["ALL", "ALLOW", "BLOCK", "STABILIZE"];

  const executions = [
    { id: "exec_1a2b", agent: "Data-Sync-Bot", action: "Write to DB", result: "ALLOW", reason: "Policy match: strict-read-only", latency: "12ms", proofRef: "prf_8f4a", auditRef: "0x8f4a...e21b" },
    { id: "exec_3c4d", agent: "Support-Agent-1", action: "Send Email", result: "ALLOW", reason: "Policy match: email-reply-only", latency: "45ms", proofRef: "prf_9b2c", auditRef: "0x9b2c...f32c" },
    { id: "exec_5e6f", agent: "Infra-Scaler", action: "Scale Up Web", result: "STABILIZE", reason: "Approaching quota limit (90%)", latency: "110ms", proofRef: "prf_1a7d", auditRef: "0x1a7d...a45d" },
    { id: "exec_7g8h", agent: "Data-Sync-Bot", action: "Delete Records", result: "BLOCK", reason: "Violation: strict-read-only", latency: "8ms", proofRef: "prf_2b8e", auditRef: "0x2b8e...b56e" },
    { id: "exec_9i0j", agent: "Support-Agent-2", action: "Read Ticket", result: "ALLOW", reason: "Policy match: email-reply-only", latency: "22ms", proofRef: "prf_3c9f", auditRef: "0x3c9f...c67f" },
  ];

  const filtered = activeFilter === "ALL" ? executions : executions.filter(e => e.result === activeFilter);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Operations Log</h1>
        <p className="text-muted-foreground">Traceable execution log with decision reasoning and proof references.</p>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center gap-2 bg-secondary/50 p-1 rounded-lg border border-border">
          {filters.map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`px-4 py-1.5 rounded-md text-xs font-medium transition-colors ${activeFilter === f ? "bg-background text-foreground shadow-sm border border-border/50" : "text-muted-foreground hover:text-foreground"}`}
            >
              {f}
            </button>
          ))}
        </div>
        
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search operations..." 
            className="w-full pl-9 pr-4 py-2 bg-background border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-secondary/30 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">ID</th>
                <th className="px-6 py-4 font-medium">Agent</th>
                <th className="px-6 py-4 font-medium">Action</th>
                <th className="px-6 py-4 font-medium">Decision</th>
                <th className="px-6 py-4 font-medium">Reason</th>
                <th className="px-6 py-4 font-medium">Latency</th>
                <th className="px-6 py-4 font-medium">Proof Ref</th>
                <th className="px-6 py-4 font-medium">Audit Ref</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((e, i) => (
                <tr key={i} className="hover:bg-secondary/10 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs">{e.id}</td>
                  <td className="px-6 py-4 font-medium">{e.agent}</td>
                  <td className="px-6 py-4">{e.action}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider ${
                      e.result === 'ALLOW' ? 'bg-success/10 text-success border border-success/20' : 
                      e.result === 'STABILIZE' ? 'bg-warning/10 text-warning border border-warning/20' : 
                      'bg-destructive/10 text-destructive border border-destructive/20'
                    }`}>
                      {e.result}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-muted-foreground truncate max-w-[200px]">{e.reason}</td>
                  <td className="px-6 py-4 font-mono text-xs">{e.latency}</td>
                  <td className="px-6 py-4 font-mono text-xs text-primary hover:underline cursor-pointer">{e.proofRef}</td>
                  <td className="px-6 py-4 font-mono text-xs text-muted-foreground truncate max-w-[120px]">{e.auditRef}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
