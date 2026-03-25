import { Server, Shield, Cpu, Network, Settings2 } from "lucide-react";

export default function Fleet() {
  const agents = [
    {
      name: "DSG Runtime",
      env: "Production",
      plannerProvider: "Safe Mode",
      runtimeProvider: "Local MCP",
      fallbackProvider: "None",
      executionPolicy: "Guarded",
      approvalPolicy: "Decision + Proof + Ledger",
      lastActive: "Live",
      quota: "N/A",
      recentActions: ["exec", "file.read", "system.exec"]
    },
    {
      name: "MCP Browser/File/System",
      env: "Production",
      plannerProvider: "Direct Console",
      runtimeProvider: "MCP Server",
      fallbackProvider: "None",
      executionPolicy: "Allowlist",
      approvalPolicy: "STABILIZE for risky actions",
      lastActive: "Live",
      quota: "N/A",
      recentActions: ["browser.open", "file.read", "file.write"]
    }
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Fleet / Agents</h1>
        <p className="text-muted-foreground">
          Safe mode runtime is active. Gemini is disabled. MCP browser/file/system is wired and ready.
        </p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {agents.map((agent, i) => (
          <div key={i} className="bg-card border border-border rounded-xl p-6 flex flex-col hover:border-primary/50 transition-colors">
            <div className="flex justify-between items-start mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-secondary-foreground">
                  <Server size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">{agent.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="text-xs font-mono text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded inline-block">
                      {agent.env}
                    </div>
                    <div className="flex items-center gap-1 text-xs text-success">
                      <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                      Online
                    </div>
                  </div>
                </div>
              </div>
              <button className="p-2 hover:bg-secondary rounded-md text-muted-foreground hover:text-foreground transition-colors">
                <Settings2 size={18} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1">
              <div className="space-y-4">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Provider Bindings</h4>

                <div className="flex items-start gap-3 text-sm">
                  <Cpu size={16} className="text-muted-foreground mt-0.5" />
                  <div>
                    <span className="text-muted-foreground block text-xs">Planner Provider</span>
                    <span className="font-medium">{agent.plannerProvider}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-sm">
                  <Network size={16} className="text-muted-foreground mt-0.5" />
                  <div>
                    <span className="text-muted-foreground block text-xs">Runtime Provider</span>
                    <span className="font-medium">{agent.runtimeProvider}</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-sm">
                  <Shield size={16} className="text-muted-foreground mt-0.5" />
                  <div>
                    <span className="text-muted-foreground block text-xs">Fallback Provider</span>
                    <span className="font-medium">{agent.fallbackProvider}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Governance & Stats</h4>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Execution Policy:</span>
                  <span className="font-mono text-xs bg-secondary px-2 py-1 rounded">{agent.executionPolicy}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Approval Policy:</span>
                  <span className="font-mono text-xs bg-secondary px-2 py-1 rounded">{agent.approvalPolicy}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Last Active:</span>
                  <span>{agent.lastActive}</span>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Quota:</span>
                  <span>{agent.quota}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-border">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Recent Activity</h4>
              <div className="flex gap-2 flex-wrap">
                {agent.recentActions.map((a, j) => (
                  <span key={j} className="text-xs bg-secondary/50 text-secondary-foreground px-2 py-1 rounded-md border border-border/50">
                    {a}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
