export type ChatMessage = {
  role: "system" | "user" | "assistant" | "tool";
  content: string;
};

export type ToolSpec = {
  type: "function";
  function: {
    name: string;
    description?: string;
    parameters?: any;
  };
};

export type OllamaChatResult = {
  text: string;
  tool_calls?: Array<{
    id?: string;
    type?: string;
    function?: {
      name: string;
      arguments: any;
    };
  }>;
  raw: any;
};

const BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434/api";
const MODEL = process.env.OLLAMA_MODEL || "qwen3";
const TIMEOUT_MS = Number(process.env.OLLAMA_TIMEOUT_MS || 120000);

export async function ollamaChat(args: {
  messages: ChatMessage[];
  tools?: ToolSpec[];
  format?: any;
  think?: boolean;
}): Promise<OllamaChatResult> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const res = await fetch(BASE_URL + "/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        model: MODEL,
        stream: false,
        messages: args.messages,
        tools: args.tools,
        format: args.format,
        think: args.think ?? false,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      throw new Error("Ollama chat failed: " + res.status + " " + body);
    }

    const data: any = await res.json();

    return {
      text: data?.message?.content || "",
      tool_calls: data?.message?.tool_calls || [],
      raw: data,
    };
  } finally {
    clearTimeout(timer);
  }
}
