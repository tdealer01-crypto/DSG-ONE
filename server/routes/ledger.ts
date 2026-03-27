import { Router } from "express";
import { db } from "../db";

export const ledgerRouter = Router();

ledgerRouter.get("/", async (_req, res) => {
  try {
    await db.read();
    const items = [...(db.data?.ledger || [])].sort(
      (a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
    res.json(items);
  } catch (err: any) {
    res.json({ ok: false, error: err.message });
  }
});
