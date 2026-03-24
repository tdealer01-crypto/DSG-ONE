import { useState } from "react";
import { Save, ShieldAlert, Server, Key, Activity, CheckCircle2, XCircle, Eye, EyeOff, Plus, Trash2, Edit2, Play, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

type ProviderMode = "default" | "api" | "agent";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("providers");
  
  const tabs = [
    { id: "general", label: "General" },
    { id: "security", label: "Security" },
    { id: "providers", label: "Providers" },
    { id: "agents", label: "Agents" },
    { id: "execution", label: "Execution" },
    { id: "approvals", label: "Approvals" },
    { id: "integrations", label: "Integrations" },
  ];

  return (
    <div className="flex h-full gap-6 animate-in fade-in duration-500">
      {/* Settings Sidebar */}
      <div className="w-64 shrink-0">
        <h1 className="text-2xl font-bold tracking-tight mb-6">Settings</h1>
        <nav className="space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                activeTab === tab.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Settings Content */}
      <div className="flex-1 overflow-y-auto pb-12 pr-4">
        {activeTab === "providers" ? <ProvidersSettings /> : (
          <div className="flex items-center justify-center h-64 text-muted-foreground border border-dashed border-border rounded-xl">
            {tabs.find(t => t.id === activeTab)?.label} settings coming soon.
          </div>
        )}
      </div>
    </div>
  );
}

function ProvidersSettings() {
  const [mode, setMode] = useState<ProviderMode>("api");
  const [showKey, setShowKey] = useState(false);
  const [testStatus, setTestStatus] = useState<"idle" | "testing" | "success" | "error">("idle");

  const toolClasses = [
    "Browser Read", "Browser Write", "Shell Read", "Shell Write", 
    "File Read", "File Write", "Email Draft", "Email Send", 
    "Social Draft", "Social Publish", "Cloud Read", "Cloud Change"
  ];

  const mockProviders = [
    { id: "1", name: "OpenAI Production", type: "OpenAI-compatible", status: "connected", active: true, mode: "API", lastChecked: "2 mins ago", defaultModel: "gpt-4o" },
    { id: "2", name: "Local Ollama GPU", type: "Ollama", status: "connected", active: false, mode: "API", lastChecked: "1 hour ago", defaultModel: "qwen2.5:7b" },
    { id: "3", name: "Internal Planner", type: "Custom Agent", status: "disconnected", active: false, mode: "Agent", lastChecked: "1 day ago", defaultModel: "-" },
  ];

  const handleTestConnection = () => {
    setTestStatus("testing");
    setTimeout(() => {
      setTestStatus("success");
      setTimeout(() => setTestStatus("idle"), 3000);
    }, 1500);
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight mb-2">Bring Your Own Model, Agent, or API</h2>
        <p className="text-muted-foreground leading-relaxed">
          Connect the AI stack you already use — Ollama, Gemini, Claude, Grok, OpenClaw, or your own endpoint — while DSG continues to validate, govern, and audit every real-world action.
        </p>
      </div>

      {/* Safety Boundary Notice */}
      <div className="bg-primary/10 border border-primary/20 rounded-xl p-4 flex gap-4 items-start">
        <ShieldAlert className="text-primary shrink-0 mt-0.5" size={20} />
        <div>
          <h4 className="font-semibold text-primary mb-1">Safety Boundary Notice</h4>
          <p className="text-sm text-primary/80">
            Connected providers can generate proposals, but cannot execute real-world actions directly. All actions still pass through DSG validation, approval policy, and execution controls.
          </p>
        </div>
      </div>

      {/* Provider Mode Selection */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">1. Provider Mode</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => setMode("default")}
            className={`p-4 rounded-xl border text-left transition-all ${mode === "default" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border bg-card hover:border-primary/50"}`}
          >
            <div className="font-semibold mb-1 flex items-center justify-between">
              Default Free Mode
              {mode === "default" && <CheckCircle2 size={16} className="text-primary" />}
            </div>
            <p className="text-xs text-muted-foreground">Use the built-in runtime and models. Best for testing, demos, and local-first tasks.</p>
          </button>
          
          <button 
            onClick={() => setMode("api")}
            className={`p-4 rounded-xl border text-left transition-all ${mode === "api" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border bg-card hover:border-primary/50"}`}
          >
            <div className="font-semibold mb-1 flex items-center justify-between">
              Bring Your Own API
              {mode === "api" && <CheckCircle2 size={16} className="text-primary" />}
            </div>
            <p className="text-xs text-muted-foreground">Connect your own model endpoint (OpenAI, Anthropic, Gemini, Ollama) and manage costs.</p>
          </button>

          <button 
            onClick={() => setMode("agent")}
            className={`p-4 rounded-xl border text-left transition-all ${mode === "agent" ? "border-primary bg-primary/5 ring-1 ring-primary" : "border-border bg-card hover:border-primary/50"}`}
          >
            <div className="font-semibold mb-1 flex items-center justify-between">
              Bring Your Own Agent
              {mode === "agent" && <CheckCircle2 size={16} className="text-primary" />}
            </div>
            <p className="text-xs text-muted-foreground">Connect your existing agent runtime. DSG acts as the control plane and validator.</p>
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {mode !== "default" && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-8"
          >
            {/* Connection Details Form */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Server size={18} className="text-primary" />
                {mode === "api" ? "API Connection Details" : "Agent Connection Details"}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">{mode === "api" ? "Provider Name" : "Agent Name"}</label>
                  <input type="text" placeholder={mode === "api" ? "e.g., OpenAI Production" : "e.g., OpenClaw Runtime"} className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50" />
                </div>
                
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">{mode === "api" ? "Provider Type" : "Auth Type"}</label>
                  <select className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50">
                    {mode === "api" ? (
                      <>
                        <option>OpenAI-compatible</option>
                        <option>Anthropic</option>
                        <option>Gemini</option>
                        <option>xAI / Grok</option>
                        <option>Ollama</option>
                        <option>OpenRouter</option>
                        <option>Custom Model Endpoint</option>
                      </>
                    ) : (
                      <>
                        <option>None</option>
                        <option>Bearer Token</option>
                        <option>API Key Header</option>
                        <option>Custom Header</option>
                      </>
                    )}
                  </select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">{mode === "api" ? "Base URL" : "Agent Endpoint"}</label>
                  <input type="text" placeholder={mode === "api" ? "https://api.openai.com/v1" : "http://localhost:8080/propose"} className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-sm" />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium text-muted-foreground">{mode === "api" ? "API Key" : "Secret / Token"}</label>
                  <div className="relative">
                    <input type={showKey ? "text" : "password"} placeholder="sk-..." className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-sm pr-10" />
                    <button type="button" onClick={() => setShowKey(!showKey)} className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground">
                      {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {mode === "api" && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Default Model</label>
                      <input type="text" placeholder="e.g., gpt-4o" className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-sm" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Organization / Project ID (Optional)</label>
                      <input type="text" placeholder="org-..." className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-sm" />
                    </div>
                  </>
                )}

                {mode === "agent" && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Proposal Format</label>
                      <select className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50">
                        <option>DSG Proposal v1</option>
                        <option>OpenAI-style tool plan</option>
                        <option>Custom JSON</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-muted-foreground">Health Check URL (Optional)</label>
                      <input type="text" placeholder="http://localhost:8080/health" className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50 font-mono text-sm" />
                    </div>
                  </>
                )}
              </div>

              {/* Toggles */}
              <div className="pt-6 border-t border-border grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mode === "api" ? (
                  <>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-border text-primary focus:ring-primary/50 bg-background" />
                      <span className="text-sm font-medium">Enable as Active Planner</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded border-border text-primary focus:ring-primary/50 bg-background" />
                      <span className="text-sm font-medium">Enable as Fallback Provider</span>
                    </label>
                  </>
                ) : (
                  <>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-border text-primary focus:ring-primary/50 bg-background" />
                      <span className="text-sm font-medium">Supports Replan</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-border text-primary focus:ring-primary/50 bg-background" />
                      <span className="text-sm font-medium">Supports Revise Hint</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-border text-primary focus:ring-primary/50 bg-background" />
                      <span className="text-sm font-medium">Supports Streaming</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-border text-primary focus:ring-primary/50 bg-background" />
                      <span className="text-sm font-medium">Enable as Active Agent Runtime</span>
                    </label>
                  </>
                )}
              </div>

              {/* Test Connection */}
              <div className="pt-6 border-t border-border flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={handleTestConnection}
                    disabled={testStatus === "testing"}
                    className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground border border-border rounded-md text-sm font-medium hover:bg-secondary/80 transition-colors disabled:opacity-50"
                  >
                    {testStatus === "testing" ? <Activity size={16} className="animate-pulse" /> : <Play size={16} />}
                    Test Connection
                  </button>
                  {testStatus === "success" && <span className="text-sm text-success flex items-center gap-1"><CheckCircle2 size={14} /> Connected successfully</span>}
                  {testStatus === "error" && <span className="text-sm text-destructive flex items-center gap-1"><XCircle size={14} /> Connection failed</span>}
                </div>
              </div>
            </div>

            {/* Approval Policy Mapping */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <ShieldAlert size={18} className="text-primary" />
                Approval Policy Mapping
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-muted-foreground">Execution Policy</label>
                    <select className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50">
                      <option>Guarded (Default)</option>
                      <option>Read-only</option>
                      <option>Sandbox</option>
                      <option>Approval Required (All)</option>
                      <option>Block External Actions</option>
                    </select>
                  </div>
                  
                  <div className="space-y-3 pt-2">
                    <label className="text-sm font-medium text-muted-foreground">Risk Controls</label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-border text-primary focus:ring-primary/50 bg-background" />
                      <span className="text-sm">High-Risk Actions Require Confirmation</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-border text-primary focus:ring-primary/50 bg-background" />
                      <span className="text-sm">Publish Actions Require Confirmation</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-border text-primary focus:ring-primary/50 bg-background" />
                      <span className="text-sm">External Messaging Requires Confirmation</span>
                    </label>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-muted-foreground">Allowed Tool Classes</label>
                  <div className="grid grid-cols-2 gap-2 bg-secondary/20 p-4 rounded-lg border border-border/50">
                    {toolClasses.map(tc => (
                      <label key={tc} className="flex items-center gap-2 cursor-pointer">
                        <input type="checkbox" defaultChecked={!tc.includes("Write") && !tc.includes("Publish") && !tc.includes("Send")} className="w-3.5 h-3.5 rounded border-border text-primary focus:ring-primary/50 bg-background" />
                        <span className="text-xs">{tc}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Runtime Behavior */}
            <div className="bg-card border border-border rounded-xl p-6 space-y-6">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Activity size={18} className="text-primary" />
                Runtime Behavior
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Planning Mode</label>
                  <select className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50">
                    <option>Iterative Replan</option>
                    <option>Single-step</option>
                    <option>Autonomous Guarded</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Failure Behavior</label>
                  <select className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50">
                    <option>Ask operator</option>
                    <option>Stop on validation reject</option>
                    <option>Replan automatically</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Revise Behavior</label>
                  <select className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50">
                    <option>Auto-adjust from hint</option>
                    <option>Ask operator before replanning</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-muted-foreground">Fallback Strategy</label>
                  <select className="w-full px-3 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary/50">
                    <option>Stop and ask user</option>
                    <option>Retry same provider</option>
                    <option>Switch to fallback model</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm font-medium hover:bg-secondary/80 transition-colors">
                Cancel
              </button>
              <button className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
                <Save size={16} /> Save Provider
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Provider List Table */}
      <div className="bg-card border border-border rounded-xl flex flex-col overflow-hidden mt-12">
        <div className="p-4 border-b border-border flex justify-between items-center bg-secondary/10">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Connected Providers</h3>
          <button className="flex items-center gap-1 text-xs font-medium text-primary hover:text-primary/80 transition-colors">
            <Plus size={14} /> Add New
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-secondary/30">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Type</th>
                <th className="px-4 py-3 font-medium">Mode</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Default Model</th>
                <th className="px-4 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {mockProviders.map((p) => (
                <tr key={p.id} className="hover:bg-secondary/10 transition-colors">
                  <td className="px-4 py-3 font-medium flex items-center gap-2">
                    {p.name}
                    {p.active && <span className="px-1.5 py-0.5 rounded text-[9px] font-bold tracking-wider bg-primary/20 text-primary border border-primary/30">ACTIVE</span>}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{p.type}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded text-xs font-medium bg-secondary text-secondary-foreground border border-border">
                      {p.mode}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${p.status === 'connected' ? 'bg-success' : 'bg-muted-foreground'}`} />
                      <span className="text-xs capitalize text-muted-foreground">{p.status}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{p.defaultModel}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-1.5 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded transition-colors" title="Test Connection">
                        <Play size={14} />
                      </button>
                      <button className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors" title="Edit">
                        <Edit2 size={14} />
                      </button>
                      <button className="p-1.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded transition-colors" title="Delete">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
