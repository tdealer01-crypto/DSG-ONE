import { Router } from "express";
import { executeAction } from "../executor";

export const executeRouterV2 = Router();

executeRouterV2.post("/", async (req, res) => {
  try {
    const { action } = req.body;

    if (!action) {
      return res.json({
        ok: false,
        error: "missing action"
      });
    }

    const result = await executeAction(action);

    return res.json({
      ok: result.ok,
      result,
      decision: "ALLOW",
      proof_id: "dev-proof",
      audit_id: "dev-audit"
    });

  } catch (err: any) {
    return res.json({
      ok: false,
      error: err?.message || "execution failed"
    });
  }
});
