export type MCPToolArgs = Record<string, any>;

export type MCPToolResult = {
  success: boolean;
  tool: string;
  data?: any;
  error?: string;
};

export function toMcpResponse(result: MCPToolResult, id: string | number | null = null) {
  return {
    jsonrpc: "2.0",
    id,
    result: {
      content: [
        {
          type: "text",
          text: JSON.stringify(result),
        },
      ],
    },
  };
}

export function toMcpError(message: string, id: string | number | null = null) {
  return {
    jsonrpc: "2.0",
    id,
    error: {
      code: -32000,
      message,
    },
  };
}
