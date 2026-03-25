import { Router } from "express";
import { db } from "../db";

export const proofsRouter = Router();

// GET /api/proofs
proofsRouter.get("/", async (_req, res) => {
  try {
    await db.read();
    res.json(db.data?.proofs || []);
  } catch (err: any) {
    res.json({ ok: false, error: err.message });
  }
});
