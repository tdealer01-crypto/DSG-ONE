import { tools } from "../src/lib/agent/tools";

export type ExecAction = {
  tool: string;
  arguments?: Record<string, any>;
};

export type ExecResult = {
  ok: boolean;
  output?: string;
  error?: string | null;
  duration_ms: number;
  tool: string;
};

const MCP_URL = process.env.MCP_URL || "http://localhost:5000/mcp/rpc";

export async function executeAction(action: ExecAction): Promise<ExecResult> {
  const started = Date.now();

  if (action.tool !== "exec") {
    const tool = tools[action.tool];
    if (tool) {
      try {
        const result = await tool.execute(action.arguments || {});
        return {
          ok: result?.success !== false,
          output: JSON.stringify(result),
          error: result?.error || null,
          duration_ms: Date.now() - started,
          tool: action.tool
        };
      } catch (err: any) {
        return {
          ok: false,
          error: err?.message || "Execution failed",
          duration_ms: Date.now() - started,
          tool: action.tool
        };
      }
    }

    return {
      ok: false,
      error: "Unsupported tool: " + action.tool,
      duration_ms: Date.now() - started,
      tool: action.tool
    };
  }

  try {
    const method =
      action.arguments?.method ||
      (action.arguments?.command ? "system.exec" : null);

    const params =
      action.arguments?.params ||
      (action.arguments?.command ? { command: action.arguments.command } : null);

    if (!method) {
      return {
        ok: false,
        error: "Missing MCP method",
        duration_ms: Date.now() - started,
        tool: action.tool
      };
    }

    const res = await fetch(MCP_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        jsonrpc: "2.0",
        id: Date.now(),
        method,
        params
      })
    });

    const data: any = await res.json();

    if (data?.error) {
      return {
        ok: false,
        error: data.error.message || "MCP execution failed",
        duration_ms: Date.now() - started,
        tool: action.tool
      };
    }

    const output = data?.result?.content?.[0]?.text ?? JSON.stringify(data);

    return {
      ok: true,
      output,
      error: null,
      duration_ms: Date.now() - started,
      tool: action.tool
    };
  } catch (err: any) {
    return {
      ok: false,
      error: err?.message || "Execution failed",
      duration_ms: Date.now() - started,
      tool: action.tool
    };
  }
}
