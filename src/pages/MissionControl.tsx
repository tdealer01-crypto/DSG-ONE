import { motion } from "motion/react";
import { Activity, Server, Shield, Zap, AlertTriangle, CheckCircle2, Clock, Target, ShieldAlert, FileCheck, History, Terminal } from "lucide-react";
import { useAgent } from "../context/AgentContext";

function MetricCard({ title, value, sub, icon, status }: { title: string, value: string | number, sub?: string, icon?: React.ReactNode, status?: "success" | "warning" | "danger" | "neutral" }) {
  const statusColors = {
    success: "text-success",
    warning: "text-warning",
    danger: "text-destructive",
    neutral: "text-muted-foreground"
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</h3>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </div>
      <div>
        <div className="text-2xl font-bold tracking-tight">{value}</div>
        {sub && <div className={`text-[10px] mt-1 font-medium ${status ? statusColors[status] : "text-muted-foreground"}`}>{sub}</div>}
      </div>
    </div>
  );
}

export default function MissionControl() {
  const { state, ledger, activeProposal } = useAgent();

  const mockDecisionStream = [
    { time: "12:45:12", agent: "Data-Sync-Bot", id: "exec_1a2b", req: "Write DB", decision: "ALLOW", hit: "-", reason: "Policy match", proof: "prf_8f4a" },
    { time: "12:45:10", agent: "Support-Agent-1", id: "exec_3c4d", req: "Send Email", decision: "ALLOW", hit: "-", reason: "Policy match", proof: "prf_9b2c" },
    { time: "12:44:55", agent: "Infra-Scaler", id: "exec_5e6f", req: "Scale Web", decision: "STABILIZE", hit: "INV-004", reason: "Quota near limit", proof: "prf_1a7d" },
    { time: "12:44:30", agent: "Data-Sync-Bot", id: "exec_7g8h", req: "Delete DB", decision: "BLOCK", hit: "INV-001", reason: "Read-only violation", proof: "prf_2b8e" },
    { time: "12:44:15", agent: "Support-Agent-2", id: "exec_9i0j", req: "Read Ticket", decision: "ALLOW", hit: "-", reason: "Policy match", proof: "prf_3c9f" },
  ];

  const realDecisionStream = ledger.map(entry => ({
    time: new Date(entry.timestamp).toLocaleTimeString(),
    agent: "Operator Console",
    id: entry.id,
    req: entry.tool || "Unknown",
    decision: entry.decision || "PENDING",
    hit: entry.decision === 'BLOCK' ? 'INV-001' : entry.decision === 'STABILIZE' ? 'INV-002' : '-',
    reason: entry.reason || entry.status,
    proof: entry.proofRef
  }));

  const decisionStream = [...realDecisionStream, ...mockDecisionStream].slice(0, 10);

  const fleetSummary = [
    { name: "Data-Sync-Bot", health: "99.9%", latency: "12ms", quota: "85%", env: "Prod", mission: "Sync CRM" },
    { name: "Support-Agent-1", health: "100%", latency: "45ms", quota: "42%", env: "Prod", mission: "Triage" },
    { name: "Infra-Scaler", health: "98.5%", latency: "110ms", quota: "92%", env: "Staging", mission: "Auto-scale" },
  ];

  const proofQueue = [
    ...ledger.slice(0, 2).map(l => ({ id: l.proofRef, type: l.tool || "Action", status: l.status === 'SUCCESS' ? 'Verified' : 'Logged' })),
    { id: "prf_8f4a", type: "Safety Invariance", status: "Verified" },
    { id: "prf_9b2c", type: "Determinism Check", status: "Verified" },
    { id: "prf_1a7d", type: "Policy Bound", status: "Verified" },
    { id: "prf_2b8e", type: "Violation Proof", status: "Logged" },
  ].slice(0, 5);

  const heatmapData = Array.from({ length: 24 }).map((_, i) => Math.random());

  const allowCount = ledger.filter(l => l.decision === 'ALLOW').length + 92;
  const totalDecisions = ledger.length + 100;
  const allowRate = Math.round((allowCount / totalDecisions) * 100);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 h-full flex flex-col">
      <div className="flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight mb-1">Mission Control</h1>
          <p className="text-sm text-muted-foreground">Real-time operational overview of the DSG ONE control plane.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-sm font-mono text-success">LIVE</span>
        </div>
      </div>

      {/* Top Row: 8 Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3 shrink-0">
        <MetricCard title="Global Stability" value="99.8" sub="Score" icon={<ShieldAlert size={14} />} status="success" />
        <MetricCard title="Active Agents" value="24" sub="Online" icon={<Server size={14} />} status="success" />
        <MetricCard title="Execs / min" value="1,402" sub="+12% trend" icon={<Activity size={14} />} status="neutral" />
        <MetricCard title="Decision Mix" value={`${allowRate}%`} sub="ALLOW rate" icon={<Target size={14} />} status="success" />
        <MetricCard title="Core Integrity" value="100%" sub="Verified" icon={<Shield size={14} />} status="success" />
        <MetricCard title="Alerts" value={ledger.filter(l => l.decision === 'STABILIZE').length + 2} sub="Requires review" icon={<AlertTriangle size={14} />} status="warning" />
        <MetricCard title="Policy Pressure" value={ledger.filter(l => l.decision === 'BLOCK').length > 0 ? "High" : "Low"} sub="Recent blocks" icon={<Zap size={14} />} status={ledger.filter(l => l.decision === 'BLOCK').length > 0 ? "danger" : "success"} />
        <MetricCard title="Capacity Usage" value="34%" sub="Of monthly quota" icon={<Clock size={14} />} status="neutral" />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0">
        
        {/* Mid-Left: Live Operations Grid */}
        <div className="lg:col-span-4 bg-card border border-border rounded-xl p-4 flex flex-col h-full relative overflow-hidden">
          <h3 className="text-sm font-semibold flex items-center gap-2 mb-4 shrink-0 uppercase tracking-wider text-muted-foreground z-10">
            <Activity size={14} className="text-primary" /> Live Operations Grid
          </h3>
          
          {activeProposal ? (
            <div className="flex-1 flex flex-col justify-center z-10 animate-in fade-in zoom-in duration-300">
              <div className="bg-background/80 backdrop-blur-md border border-primary/50 rounded-xl p-4 shadow-[0_0_30px_rgba(20,184,166,0.15)]">
                <div className="flex items-center gap-2 mb-2">
                  <Terminal size={16} className="text-primary animate-pulse" />
                  <span className="font-mono text-xs font-bold text-primary tracking-wider uppercase">Active Tool Execution</span>
                </div>
                <div className="text-lg font-semibold mb-1">{activeProposal.toolName}</div>
                <div className="text-xs font-mono text-muted-foreground bg-secondary/50 p-2 rounded mb-3 overflow-hidden text-ellipsis whitespace-nowrap">
                  {JSON.stringify(activeProposal.args)}
                </div>
                <div className="flex items-center justify-between border-t border-border/50 pt-3">
                  <div className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">Validator Decision</div>
                  <div className={`text-xs font-bold px-2 py-1 rounded ${
                    activeProposal.decision === 'ALLOW' ? 'bg-success/20 text-success' :
                    activeProposal.decision === 'STABILIZE' ? 'bg-warning/20 text-warning' :
                    'bg-destructive/20 text-destructive'
                  }`}>
                    {activeProposal.decision}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 bg-secondary/20 border border-border/50 rounded-lg relative overflow-hidden flex items-center justify-center z-10">
              {/* Simulated Node Graph */}
              <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, var(--color-border) 1px, transparent 0)', backgroundSize: '20px 20px' }} />
              <div className="relative w-full h-full p-4 flex flex-col justify-between">
                <div className="flex justify-between">
                  <div className="w-12 h-12 rounded-full border-2 border-success bg-success/10 flex items-center justify-center animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.3)]"><Server size={16} className="text-success" /></div>
                  <div className="w-12 h-12 rounded-full border-2 border-warning bg-warning/10 flex items-center justify-center shadow-[0_0_15px_rgba(234,179,8,0.3)]"><Server size={16} className="text-warning" /></div>
                </div>
                <div className="flex justify-center">
                  <div className={`w-16 h-16 rounded-full border-2 ${state !== 'IDLE' ? 'border-primary bg-primary/20 shadow-[0_0_30px_rgba(20,184,166,0.6)] animate-pulse' : 'border-primary bg-primary/10 shadow-[0_0_20px_rgba(20,184,166,0.4)]'} flex items-center justify-center transition-all duration-500`}><Shield size={24} className="text-primary" /></div>
                </div>
                <div className="flex justify-between">
                  <div className="w-12 h-12 rounded-full border-2 border-success bg-success/10 flex items-center justify-center"><Server size={16} className="text-success" /></div>
                  <div className="w-12 h-12 rounded-full border-2 border-destructive bg-destructive/10 flex items-center justify-center shadow-[0_0_15px_rgba(239,68,68,0.3)]"><Server size={16} className="text-destructive" /></div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mid-Right: Decision Stream */}
        <div className="lg:col-span-8 bg-card border border-border rounded-xl flex flex-col h-full overflow-hidden">
          <div className="p-4 border-b border-border shrink-0">
            <h3 className="text-sm font-semibold flex items-center gap-2 uppercase tracking-wider text-muted-foreground">
              <History size={14} className="text-primary" /> Decision Stream
            </h3>
          </div>
          <div className="flex-1 overflow-auto">
            <table className="w-full text-xs text-left">
              <thead className="text-[10px] text-muted-foreground uppercase bg-secondary/30 sticky top-0 backdrop-blur-md z-10">
                <tr>
                  <th className="px-4 py-2 font-medium">Time</th>
                  <th className="px-4 py-2 font-medium">Agent</th>
                  <th className="px-4 py-2 font-medium">Request</th>
                  <th className="px-4 py-2 font-medium">Decision</th>
                  <th className="px-4 py-2 font-medium">Hit</th>
                  <th className="px-4 py-2 font-medium">Reason</th>
                  <th className="px-4 py-2 font-medium">Proof</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {decisionStream.map((d, i) => (
                  <motion.tr 
                    key={d.id + i}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-secondary/20 transition-colors"
                  >
                    <td className="px-4 py-2 font-mono text-muted-foreground">{d.time}</td>
                    <td className="px-4 py-2 font-medium">{d.agent}</td>
                    <td className="px-4 py-2 truncate max-w-[150px]">{d.req}</td>
                    <td className="px-4 py-2">
                      <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider ${
                        d.decision === 'ALLOW' ? 'bg-success/10 text-success border border-success/20' : 
                        d.decision === 'STABILIZE' ? 'bg-warning/10 text-warning border border-warning/20' : 
                        'bg-destructive/10 text-destructive border border-destructive/20'
                      }`}>
                        {d.decision}
                      </span>
                    </td>
                    <td className="px-4 py-2 font-mono text-muted-foreground">{d.hit}</td>
                    <td className="px-4 py-2 truncate max-w-[120px]">{d.reason}</td>
                    <td className="px-4 py-2 font-mono text-primary">{d.proof}</td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom-Left: Invariant Heatmap */}
        <div className="lg:col-span-3 bg-card border border-border rounded-xl p-4 flex flex-col">
          <h3 className="text-sm font-semibold flex items-center gap-2 mb-4 shrink-0 uppercase tracking-wider text-muted-foreground">
            <Target size={14} className="text-primary" /> Invariant Heatmap
          </h3>
          <div className="flex-1 grid grid-cols-6 gap-1 content-start">
            {heatmapData.map((val, i) => (
              <div 
                key={i} 
                className="aspect-square rounded-sm"
                style={{ 
                  backgroundColor: val > 0.9 ? 'var(--color-destructive)' : val > 0.7 ? 'var(--color-warning)' : 'var(--color-success)',
                  opacity: val > 0.9 ? 1 : val > 0.7 ? 0.8 : 0.3
                }}
                title={`INV-${i}: Stress ${(val*100).toFixed(0)}%`}
              />
            ))}
          </div>
        </div>

        {/* Bottom-Mid: Fleet Panel */}
        <div className="lg:col-span-5 bg-card border border-border rounded-xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-border shrink-0">
            <h3 className="text-sm font-semibold flex items-center gap-2 uppercase tracking-wider text-muted-foreground">
              <Server size={14} className="text-primary" /> Fleet Panel
            </h3>
          </div>
          <div className="flex-1 overflow-auto p-4 space-y-3">
            {fleetSummary.map((a, i) => (
              <div key={i} className="flex items-center justify-between text-xs">
                <div>
                  <div className="font-medium">{a.name}</div>
                  <div className="text-muted-foreground flex gap-2">
                    <span>{a.env}</span> • <span>{a.mission}</span>
                  </div>
                </div>
                <div className="text-right flex gap-4">
                  <div>
                    <div className="text-muted-foreground">Health</div>
                    <div className="font-mono text-success">{a.health}</div>
                  </div>
                  <div>
                    <div className="text-muted-foreground">Latency</div>
                    <div className="font-mono">{a.latency}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom-Right: Proof & Ledger Queue */}
        <div className="lg:col-span-4 bg-card border border-border rounded-xl flex flex-col overflow-hidden">
          <div className="p-4 border-b border-border shrink-0">
            <h3 className="text-sm font-semibold flex items-center gap-2 uppercase tracking-wider text-muted-foreground">
              <FileCheck size={14} className="text-primary" /> Proof & Ledger Queue
            </h3>
          </div>
          <div className="flex-1 overflow-auto p-4 space-y-3">
            {proofQueue.map((p, i) => (
              <div key={i} className="flex items-center justify-between text-xs border-b border-border/50 pb-2 last:border-0">
                <div>
                  <div className="font-mono text-primary">{p.id}</div>
                  <div className="text-muted-foreground">{p.type}</div>
                </div>
                <div>
                  <span className="bg-secondary px-2 py-1 rounded font-medium">{p.status}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
