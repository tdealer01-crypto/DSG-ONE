import { Router } from "express";
import { db } from "../db";

export const providersRouter = Router();

providersRouter.get("/", async (_req, res) => {
  try {
    await db.read();
    res.json(db.data?.providers || []);
  } catch (err: any) {
    res.json({ ok: false, error: err.message });
  }
});
