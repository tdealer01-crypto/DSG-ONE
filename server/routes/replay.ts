import { Router } from "express";
import { db } from "../db";

export const replayRouter = Router();

replayRouter.get("/:id", async (req, res) => {
  try {
    await db.read();
    const id = req.params.id;

    const exec = db.data?.executions?.find((e: any) => e.id === id);

    if (!exec) {
      return res.json({ ok: false, error: "not found" });
    }

    res.json(exec);
  } catch (err: any) {
    res.json({ ok: false, error: err.message });
  }
});
