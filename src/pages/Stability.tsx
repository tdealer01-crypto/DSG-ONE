import { Activity, Server, Zap, AlertCircle, CheckCircle2, Clock } from "lucide-react";
import { motion } from "motion/react";

const INCIDENTS = [
  {
    id: "INC-092",
    title: "Elevated Latency in US-East",
    status: "resolved",
    time: "2 hours ago",
    duration: "14m",
  },
  {
    id: "INC-091",
    title: "Database Failover Event",
    status: "resolved",
    time: "1 day ago",
    duration: "2m",
  },
  {
    id: "INC-090",
    title: "API Rate Limit Breach (Fleet Alpha)",
    status: "resolved",
    time: "3 days ago",
    duration: "45m",
  },
];

export default function Stability() {
  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Activity className="h-8 w-8 text-teal-500" />
            System Stability
          </h1>
          <p className="text-muted-foreground mt-2">
            Real-time health, uptime, and performance metrics for the DSG ONE infrastructure.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-teal-500/10 text-teal-500 px-4 py-2 rounded-full font-medium text-sm border border-teal-500/20">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-teal-500"></span>
          </span>
          All Systems Operational
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#1c1d21] border border-[#2a2b30] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Global Uptime</h3>
            <Server className="h-5 w-5 text-teal-500" />
          </div>
          <p className="text-4xl font-bold text-white">99.999%</p>
          <p className="text-sm text-teal-500 mt-2">Trailing 90 days</p>
        </div>
        <div className="bg-[#1c1d21] border border-[#2a2b30] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Avg Latency</h3>
            <Zap className="h-5 w-5 text-amber-500" />
          </div>
          <p className="text-4xl font-bold text-white">42ms</p>
          <p className="text-sm text-muted-foreground mt-2">Global edge average</p>
        </div>
        <div className="bg-[#1c1d21] border border-[#2a2b30] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Error Rate</h3>
            <AlertCircle className="h-5 w-5 text-teal-500" />
          </div>
          <p className="text-4xl font-bold text-white">0.001%</p>
          <p className="text-sm text-muted-foreground mt-2">Requests/min</p>
        </div>
        <div className="bg-[#1c1d21] border border-[#2a2b30] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Active Nodes</h3>
            <Activity className="h-5 w-5 text-teal-500" />
          </div>
          <p className="text-4xl font-bold text-white">1,204</p>
          <p className="text-sm text-teal-500 mt-2">Across 12 regions</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[#1c1d21] border border-[#2a2b30] rounded-xl p-6 flex flex-col">
          <h2 className="text-lg font-semibold text-white mb-6">Uptime History (90 Days)</h2>
          <div className="flex-1 flex items-end gap-1">
            {/* Simulated uptime bars */}
            {Array.from({ length: 90 }).map((_, i) => {
              // Simulate a few minor drops
              const isDrop = i === 12 || i === 45 || i === 88;
              const height = isDrop ? 60 + Math.random() * 20 : 95 + Math.random() * 5;
              const color = isDrop ? 'bg-amber-500' : 'bg-teal-500';
              
              return (
                <div 
                  key={i} 
                  className={`flex-1 rounded-t-sm ${color} opacity-80 hover:opacity-100 transition-opacity cursor-pointer`}
                  style={{ height: `${height}%` }}
                  title={`Day ${90 - i} ago: ${height.toFixed(2)}% uptime`}
                />
              );
            })}
          </div>
          <div className="flex justify-between mt-4 text-xs text-muted-foreground font-mono">
            <span>90 days ago</span>
            <span>Today</span>
          </div>
        </div>

        <div className="bg-[#1c1d21] border border-[#2a2b30] rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-6">Recent Incidents</h2>
          <div className="space-y-6">
            {INCIDENTS.map((inc, idx) => (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.1 }}
                key={inc.id} 
                className="relative pl-6 border-l-2 border-[#2a2b30] pb-6 last:pb-0"
              >
                <div className="absolute -left-[9px] top-0 bg-[#1c1d21] p-1">
                  <CheckCircle2 className="h-4 w-4 text-teal-500" />
                </div>
                <div className="flex justify-between items-start mb-1">
                  <h4 className="text-sm font-medium text-white">{inc.title}</h4>
                  <span className="text-xs font-mono text-muted-foreground">{inc.id}</span>
                </div>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {inc.time}
                  </span>
                  <span>Duration: {inc.duration}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
