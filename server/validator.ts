export type Proposal = {
  request_id: string;
  step_id: string;
  goal: string;
  thought: string;
  action: {
    tool: string;
    arguments?: Record<string, any>;
  };
  context?: Record<string, any>;
};

export type ValidatorDecision = "approve" | "reject" | "revise";

export type ValidationResult = {
  decision: ValidatorDecision;
  hint?: {
    message: string;
    suggested_alternatives?: string[];
  };
  request_id: string;
};

const DANGEROUS_PATTERNS = [
  "rm -rf",
  "shutdown",
  "reboot",
  "mkfs",
  ":(){:|:&};:",
];

export async function validateProposal(
  proposal: Proposal,
): Promise<ValidationResult> {
  const cmd = String(proposal.action?.arguments?.command || "").toLowerCase();

  if ((proposal.action?.tool === "exec" || proposal.action?.tool === "shell_run_command") && !cmd) {
    return {
      decision: "reject",
      request_id: proposal.request_id,
      hint: {
        message: "Missing command in action arguments.",
      },
    };
  }

  if (cmd && DANGEROUS_PATTERNS.some((p) => cmd.includes(p))) {
    return {
      decision: "reject",
      request_id: proposal.request_id,
      hint: {
        message: "Dangerous command blocked by validator.",
        suggested_alternatives: ["ls", "du -sh", "archive", "compress"],
      },
    };
  }

  if (cmd.includes("restart")) {
    return {
      decision: "revise",
      request_id: proposal.request_id,
      hint: {
        message: "Use a safe restart procedure instead of direct restart.",
        suggested_alternatives: ["status check", "graceful restart"],
      },
    };
  }

  return {
    decision: "approve",
    request_id: proposal.request_id,
  };
}
