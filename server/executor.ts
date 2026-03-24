export type ExecAction = {
  tool: string;
  arguments?: Record<string, any>;
};

export type ExecResult = {
  ok: boolean;
  output?: string;
  error?: string;
  duration_ms: number;
  tool: string;
};

const MCP_URL = process.env.MCP_URL || "http://localhost:5000/mcp/rpc";

export async function executeAction(action: ExecAction): Promise<ExecResult> {
  const started = Date.now();

  if (action.tool !== "exec") {
    return {
      ok: false,
      error: `Unsupported tool: ${action.tool}`,
      duration_ms: Date.now() - started,
      tool: action.tool,
    };
  }

  const command = action.arguments?.command;
  if (!command) {
    return {
      ok: false,
      error: "Missing command",
      duration_ms: Date.now() - started,
      tool: action.tool,
    };
  }

  try {
    const res = await fetch(MCP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ params: { command } }),
    });

    const data: any = await res.json();
    const output = data?.result?.content?.[0]?.text ?? JSON.stringify(data);

    return {
      ok: true,
      output,
      duration_ms: Date.now() - started,
      tool: action.tool,
    };
  } catch (err: any) {
    return {
      ok: false,
      error: err?.message || "Execution failed",
      duration_ms: Date.now() - started,
      tool: action.tool,
    };
  }
}
