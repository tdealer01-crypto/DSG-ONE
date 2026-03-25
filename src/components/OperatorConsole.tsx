import { useState, useRef, useEffect } from "react";
import { X, Send, Loader2, Terminal, Maximize2, Minimize2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useAgent } from "../context/AgentContext";

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

export default function OperatorConsole() {
  const {
    state,
    setState,
    addLedgerEntry
  } = useAgent();

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "model" | "system"; text: string }[]>([
    {
      role: "model",
      text:
        "DSG ONE safe console online. พิมพ์ command ตรงๆ เช่น `ls`, `pwd`, `echo hello` หรือ MCP JSON เช่น `{ \"method\": \"file.read\", \"params\": { \"file\": \"package.json\" } }`"
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen, isExpanded]);

  async function handleSend() {
    const text = input.trim();
    if (!text || state !== "IDLE") return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setState("EXECUTING");

    try {
      let actionArgs: any;

      if (text.startsWith("{")) {
        const parsed = JSON.parse(text);
        actionArgs = {
          method: parsed.method,
          params: parsed.params || {}
        };
      } else {
        actionArgs = {
          command: text
        };
      }

      const proposal = {
        request_id: makeId(),
        step_id: makeId(),
        goal: text,
        thought: "safe-console-direct-execution",
        action: {
          tool: "exec",
          arguments: actionArgs
        },
        context: {
          source: "safe-console"
        }
      };

      const res = await fetch("/api/execute-v2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(proposal)
      });

      const data = await res.json();

      addLedgerEntry({
        id: proposal.request_id,
        timestamp: new Date().toISOString(),
        goal: proposal.goal,
        tool: proposal.action.tool,
        decision:
          data.decision === "ALLOW" || data.decision === "STABILIZE" || data.decision === "BLOCK"
            ? data.decision
            : "ALLOW",
        reason: data.reason || data.error || "Processed",
        result: data.result || data,
        status: data.ok ? "SUCCESS" : "FAILED",
        auditId: data.audit_id || "N/A",
        proofRef: data.proof_id || "N/A"
      });

      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text: "```json\n" + JSON.stringify(data, null, 2) + "\n```"
        }
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          text: "Error: " + (err?.message || "request failed")
        }
      ]);
    } finally {
      setState("IDLE");
    }
  }

  const getStatusColor = () => {
    return state === "IDLE" ? "bg-primary" : "bg-blue-500";
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className={`fixed bottom-6 right-6 w-14 h-14 ${getStatusColor()} text-white rounded-full shadow-lg flex items-center justify-center hover:opacity-90 transition-all hover:scale-105 z-50`}
        >
          {state === "IDLE" ? <Terminal size={24} /> : <Loader2 size={24} className="animate-spin" />}
        </button>
      )}

      {isOpen && (
        <div
          className={`fixed ${
            isExpanded ? "inset-4 md:inset-10" : "bottom-6 right-6 w-[420px] h-[700px]"
          } bg-card border border-border rounded-2xl shadow-2xl flex flex-col z-50 transition-all duration-300 overflow-hidden`}
        >
          <div className="h-14 bg-secondary/50 border-b border-border flex items-center justify-between px-4 shrink-0">
            <div className="flex items-center gap-2 font-semibold">
              <div className={`w-2 h-2 rounded-full ${getStatusColor()} ${state !== "IDLE" ? "animate-pulse" : ""}`} />
              Operator Console
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <button onClick={() => setIsExpanded(!isExpanded)} className="p-1.5 hover:bg-secondary rounded-md transition-colors">
                {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
              <button onClick={() => setIsOpen(false)} className="p-1.5 hover:bg-secondary rounded-md transition-colors">
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-tr-sm"
                      : msg.role === "system"
                      ? "bg-destructive/20 text-destructive border border-destructive/30 rounded-tl-sm"
                      : "bg-secondary text-secondary-foreground rounded-tl-sm"
                  }`}
                >
                  <div className="text-sm prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-border bg-background shrink-0">
            <div className="relative flex items-center">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder='พิมพ์ command หรือ MCP JSON'
                disabled={state !== "IDLE"}
                className="w-full pl-4 pr-14 py-3 bg-secondary/30 border border-border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none h-[52px] disabled:opacity-50"
                rows={1}
              />
              <div className="absolute right-2 flex items-center gap-1">
                <button
                  onClick={handleSend}
                  disabled={!input.trim() || state !== "IDLE"}
                  className="p-2 bg-primary text-primary-foreground rounded-lg disabled:opacity-50 hover:bg-primary/90 transition-colors"
                >
                  <Send size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
