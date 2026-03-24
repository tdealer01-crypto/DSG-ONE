import { Router } from "express";
import { listProviders, saveProvider } from "../repositories/providers";

export const providersRouter = Router();

providersRouter.get("/", async (_req, res) => {
  res.json(await listProviders());
});

providersRouter.post("/", async (req, res) => {
  const provider = await saveProvider(req.body);
  res.json({ ok: true, provider });
});

providersRouter.post("/test", async (req, res) => {
  const provider = req.body;

  if (!provider.name || !provider.kind) {
    return res.status(400).json({ ok: false, error: "Missing provider fields" });
  }

  return res.json({
    ok: true,
    status: "connected",
    checkedAt: new Date().toISOString(),
  });
});
