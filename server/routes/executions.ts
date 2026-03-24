import { Router } from "express";
import { listExecutions } from "../repositories/executions";

export const executionsRouter = Router();

executionsRouter.get("/", async (_req, res) => {
  const data = await listExecutions();
  res.json(data);
});
