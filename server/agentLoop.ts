import { randomUUID } from "node:crypto";
import { executeAction } from "./executor";
import { emitEvent } from "./events";
import { appendLedger } from "./ledger";
import { planNextStep } from "./planner";
import { writeProof } from "./proofs";
import { saveExecution } from "./repositories/executions";
import { decide, type DecisionInput } from "./decision";

export type AutoLoopStep = {
  iteration: number;
  thought: string;
  action: any;
  decision: string;
  reason: string;
  result: any;
  proof_id: string;
  audit_id: string;
  execution_id: string;
  status: string;
};

export type AutoLoopRun = {
  ok: boolean;
  goal: string;
  summary: string;
  iterations: number;
  steps: AutoLoopStep[];
  stopped_by: "completed" | "blocked" | "stabilized" | "max_iterations" | "error";
};

function makeAuditId() {
  return `audit_${randomUUID()}`;
}

export async function runAutoLoop(args: {
  goal: string;
  maxIterations?: number;
}): Promise<AutoLoopRun> {
  const goal = String(args.goal || "").trim();
  const maxIterations = Math.max(1, Math.min(Number(args.maxIterations || 3), 10));
  const steps: AutoLoopStep[] = [];
  const history: Array<{ role: string; content: string }> = [];

  if (!goal) {
    return {
      ok: false,
      goal,
      summary: "Missing goal",
      iterations: 0,
      steps,
      stopped_by: "error",
    };
  }

  for (let iteration = 1; iteration <= maxIterations; iteration++) {
    const plan = await planNextStep({ goal, history });

    if (plan.done || !plan.action) {
      return {
        ok: true,
        goal,
        summary: plan.answer || plan.thought || "Completed without tool execution.",
        iterations: iteration - 1,
        steps,
        stopped_by: "completed",
      };
    }

    const proposal: DecisionInput = {
      request_id: `req_${randomUUID()}`,
      step_id: `step_${randomUUID()}`,
      goal,
      thought: plan.thought,
      action: {
        tool: plan.action.tool,
        arguments: plan.action.arguments || {},
      },
      context: {
        source: "auto-loop",
        iteration,
      },
    };

    const auditId = makeAuditId();
    const executionId = randomUUID();

    emitEvent("proposal.created", { proposal, auditId, executionId });

    const decisionResult = decide(proposal);
    const proof = await writeProof({
      execution_id: executionId,
      request_id: proposal.request_id,
      decision: decisionResult.decision,
      reason: decisionResult.reason,
      proof_seed: decisionResult.proof_seed,
      invariant_hits: decisionResult.invariant_hits,
      stability: decisionResult.stability,
    });

    if (decisionResult.decision !== "ALLOW") {
      const status = decisionResult.decision === "BLOCK" ? "blocked" : "stabilized";

      await appendLedger({
        execution_id: executionId,
        proof_id: proof.id,
        audit_id: auditId,
        event_type: `execution.${status}`,
        payload: {
          decision: decisionResult.decision,
          reason: decisionResult.reason,
          action: proposal.action,
        },
      });

      await saveExecution({
        id: executionId,
        timestamp: new Date().toISOString(),
        goal,
        tool: proposal.action.tool,
        decision: decisionResult.decision,
        reason: decisionResult.reason,
        result: null,
        status,
        auditId,
        proofRef: proof.id,
      });

      steps.push({
        iteration,
        thought: plan.thought,
        action: proposal.action,
        decision: decisionResult.decision,
        reason: decisionResult.reason,
        result: null,
        proof_id: proof.id,
        audit_id: auditId,
        execution_id: executionId,
        status,
      });

      return {
        ok: false,
        goal,
        summary: decisionResult.reason,
        iterations: iteration,
        steps,
        stopped_by: decisionResult.decision === "BLOCK" ? "blocked" : "stabilized",
      };
    }

    emitEvent("execution.started", {
      action: proposal.action,
      request_id: proposal.request_id,
      audit_id: auditId,
      execution_id: executionId,
    });

    const result = await executeAction(proposal.action);

    await appendLedger({
      execution_id: executionId,
      proof_id: proof.id,
      audit_id: auditId,
      event_type: "execution.allowed",
      payload: {
        decision: decisionResult.decision,
        reason: decisionResult.reason,
        result_ok: result.ok,
        action: proposal.action,
      },
    });

    await saveExecution({
      id: executionId,
      timestamp: new Date().toISOString(),
      goal,
      tool: proposal.action.tool,
      decision: decisionResult.decision,
      reason: decisionResult.reason,
      result,
      status: result.ok ? "completed" : "failed",
      auditId,
      proofRef: proof.id,
    });

    emitEvent("execution.finished", {
      action: proposal.action,
      request_id: proposal.request_id,
      result,
      proof_id: proof.id,
      audit_id: auditId,
      execution_id: executionId,
    });

    steps.push({
      iteration,
      thought: plan.thought,
      action: proposal.action,
      decision: decisionResult.decision,
      reason: decisionResult.reason,
      result,
      proof_id: proof.id,
      audit_id: auditId,
      execution_id: executionId,
      status: result.ok ? "completed" : "failed",
    });

    history.push({
      role: "assistant",
      content: JSON.stringify({ action: proposal.action, result }),
    });

    return {
      ok: result.ok,
      goal,
      summary: result.ok ? "Completed first executable step." : (result.error || "Execution failed"),
      iterations: iteration,
      steps,
      stopped_by: result.ok ? "completed" : "error",
    };
  }

  return {
    ok: false,
    goal,
    summary: "Stopped after reaching max iterations.",
    iterations: maxIterations,
    steps,
    stopped_by: "max_iterations",
  };
}
