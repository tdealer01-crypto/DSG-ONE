import { JSONFilePreset } from "lowdb/node";

export type StoredExecution = {
  id: string;
  timestamp: string;
  goal: string;
  tool: string;
  decision: string;
  reason: string;
  result: any;
  status: string;
  auditId: string;
  proofRef: string;
};

export type StoredProvider = {
  id: string;
  name: string;
  kind: "gemini" | "ollama" | "openai" | "custom-agent";
  baseUrl?: string;
  apiKey?: string;
  model?: string;
  enabled: boolean;
  isDefault: boolean;
};

export type DBSchema = {
  executions: StoredExecution[];
  providers: StoredProvider[];
};

export const db = await JSONFilePreset<DBSchema>("data/db.json", {
  executions: [],
  providers: [],
});
