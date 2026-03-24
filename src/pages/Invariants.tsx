import { useState } from "react";
import { Shield, Plus, AlertTriangle, CheckCircle2, XCircle, Activity } from "lucide-react";
import { motion } from "motion/react";

const INVARIANTS_DATA = [
  {
    id: "INV-001",
    name: "Maximum Transaction Value",
    description: "Blocks any autonomous transaction exceeding $10,000 USD.",
    type: "Financial",
    status: "active",
    action: "BLOCK",
    lastTriggered: "2 hours ago",
    pressure: 12,
  },
  {
    id: "INV-002",
    name: "Rate Limit Enforcement",
    description: "Stabilizes agent if API calls exceed 500/min.",
    type: "Operational",
    status: "warning",
    action: "STABILIZE",
    lastTriggered: "10 mins ago",
    pressure: 85,
  },
  {
    id: "INV-003",
    name: "Prohibited Domains",
    description: "Prevents data exfiltration to unauthorized external domains.",
    type: "Security",
    status: "active",
    action: "BLOCK",
    lastTriggered: "1 day ago",
    pressure: 2,
  },
  {
    id: "INV-004",
    name: "CPU Usage Threshold",
    description: "Pauses execution if agent consumes > 90% allocated CPU.",
    type: "Resource",
    status: "active",
    action: "STABILIZE",
    lastTriggered: "Never",
    pressure: 45,
  },
];

export default function Invariants() {
  const [invariants] = useState(INVARIANTS_DATA);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <Shield className="h-8 w-8 text-teal-500" />
            Invariants & Policies
          </h1>
          <p className="text-muted-foreground mt-2">
            Define and monitor the core safety rules governing all autonomous agents.
          </p>
        </div>
        <button className="bg-teal-600 hover:bg-teal-500 text-white px-4 py-2 rounded-md flex items-center gap-2 transition-colors font-medium">
          <Plus className="h-4 w-4" />
          New Invariant
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1c1d21] border border-[#2a2b30] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Active</h3>
            <Shield className="h-5 w-5 text-teal-500" />
          </div>
          <p className="text-4xl font-bold text-white">124</p>
          <p className="text-sm text-teal-500 mt-2">+3 this week</p>
        </div>
        <div className="bg-[#1c1d21] border border-[#2a2b30] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">High Pressure</h3>
            <Activity className="h-5 w-5 text-amber-500" />
          </div>
          <p className="text-4xl font-bold text-white">12</p>
          <p className="text-sm text-amber-500 mt-2">Requires attention</p>
        </div>
        <div className="bg-[#1c1d21] border border-[#2a2b30] rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Blocks Today</h3>
            <XCircle className="h-5 w-5 text-red-500" />
          </div>
          <p className="text-4xl font-bold text-white">8,432</p>
          <p className="text-sm text-muted-foreground mt-2">Across all fleets</p>
        </div>
      </div>

      <div className="bg-[#1c1d21] border border-[#2a2b30] rounded-xl overflow-hidden">
        <div className="p-6 border-b border-[#2a2b30] flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Active Ruleset</h2>
          <div className="flex gap-2">
            <select className="bg-[#141518] border border-[#2a2b30] text-sm text-white rounded-md px-3 py-1.5 focus:outline-none focus:border-teal-500">
              <option>All Types</option>
              <option>Financial</option>
              <option>Security</option>
              <option>Operational</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#2a2b30] bg-[#141518]/50">
                <th className="p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Rule ID</th>
                <th className="p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Name & Description</th>
                <th className="p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Action</th>
                <th className="p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Status</th>
                <th className="p-4 text-xs font-medium text-muted-foreground uppercase tracking-wider">Pressure</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2a2b30]">
              {invariants.map((inv, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  key={inv.id} 
                  className="hover:bg-[#2a2b30]/30 transition-colors group cursor-pointer"
                >
                  <td className="p-4">
                    <span className="font-mono text-sm text-teal-500">{inv.id}</span>
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-white">{inv.name}</div>
                    <div className="text-sm text-muted-foreground mt-1">{inv.description}</div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-bold tracking-wider ${
                      inv.action === 'BLOCK' ? 'bg-red-500/10 text-red-500' : 
                      inv.action === 'STABILIZE' ? 'bg-amber-500/10 text-amber-500' : 
                      'bg-teal-500/10 text-teal-500'
                    }`}>
                      {inv.action}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      {inv.status === 'active' ? (
                        <CheckCircle2 className="h-4 w-4 text-teal-500" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                      )}
                      <span className="text-sm capitalize text-gray-300">{inv.status}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-full bg-[#141518] rounded-full h-2 max-w-[100px]">
                        <div 
                          className={`h-2 rounded-full ${inv.pressure > 80 ? 'bg-red-500' : inv.pressure > 40 ? 'bg-amber-500' : 'bg-teal-500'}`}
                          style={{ width: `${inv.pressure}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-mono text-muted-foreground">{inv.pressure}%</span>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
