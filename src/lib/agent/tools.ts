export type ActionClass = "AUTO_EXECUTE" | "REQUIRE_APPROVAL" | "BLOCKED";

export interface ToolDefinition {
  name: string;
  description: string;
  category: string;
  actionClass: ActionClass;
  execute: (args: any) => Promise<any>;
  declaration: any;
}

export const tools: Record<string, ToolDefinition> = {
  browser_extract_text: {
    name: "browser_extract_text",
    description: "Extract text content from a URL",
    category: "Browser",
    actionClass: "AUTO_EXECUTE",
    declaration: {
      name: "browser_extract_text",
      description: "Extract text content from a URL",
      parameters: {
        type: "object",
        properties: {
          url: { type: "string" }
        },
        required: ["url"]
      }
    },
    execute: async ({ url }) => {
      try {
        const res = await fetch(url);
        const text = await res.text();
        return {
          success: true,
          text: text.replace(/<[^>]*>?/gm, "").replace(/\s+/g, " ").trim().slice(0, 2000)
        };
      } catch (error) {
        return {
          success: false,
          error: String(error)
        };
      }
    }
  },

  api_webhook_call: {
    name: "api_webhook_call",
    description: "Call an external API or webhook",
    category: "API",
    actionClass: "REQUIRE_APPROVAL",
    declaration: {
      name: "api_webhook_call",
      description: "Call an external API or webhook",
      parameters: {
        type: "object",
        properties: {
          url: { type: "string" },
          method: { type: "string" },
          payload: { type: "object" }
        },
        required: ["url", "method"]
      }
    },
    execute: async ({ url, method, payload }) => {
      try {
        const response = await fetch(url, {
          method: String(method || "GET").toUpperCase(),
          headers: { "Content-Type": "application/json" },
          body: ["POST", "PUT", "PATCH"].includes(String(method || "GET").toUpperCase())
            ? JSON.stringify(payload || {})
            : undefined
        });

        const text = await response.text();

        return {
          success: response.ok,
          status: response.status,
          response: text.slice(0, 2000)
        };
      } catch (error) {
        return {
          success: false,
          error: String(error)
        };
      }
    }
  },

  search_query: {
    name: "search_query",
    description: "Search Wikipedia",
    category: "Search",
    actionClass: "AUTO_EXECUTE",
    declaration: {
      name: "search_query",
      description: "Search Wikipedia",
      parameters: {
        type: "object",
        properties: {
          query: { type: "string" }
        },
        required: ["query"]
      }
    },
    execute: async ({ query }) => {
      try {
        const url =
          "https://en.wikipedia.org/w/api.php?action=query&list=search&format=json&origin=*&srsearch=" +
          encodeURIComponent(query);

        const response = await fetch(url);
        const data = await response.json();

        return {
          success: true,
          results: data?.query?.search || []
        };
      } catch (error) {
        return {
          success: false,
          error: String(error)
        };
      }
    }
  },

  exec: {
    name: "exec",
    description: "Execute a command or MCP method via backend",
    category: "Shell",
    actionClass: "REQUIRE_APPROVAL",
    declaration: {
      name: "exec",
      description: "Execute a command or MCP method via backend",
      parameters: {
        type: "object",
        properties: {
          command: { type: "string" },
          method: { type: "string" },
          params: { type: "object" }
        }
      }
    },
    execute: async () => {
      return {
        success: true,
        message: "Handled by backend"
      };
    }
  }
};

export const getToolDeclarations = () => Object.values(tools).map((t) => t.declaration);

export const validateProposal = (
  toolName: string
): { decision: "ALLOW" | "STABILIZE" | "BLOCK"; reason: string } => {
  const tool = tools[toolName];
  if (!tool) {
    return { decision: "BLOCK", reason: "Tool " + toolName + " not found" };
  }

  switch (tool.actionClass) {
    case "AUTO_EXECUTE":
      return { decision: "ALLOW", reason: "Safe read-only or draft action" };
    case "REQUIRE_APPROVAL":
      return { decision: "STABILIZE", reason: "Requires operator confirmation" };
    case "BLOCKED":
      return { decision: "BLOCK", reason: "Action class blocked by default policy" };
    default:
      return { decision: "BLOCK", reason: "Unknown action class" };
  }
};
