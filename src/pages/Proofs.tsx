import { FileCheck, Shield, Zap, Download } from "lucide-react";

export default function Proofs() {
  const proofCards = [
    { title: "Determinism", desc: "Gate decisions are pure functions of current and proposed state.", solver: "Z3 v4.12", artifact: "smt-lib-v2", lastVerified: "2 mins ago" },
    { title: "Safety Invariance", desc: "Forbidden states are provably unreachable from valid states.", solver: "Z3 v4.12", artifact: "smt-lib-v2", lastVerified: "2 mins ago" },
    { title: "Constant-Time Bound", desc: "Transition logic is structurally O(1), independent of history.", solver: "Z3 v4.12", artifact: "smt-lib-v2", lastVerified: "2 mins ago" },
  ];

  const recentProofs = [
    { id: "prf_8f4a", type: "Safety Invariance", solver: "Z3 v4.12", duration: "45ms", ts: "2026-03-24 12:45:12 UTC" },
    { id: "prf_9b2c", type: "Determinism Check", solver: "Z3 v4.12", duration: "32ms", ts: "2026-03-24 12:44:05 UTC" },
    { id: "prf_1a7d", type: "Policy Bound", solver: "Z3 v4.12", duration: "18ms", ts: "2026-03-24 12:42:30 UTC" },
    { id: "prf_2b8e", type: "Safety Invariance", solver: "Z3 v4.12", duration: "51ms", ts: "2026-03-24 12:40:15 UTC" },
    { id: "prf_3c9f", type: "Determinism Check", solver: "Z3 v4.12", duration: "29ms", ts: "2026-03-24 12:38:50 UTC" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Proofs</h1>
          <p className="text-muted-foreground">Deterministic verification status and formal evidence artifacts.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground border border-border rounded-md text-sm font-medium hover:bg-secondary/80 transition-colors">
          <Download size={16} /> Download Artifacts
        </button>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 flex gap-4 items-start">
        <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center text-primary shrink-0">
          <Shield size={20} />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2 text-primary">Formally Verified System</h3>
          <p className="text-muted-foreground leading-relaxed">
            Every decision made by DSG ONE is formally verified using the Z3 SMT solver. Proofs guarantee determinism
            (identical inputs → identical outputs), safety invariance (no policy violations), and constant-time execution
            (no timing side-channels). Proof artifacts are generated in SMT-LIB v2 format and committed to the immutable ledger.
          </p>
          <div className="mt-4 text-sm font-medium text-primary flex items-center gap-2">
            <FileCheck size={16} /> Author: Thanawat Suparongsuwan | License: Apache License 2.0
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {proofCards.map((p, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-6 hover:border-primary/50 transition-colors">
            <h3 className="font-bold text-lg mb-3">{p.title}</h3>
            <p className="text-sm text-muted-foreground mb-6 h-10">{p.desc}</p>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Solver:</span>
                <span className="font-mono text-xs bg-secondary px-2 py-0.5 rounded">{p.solver}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Artifact:</span>
                <span className="font-mono text-xs bg-secondary px-2 py-0.5 rounded">{p.artifact}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Last verified:</span>
                <span>{p.lastVerified}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-border bg-secondary/20">
          <h3 className="font-semibold">Recent Proof Activity</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-secondary/10 border-b border-border">
              <tr>
                <th className="px-6 py-4 font-medium">ID</th>
                <th className="px-6 py-4 font-medium">Type</th>
                <th className="px-6 py-4 font-medium">Solver</th>
                <th className="px-6 py-4 font-medium">Duration</th>
                <th className="px-6 py-4 font-medium">Time (UTC)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentProofs.map((p, i) => (
                <tr key={i} className="hover:bg-secondary/10 transition-colors">
                  <td className="px-6 py-4 font-mono text-xs text-primary">{p.id}</td>
                  <td className="px-6 py-4 font-medium">{p.type}</td>
                  <td className="px-6 py-4 font-mono text-xs">{p.solver}</td>
                  <td className="px-6 py-4 font-mono text-xs">{p.duration}</td>
                  <td className="px-6 py-4 text-muted-foreground">{p.ts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
