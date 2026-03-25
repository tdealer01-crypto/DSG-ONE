import { ollamaChat } from "./llm/ollama";
import { getServerToolDeclarations } from "./toolDeclarations";

export type PlannedAction = {
  tool: string;
  arguments?: Record<string, any>;
};

export type PlanResult = {
  thought: string;
  action: PlannedAction | null;
  done: boolean;
  answer?: string;
  source: "ollama" | "rules";
};

function buildRulePlan(goal: string): PlanResult {
  const text = goal.trim();
  const lower = text.toLowerCase();

  if (!text) {
    return {
      thought: "Empty goal provided.",
      action: null,
      done: true,
      answer: "No goal provided.",
      source: "rules",
    };
  }

  if (text.startsWith("{")) {
    try {
      const parsed = JSON.parse(text);
      return {
        thought: "Direct MCP invocation requested.",
        action: {
          tool: "exec",
          arguments: {
            method: parsed.method,
            params: parsed.params || {},
          },
        },
        done: false,
        source: "rules",
      };
    } catch {
      return {
        thought: "Invalid JSON goal; returning as text.",
        action: null,
        done: true,
        answer: "Invalid JSON input.",
        source: "rules",
      };
    }
  }

  if (/^(ls|pwd|echo|cat|find)\b/i.test(text)) {
    return {
      thought: "Shell-style safe command detected.",
      action: {
        tool: "exec",
        arguments: { command: text },
      },
      done: false,
      source: "rules",
    };
  }

  if (/^read file /i.test(lower)) {
    const file = text.replace(/^read file /i, "").trim();
    return {
      thought: "Read-file intent mapped to MCP file.read.",
      action: {
        tool: "exec",
        arguments: {
          method: "file.read",
          params: { file },
        },
      },
      done: false,
      source: "rules",
    };
  }

  if (/^list files( in)?/i.test(lower)) {
    return {
      thought: "List-files intent mapped to MCP file.list.",
      action: {
        tool: "exec",
        arguments: {
          method: "file.list",
          params: { dir: "." },
        },
      },
      done: false,
      source: "rules",
    };
  }

  return {
    thought: "No direct rule matched; returning goal as final text.",
    action: null,
    done: true,
    answer: text,
    source: "rules",
  };
}

export async function planNextStep(args: {
  goal: string;
  history?: Array<{ role: string; content: string }>;
}): Promise<PlanResult> {
  const hasOllama = !!process.env.OLLAMA_BASE_URL;

  if (!hasOllama) {
    return buildRulePlan(args.goal);
  }

  try {
    const prompt = [
      "You are the DSG planner.",
      "Return either a direct answer or exactly one tool call.",
      "If a tool call is needed, use the provided function tools.",
      "Prefer safe file/browser/system actions only.",
      "Goal:",
      args.goal,
    ].join("\n");

    const result = await ollamaChat({
      messages: [{ role: "user", content: prompt }],
      tools: getServerToolDeclarations(),
      think: false,
    });

    const firstCall = result.tool_calls?.[0];
    if (firstCall?.function?.name) {
      return {
        thought: result.text || "Tool call proposed by Ollama.",
        action: {
          tool: firstCall.function.name,
          arguments: firstCall.function.arguments || {},
        },
        done: false,
        source: "ollama",
      };
    }

    return {
      thought: result.text || "Ollama returned a final answer.",
      action: null,
      done: true,
      answer: result.text || args.goal,
      source: "ollama",
    };
  } catch {
    return buildRulePlan(args.goal);
  }
}
