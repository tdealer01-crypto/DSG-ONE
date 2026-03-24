import { Router } from "express";
import { listProofs, getProofById } from "../repositories/proofs";

export const proofsRouter = Router();

proofsRouter.get("/", async (_req, res) => {
  const proofs = await listProofs();
  res.json(proofs);
});

proofsRouter.get("/:id", async (req, res) => {
  const proof = await getProofById(req.params.id);
  if (!proof) {
    return res.status(404).json({ error: "Proof not found" });
  }
  res.json(proof);
});
