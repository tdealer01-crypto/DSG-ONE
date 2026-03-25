import { useEffect, useMemo, useRef, useState } from "react";
import { X, Send, Loader2, Terminal, Maximize2, Minimize2 } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useAgent } from "../context/AgentContext";

type PlannerStatus = {
  ok: boolean;
  planner_mode: "ollama" | "rules";
  ollama: {
    configured: boolean;
    connected: boolean;
    base_url: string;
    model: string;
  };
};

function makeId() {
  return Math.random().toString(36).slice(2, 10);
}

function toLedgerStatus(status?: string): "PENDING" | "SUCCESS" | "FAILED" | "REJECTED" {
  if (status === "completed") return "SUCCESS";
  if (status === "failed") return "FAILED";
  if (status === "blocked" || status === "stabilized") return "REJECTED";
  return "PENDING";
}

export default function OperatorConsole() {
  const { state, setState, addLedgerEntry } = useAgent();

  const [isOpen, setIsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [input, setInput] = useState("");
  const [mode, setMode] = useState<"auto" | "manual">(() => {
    try {
      return (localStorage.getItem("dsg.console.mode") as "auto" | "manual") || "auto";
    } catch {
      return "auto";
    }
  });
  const [plannerStatus, setPlannerStatus] = useState<PlannerStatus | null>(null);
  const [statusError, setStatusError] = useState<string>("");
  const [messages, setMessages] = useState<{ role: "user" | "model" | "system"; text: string }[]>([
    {
      role: "model",
      text:
        "DSG ONE operator console online. Auto mode will use planner/auto-loop. Manual mode sends direct exec payloads.",
    },
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isOpen, isExpanded]);

  useEffect(() => {
    try {
      localStorage.setItem("dsg.console.mode", mode);
    } catch {}
  }, [mode]);

  async function refreshPlannerStatus() {
    try {
      const res = await fetch("/api/agent/status");
      const data = await res.json();
      if (res.ok) {
        setPlannerStatus(data);
        setStatusError("");
      } else {
        setStatusError(data?.error || "planner status failed");
      }
    } catch (err: any) {
      setStatusError(err?.message || "planner status failed");
    }
  }

  useEffect(() => {
    refreshPlannerStatus();
    const timer = window.setInterval(refreshPlannerStatus, 5000);
    return () => window.clearInterval(timer);
  }, []);

  const plannerBadge = useMemo(() => {
    if (!plannerStatus) return "checking...";
    if (plannerStatus.planner_mode === "ollama" && plannerStatus.ollama.connected) {
      return `ollama:${plannerStatus.ollama.model}`;
    }
    return "rules-fallback";
  }, [plannerStatus]);

  async function runManual(text: string) {
    let actionArgs: any;

    if (text.startsWith("{")) {
      const parsed = JSON.parse(text);
      actionArgs = {
        method: parsed.method,
        params: parsed.params || {},
      };
    } else {
      actionArgs = {
        command: text,
      };
    }

    const proposal = {
      request_id: makeId(),
      step_id: makeId(),
      goal: text,
      thought: "safe-console-direct-execution",
      action: {
        tool: "exec",
        arguments: actionArgs,
      },
      context: {
        source: "safe-console",
        mode: "manual",
      },
    };

    const res = await fetch("/api/execute-v2", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(proposal),
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
      proofRef: data.proof_id || "N/A",
    });

    return {
      summary: `Manual execution finished via /api/execute-v2.`,
      payload: data,
    };
  }

  async function runAuto(text: string) {
    const res = await fetch("/api/agent/auto-loop", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        goal: text,
        maxIterations: 3,
      }),
    });

    const data = await res.json();

    if (Array.isArray(data?.steps)) {
      for (const step of data.steps) {
        addLedgerEntry({
          id: step.execution_id || makeId(),
          timestamp: new Date().toISOString(),
          goal: text,
          tool: step.action?.tool || "exec",
          decision: step.decision || "ALLOW",
          reason: step.reason || data.summary || "Processed",
          result: step.result || null,
          status: toLedgerStatus(step.status),
          auditId: step.audit_id || "N/A",
          proofRef: step.proof_id || "N/A",
        });
      }
    }

    return {
      summary: data?.summary || "Auto loop finished.",
      payload: data,
    };
  }

  async function handleSend() {
    const text = input.trim();
    if (!text || state !== "IDLE") return;

    setMessages((prev) => [...prev, { role: "user", text }]);
    setInput("");
    setState("EXECUTING");

    try {
      const runner = mode === "auto" ? runAuto : runManual;
      const result = await runner(text);

      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          text:
            `Mode: **${mode.toUpperCase()}**  \nPlanner: **${plannerBadge}**  \n\n` +
            result.summary +
            `\n\n\0json\n${JSON.stringify(result.payload, null, 2)}\n\0`,
        },
      ]);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          text: "Error: " + (err?.message || "request failed"),
        },
      ]);
    } finally {
      setState("IDLE");
    }
  }

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            position: "fixed",
            right: 24,
            bottom: 24,
            width: 56,
            height: 56,
            borderRadius: 999,
            border: 0,
            background: state === "IDLE" ? "#111827" : "#2563eb",
            color: "#fff",
            boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
            zIndex: 50,
            cursor: "pointer",
          }}
        >
          {state === "IDLE" ? <Terminal size={22} style={{ marginTop: 2 }} /> : <Loader2 size={22} className="animate-spin" style={{ marginTop: 2 }} />}
        </button>
      )}

      {isOpen && (
        <div
          style={{
            position: "fixed",
            right: isExpanded ? 16 : 24,
            bottom: isExpanded ? 16 : 24,
            top: isExpanded ? 16 : undefined,
            left: isExpanded ? 16 : undefined,
            width: isExpanded ? undefined : 460,
            height: isExpanded ? undefined : 720,
            background: "#ffffff",
            border: "1px solid #e5e7eb",
            borderRadius: 20,
            boxShadow: "0 20px 60px rgba(0,0,0,0.18)",
            zIndex: 60,
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 16px",
              borderBottom: "1px solid #e5e7eb",
              background: "#f8fafc",
            }}
          >
            <div>
              <div style={{ fontWeight: 700 }}>Operator Console</div>
              <div style={{ fontSize: 12, color: "#6b7280", marginTop: 4 }}>
                Planner: {plannerBadge} {statusError ? `• ${statusError}` : ""}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setIsExpanded((v) => !v)} style={{ border: 0, background: "transparent", cursor: "pointer" }}>
                {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
              </button>
              <button onClick={() => setIsOpen(false)} style={{ border: 0, background: "transparent", cursor: "pointer" }}>
                <X size={16} />
              </button>
            </div>
          </div>

          <div style={{ padding: 12, borderBottom: "1px solid #e5e7eb", display: "flex", gap: 8, alignItems: "center", background: "#fff" }}>
            <button
              onClick={() => setMode("auto")}
              style={{
                border: 0,
                borderRadius: 999,
                padding: "8px 12px",
                background: mode === "auto" ? "#111827" : "#e5e7eb",
                color: mode === "auto" ? "#fff" : "#111827",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Auto
            </button>
            <button
              onClick={() => setMode("manual")}
              style={{
                border: 0,
                borderRadius: 999,
                padding: "8px 12px",
                background: mode === "manual" ? "#111827" : "#e5e7eb",
                color: mode === "manual" ? "#fff" : "#111827",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Manual
            </button>
            <button
              onClick={refreshPlannerStatus}
              style={{
                marginLeft: "auto",
                border: "1px solid #d1d5db",
                borderRadius: 10,
                padding: "8px 10px",
                background: "#fff",
                cursor: "pointer",
                fontWeight: 600,
              }}
            >
              Refresh status
            </button>
          </div>

          <div style={{ flex: 1, overflowY: "auto", padding: 16, background: "#fafafa" }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ display: "flex", justifyContent: msg.role === "user" ? "flex-end" : "flex-start", marginBottom: 12 }}>
                <div
                  style={{
                    maxWidth: "86%",
                    padding: "12px 14px",
                    borderRadius: 16,
                    background: msg.role === "user" ? "#111827" : msg.role === "system" ? "#fee2e2" : "#ffffff",
                    color: msg.role === "user" ? "#ffffff" : "#111827",
                    border: msg.role === "system" ? "1px solid #fca5a5" : "1px solid #e5e7eb",
                    whiteSpace: "pre-wrap",
                    overflowWrap: "anywhere",
                  }}
                >
                  <div style={{ fontSize: 14, lineHeight: 1.5 }}>
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <div style={{ padding: 16, borderTop: "1px solid #e5e7eb", background: "#fff" }}>
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 8 }}>
              {mode === "auto"
                ? "Auto mode: describe the task and planner will choose the next step automatically."
                : "Manual mode: type shell command or MCP JSON payload."}
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                placeholder={mode === "auto" ? "เช่น list files in current directory" : "เช่น ls หรือ {\"method\":\"file.read\",...}"}
                disabled={state !== "IDLE"}
                rows={3}
                style={{
                  flex: 1,
                  resize: "none",
                  borderRadius: 12,
                  border: "1px solid #d1d5db",
                  padding: 12,
                  fontSize: 14,
                  outline: "none",
                }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || state !== "IDLE"}
                style={{
                  width: 48,
                  borderRadius: 12,
                  border: 0,
                  background: !input.trim() || state !== "IDLE" ? "#cbd5e1" : "#111827",
                  color: "#fff",
                  cursor: !input.trim() || state !== "IDLE" ? "not-allowed" : "pointer",
                }}
              >
                {state === "IDLE" ? <Send size={18} style={{ marginTop: 2 }} /> : <Loader2 size={18} className="animate-spin" style={{ marginTop: 2 }} />}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
