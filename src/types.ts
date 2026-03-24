export type Provider = {
  id: string;
  name: string;
  kind: "model" | "agent";
  providerType: "ollama" | "openai" | "anthropic" | "gemini" | "xai" | "openclaw" | "custom";
  baseUrl?: string;
  apiKeyRef?: string;
  defaultModel?: string;
  isActive: boolean;
  isFallback: boolean;
  supportsStreaming?: boolean;
  supportsReplan?: boolean;
  status: "connected" | "disconnected" | "error";
  lastCheckedAt?: string;
};

export type AgentRuntimeBinding = {
  agentId: string;
  plannerProviderId?: string;
  runtimeProviderId?: string;
  fallbackProviderId?: string;
  executionPolicy: string;
  approvalPolicy: string;
};
