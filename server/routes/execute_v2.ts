import { randomUUID } from "node:crypto";
import { Router } from "express";
import { executeAction } from "../executor";
import { emitEvent } from "../events";
import { appendLedger } from "../ledger";
import { writeProof } from "../proofs";
import { saveExecution } from "../repositories/executions";
import { decide } from "../decision";

export const executeRouterV2 = Router();

function makeAuditId() {
  return `audit_${randomUUID()}`;
}

executeRouterV2.post("/", async (req, res) => {
  const proposal = req.body;
  const auditId = makeAuditId();

  emitEvent("proposal.created", { proposal, auditId });

  const decisionResult = decide(proposal);

  emitEvent("decision.made", {
    request_id: proposal.request_id,
    step_id: proposal.step_id,
    decision: decisionResult.decision,
    reason: decisionResult.reason,
    invariant_hits: decisionResult.invariant_hits,
    stability: decisionResult.stability,
    proof_seed: decisionResult.proof_seed,
    audit_id: auditId,
  });

  const executionId = randomUUID();

  const proof = await writeProof({
    execution_id: executionId,
    request_id: proposal.request_id,
    decision: decisionResult.decision,
    reason: decisionResult.reason,
    proof_seed: decisionResult.proof_seed,
    invariant_hits: decisionResult.invariant_hits,
    stability: decisionResult.stability,
  });

  if (decisionResult.decision === "BLOCK") {
    await appendLedger({
      execution_id: executionId,
      proof_id: proof.id,
      audit_id: auditId,
      event_type: "execution.blocked",
      payload: {
        decision: decisionResult.decision,
        reason: decisionResult.reason,
      },
    });

    await saveExecution({
      id: executionId,
      timestamp: new Date().toISOString(),
      goal: proposal.goal,
      tool: proposal.action?.tool || "unknown",
      decision: decisionResult.decision,
      reason: decisionResult.reason,
      result: null,
      status: "blocked",
      auditId,
      proofRef: proof.id,
    });

    return res.status(403).json({
      ok: false,
      stage: "decision",
      decision: decisionResult.decision,
      reason: decisionResult.reason,
      proof_id: proof.id,
      audit_id: auditId,
    });
  }

  if (decisionResult.decision === "STABILIZE") {
    await appendLedger({
      execution_id: executionId,
      proof_id: proof.id,
      audit_id: auditId,
      event_type: "execution.stabilized",
      payload: {
        decision: decisionResult.decision,
        reason: decisionResult.reason,
      },
    });

    await saveExecution({
      id: executionId,
      timestamp: new Date().toISOString(),
      goal: proposal.goal,
      tool: proposal.action?.tool || "unknown",
      decision: decisionResult.decision,
      reason: decisionResult.reason,
      result: null,
      status: "stabilized",
      auditId,
      proofRef: proof.id,
    });

    return res.status(202).json({
      ok: false,
      stage: "decision",
      decision: decisionResult.decision,
      reason: decisionResult.reason,
      proof_id: proof.id,
      audit_id: auditId,
    });
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
    },
  });

  await saveExecution({
    id: executionId,
    timestamp: new Date().toISOString(),
    goal: proposal.goal,
    tool: proposal.action?.tool || "unknown",
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

  return res.json({
    ok: result.ok,
    stage: "execute",
    decision: decisionResult.decision,
    reason: decisionResult.reason,
    proof_id: proof.id,
    audit_id: auditId,
    result,
  });
});
