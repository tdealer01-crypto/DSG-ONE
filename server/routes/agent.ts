import { Router } from "express";
import { planNextStep } from "../planner";
import { runAutoLoop } from "../agentLoop";

export const agentRouter = Router();

agentRouter.get("/status", async (_req, res) => {
  const baseUrl = process.env.OLLAMA_BASE_URL || "http://localhost:11434/api";
  const model = process.env.OLLAMA_MODEL || "qwen3";
  const configured = !!process.env.OLLAMA_BASE_URL;
  let connected = false;

  try {
    const ping = await fetch(baseUrl.replace(/\/api$/, "") + "/api/tags");
    connected = ping.ok;
  } catch {
    connected = false;
  }

  return res.json({
    ok: true,
    planner_mode: connected ? "ollama" : "rules",
    ollama: {
      configured,
      connected,
      base_url: baseUrl,
      model,
    },
  });
});

agentRouter.post("/plan", async (req, res) => {
  try {
    const goal = String(req.body?.goal || "").trim();
    if (!goal) {
      return res.status(400).json({ ok: false, error: "missing goal" });
    }

    const result = await planNextStep({ goal });
    return res.json({ ok: true, ...result });
  } catch (err: any) {
    return res.status(500).json({ ok: false, error: err?.message || "planner failed" });
  }
});

agentRouter.post("/auto-loop", async (req, res) => {
  try {
    const goal = String(req.body?.goal || "").trim();
    const maxIterations = Number(req.body?.maxIterations || 3);

    if (!goal) {
      return res.status(400).json({ ok: false, error: "missing goal" });
    }

    const run = await runAutoLoop({ goal, maxIterations });
    return res.json(run);
  } catch (err: any) {
    return res.status(500).json({ ok: false, error: err?.message || "auto-loop failed" });
  }
});
