import { Router } from "express";
import { db } from "../db";

export const replayRouter = Router();

replayRouter.get("/:executionId", async (req, res) => {
  const executionId = req.params.executionId;

  const execution = db.data.executions.find(e => e.id === executionId);
  if (!execution) {
    return res.status(404).json({ error: "Execution not found" });
  }

  const proofs = (db.data as any).proofs || [];
  const ledger = (db.data as any).ledger || [];

  const proof = proofs.find((p: any) => p.id === execution.proofRef);
  const trace = ledger.filter((l: any) => l.execution_id === executionId);

  return res.json({
    execution,
    proof,
    trace
  });
});
