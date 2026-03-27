import { Router } from "express";
import { db } from "../db";

export const replayRouter = Router();

replayRouter.get("/:id", async (req, res) => {
  try {
    await db.read();
    const id = req.params.id;

    const execution = db.data?.executions?.find((e: any) => e.id === id);

    if (!execution) {
      return res.json({ ok: false, error: "not found" });
    }

    const proof =
      db.data?.proofs?.find((p: any) => p.id === execution.proofRef || p.execution_id === execution.id) || null;

    const trace = (db.data?.ledger || []).filter((item: any) => item.execution_id === execution.id);

    res.json({
      execution,
      proof,
      trace,
    });
  } catch (err: any) {
    res.json({ ok: false, error: err.message });
  }
});
