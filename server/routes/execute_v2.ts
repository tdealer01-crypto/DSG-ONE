import { randomUUID } from "node:crypto";
import { Router } from "express";
import { executeAction } from "../executor";
import { emitEvent } from "../events";
import { appendLedger } from "../ledger";
import { writeProof } from "../proofs";
import { saveExecution } from "../repositories/executions";
import { decide, type DecisionInput } from "../decision";

export const executeRouterV2 = Router();

function makeAuditId() {
  return `audit_${randomUUID()}`;
}

executeRouterV2.post("/", async (req, res) => {
  try {
    const proposal = req.body as Partial<DecisionInput>;
    const action = proposal?.action;

    if (!action) {
      return res.json({
        ok: false,
        error: "missing action"
      });
    }

    const normalized: DecisionInput = {
      request_id: String(proposal.request_id || `req_${randomUUID()}`),
      step_id: String(proposal.step_id || `step_${randomUUID()}`),
      goal: String(proposal.goal || action.tool || "manual execution"),
      thought: String(proposal.thought || "manual console execution"),
      action: {
        tool: String(action.tool || "exec"),
        arguments: action.arguments || {}
      },
      context: proposal.context || { source: "execute-v2" }
    };

    const auditId = makeAuditId();
    const executionId = randomUUID();

    emitEvent("proposal.created", { proposal: normalized, auditId, executionId });

    const decisionResult = decide(normalized);
    const proof = await writeProof({
      execution_id: executionId,
      request_id: normalized.request_id,
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
          action: normalized.action,
        },
      });

      await saveExecution({
        id: executionId,
        timestamp: new Date().toISOString(),
        goal: normalized.goal,
        tool: normalized.action.tool,
        decision: decisionResult.decision,
        reason: decisionResult.reason,
        result: null,
        status,
        auditId,
        proofRef: proof.id,
      });

      return res.json({
        ok: false,
        decision: decisionResult.decision,
        reason: decisionResult.reason,
        result: null,
        proof_id: proof.id,
        audit_id: auditId,
        execution_id: executionId,
        status,
        stability: decisionResult.stability,
        invariant_hits: decisionResult.invariant_hits,
      });
    }

    emitEvent("execution.started", {
      action: normalized.action,
      request_id: normalized.request_id,
      audit_id: auditId,
      execution_id: executionId,
    });

    const result = await executeAction(normalized.action);

    await appendLedger({
      execution_id: executionId,
      proof_id: proof.id,
      audit_id: auditId,
      event_type: "execution.allowed",
      payload: {
        decision: decisionResult.decision,
        reason: decisionResult.reason,
        result_ok: result.ok,
        action: normalized.action,
        result,
      },
    });

    await saveExecution({
      id: executionId,
      timestamp: new Date().toISOString(),
      goal: normalized.goal,
      tool: normalized.action.tool,
      decision: decisionResult.decision,
      reason: decisionResult.reason,
      result,
      status: result.ok ? "completed" : "failed",
      auditId,
      proofRef: proof.id,
    });

    emitEvent("execution.finished", {
      action: normalized.action,
      request_id: normalized.request_id,
      result,
      proof_id: proof.id,
      audit_id: auditId,
      execution_id: executionId,
    });

    return res.json({
      ok: result.ok,
      decision: decisionResult.decision,
      reason: decisionResult.reason,
      result,
      proof_id: proof.id,
      audit_id: auditId,
      execution_id: executionId,
      status: result.ok ? "completed" : "failed",
      stability: decisionResult.stability,
      invariant_hits: decisionResult.invariant_hits,
    });
  } catch (err: any) {
    return res.json({
      ok: false,
      error: err?.message || "execution failed"
    });
  }
});
