export type MCPToolArgs = Record<string, any>;

export type MCPToolResult = {
  tool?: string;
  ok?: boolean;
  data?: any;
  error?: string;
};
