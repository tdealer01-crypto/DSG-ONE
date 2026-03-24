export type DSGDecision = "ALLOW" | "STABILIZE" | "BLOCK";

export type InvariantSeverity = "low" | "medium" | "high" | "critical";

export type InvariantHit = {
  id: string;
  name: string;
  severity: InvariantSeverity;
  reason: string;
};

export type StabilitySnapshot = {
  score: number;
  drift: number;
  pressure: number;
  anomaly_count: number;
};

export type DecisionInput = {
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

export type DecisionResult = {
  decision: DSGDecision;
  reason: string;
  invariant_hits: InvariantHit[];
  stability: StabilitySnapshot;
  proof_seed: string;
};

const BLOCK_PATTERNS = [
  "rm -rf",
  "mkfs",
  "shutdown",
  "reboot",
  ":(){:|:&};:",
  "credential",
  "password",
  "token ",
  "api_key",
];

const STABILIZE_PATTERNS = [
  "restart",
  "kill ",
  "systemctl",
  "docker restart",
  "kubectl delete",
  "terraform apply",
];

function getCommand(input: DecisionInput): string {
  return String(
    input.action?.arguments?.command ||
      input.action?.arguments?.cmd ||
      "",
  ).toLowerCase();
}

function evaluateInvariants(input: DecisionInput): InvariantHit[] {
  const hits: InvariantHit[] = [];
  const cmd = getCommand(input);
  const tool = String(input.action?.tool || "").toLowerCase();

  if ((tool === "exec" || tool === "shell_run_command") && !cmd) {
    hits.push({
      id: "INV-001",
      name: "Missing command",
      severity: "high",
      reason: "Command execution requested without a command payload.",
    });
  }

  if (cmd && BLOCK_PATTERNS.some((p) => cmd.includes(p))) {
    hits.push({
      id: "INV-002",
      name: "Dangerous command",
      severity: "critical",
      reason: "Command matches blocked destructive or secret-handling patterns.",
    });
  }

  if (cmd && STABILIZE_PATTERNS.some((p) => cmd.includes(p))) {
    hits.push({
      id: "INV-003",
      name: "High-risk operational action",
      severity: "medium",
      reason: "Command can mutate runtime state and should be stabilized first.",
    });
  }

  if (tool === "open_url") {
    const url = String(input.action?.arguments?.url || "");
    if (url.startsWith("http://")) {
      hits.push({
        id: "INV-004",
        name: "Insecure transport",
        severity: "medium",
        reason: "Plain HTTP detected. Require HTTPS or explicit approval.",
      });
    }
  }

  return hits;
}

function computeStability(input: DecisionInput, hits: InvariantHit[]): StabilitySnapshot {
  const cmd = getCommand(input);

  let drift = 0;
  let pressure = 0;
  let anomaly_count = 0;

  if (cmd) {
    if (cmd.includes("restart")) drift += 25;
    if (cmd.includes("delete")) drift += 20;
    if (cmd.includes("apply")) drift += 15;
    if (cmd.includes("kill")) drift += 20;
  }

  for (const hit of hits) {
    anomaly_count += 1;
    if (hit.severity === "critical") pressure += 60;
    else if (hit.severity === "high") pressure += 35;
    else if (hit.severity === "medium") pressure += 20;
    else pressure += 10;
  }

  const score = Math.max(0, 100 - drift - pressure);

  return {
    score,
    drift: Math.min(100, drift),
    pressure: Math.min(100, pressure),
    anomaly_count,
  };
}

function makeProofSeed(input: DecisionInput, hits: InvariantHit[], stability: StabilitySnapshot): string {
  const basis = JSON.stringify({
    request_id: input.request_id,
    step_id: input.step_id,
    goal: input.goal,
    tool: input.action?.tool,
    hits: hits.map((h) => h.id),
    stability,
  });

  let hash = 0;
  for (let i = 0; i < basis.length; i++) {
    hash = (hash * 31 + basis.charCodeAt(i)) >>> 0;
  }
  return `proof_${hash.toString(16)}`;
}

export function decide(input: DecisionInput): DecisionResult {
  const invariant_hits = evaluateInvariants(input);
  const stability = computeStability(input, invariant_hits);

  const hasCritical = invariant_hits.some((h) => h.severity === "critical");
  const hasHigh = invariant_hits.some((h) => h.severity === "high");

  let decision: DSGDecision = "ALLOW";
  let reason = "Execution satisfies active invariants and stability is within bounds.";

  if (hasCritical || hasHigh) {
    decision = "BLOCK";
    reason = "Blocked by invariant violation.";
  } else if (
    invariant_hits.length > 0 ||
    stability.score < 70 ||
    stability.drift >= 25 ||
    stability.pressure >= 25
  ) {
    decision = "STABILIZE";
    reason = "Execution requires stabilization before approval.";
  }

  const proof_seed = makeProofSeed(input, invariant_hits, stability);

  return {
    decision,
    reason,
    invariant_hits,
    stability,
    proof_seed,
  };
}
