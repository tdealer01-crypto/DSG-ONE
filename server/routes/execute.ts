import { Router } from "express";
import { validateProposal } from "../validator";
import { executeAction } from "../executor";
import { emitEvent } from "../events";

export const executeRouter = Router();

executeRouter.post("/approve", async (req, res) => {
  const proposal = req.body;

  emitEvent("proposal.approved", { proposal });
  emitEvent("execution.started", { action: proposal.action });

  const result = await executeAction(proposal.action);

  emitEvent("execution.finished", {
    action: proposal.action,
    result,
  });

  return res.json({
    ok: result.ok,
    stage: "execute",
    decision: "approve",
    result,
  });
});

executeRouter.post("/", async (req, res) => {
  const proposal = req.body;

  emitEvent("proposal.created", { proposal });

  const validation = await validateProposal(proposal);
  emitEvent(`validator.${validation.decision}`, {
    proposal,
    validation,
  });

  if (validation.decision === "reject") {
    return res.status(400).json({
      ok: false,
      stage: "validate",
      decision: "reject",
      hint: validation.hint,
    });
  }

  if (validation.decision === "revise") {
    return res.status(202).json({
      ok: false,
      stage: "validate",
      decision: "revise",
      hint: validation.hint,
    });
  }

  emitEvent("execution.started", { action: proposal.action });

  const result = await executeAction(proposal.action);

  emitEvent("execution.finished", {
    action: proposal.action,
    result,
  });

  return res.json({
    ok: result.ok,
    stage: "execute",
    decision: "approve",
    result,
  });
});
