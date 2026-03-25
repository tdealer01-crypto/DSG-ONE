import { Router } from "express";
import { db } from "../db";

export const executionsRouter = Router();

executionsRouter.get("/", async (_req, res) => {
  try {
    await db.read();
    res.json(db.data?.executions || []);
  } catch (err: any) {
    res.json({ ok: false, error: err.message });
  }
});
