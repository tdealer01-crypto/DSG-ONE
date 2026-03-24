import { randomUUID } from "crypto";

export function makeProposalFromText(message: string) {
  return {
    request_id: randomUUID(),
    step_id: randomUUID(),
    goal: message,
    thought: "Convert user message into a single safe shell proposal.",
    action: {
      tool: "exec",
      arguments: {
        command: message,
      },
    },
    context: {
      source: "chat",
    },
  };
}
