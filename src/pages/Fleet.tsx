import { Server, Plus, Shield, Clock, Key, Activity, MapPin, Loader2, Settings2, Cpu, Network } from "lucide-react";
import { useState } from "react";
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from "react-markdown";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export default function Fleet() {
  const [mapData, setMapData] = useState<string | null>(null);
  const [isLoadingMap, setIsLoadingMap] = useState(false);

  const agents = [
    { 
      name: "Data-Sync-Bot", 
      env: "Production", 
      policy: "strict-read-only", 
      lastActive: "2 mins ago", 
      quota: "10,000/mo", 
      apiKey: "sk-dsg-***8f4a", 
      recentActions: ["Read DB", "Sync API"],
      plannerProvider: "DSG Default (Gemini)",
      runtimeProvider: "DSG Managed Runtime",
      fallbackProvider: "OpenAI (GPT-4o)",
      executionPolicy: "Guarded",
      approvalPolicy: "Auto-approve Read-only"
    },
    { 
      name: "Support-Agent-1", 
      env: "Production", 
      policy: "email-reply-only", 
      lastActive: "Just now", 
      quota: "5,000/mo", 
      apiKey: "sk-dsg-***9b2c", 
      recentActions: ["Read Ticket", "Send Email"],
      plannerProvider: "Anthropic (Claude 3.5 Sonnet)",
      runtimeProvider: "Custom Agent Endpoint",
      fallbackProvider: "None",
      executionPolicy: "Approval Required",
      approvalPolicy: "Human-in-the-loop for Emails"
    },
    { 
      name: "Infra-Scaler", 
      env: "Staging", 
      policy: "scale-up-only", 
      lastActive: "1 hour ago", 
      quota: "1,000/mo", 
      apiKey: "sk-dsg-***1a7d", 
      recentActions: ["Check Load", "Scale Web"],
      plannerProvider: "Ollama (Llama 3)",
      runtimeProvider: "Local Docker Runtime",
      fallbackProvider: "DSG Default (Gemini)",
      executionPolicy: "Sandbox",
      approvalPolicy: "Auto-approve Staging"
    },
  ];

  const locateAgents = async () => {
    setIsLoadingMap(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: "Locate the nearest Google Cloud data centers where our autonomous agents might be hosted, specifically looking for regions in US East, Europe West, and Asia East. Provide a brief summary of the locations.",
        config: {
          tools: [{ googleMaps: {} }]
        }
      });
      
      let output = response.text || "No location data found.";
      
      // Append map links if available
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
      if (chunks && chunks.length > 0) {
        output += "\n\n### Map Locations:\n";
        chunks.forEach(chunk => {
          if (chunk.web?.uri) {
            output += `- [${chunk.web.title}](${chunk.web.uri})\n`;
          }
        });
      }
      
      setMapData(output);
    } catch (error) {
      console.error("Error locating agents:", error);
      setMapData("Error fetching location data.");
    } finally {
      setIsLoadingMap(false);
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Fleet / Agents</h1>
          <p className="text-muted-foreground">Manage and monitor your autonomous agent fleet and provider bindings.</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={locateAgents}
            disabled={isLoadingMap}
            className="flex items-center gap-2 px-4 py-2 bg-secondary text-secondary-foreground rounded-md text-sm font-medium hover:bg-secondary/80 transition-colors disabled:opacity-50"
          >
            {isLoadingMap ? <Loader2 size={16} className="animate-spin" /> : <MapPin size={16} />} 
            Locate Regions
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 transition-colors">
            <Plus size={16} /> Register Agent
          </button>
        </div>
      </div>

      {mapData && (
        <div className="bg-card border border-border rounded-xl p-6 mb-8">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MapPin size={20} className="text-primary" /> Agent Hosting Regions
          </h3>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown>{mapData}</ReactMarkdown>
          </div>
        </div>
      )}

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
                    <div className="text-xs font-mono text-muted-foreground bg-secondary/50 px-2 py-0.5 rounded inline-block">{agent.env}</div>
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
                  <span className="font-mono text-xs bg-secondary px-2 py-1 rounded truncate max-w-[150px]" title={agent.approvalPolicy}>{agent.approvalPolicy}</span>
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
              <div className="flex gap-2">
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
