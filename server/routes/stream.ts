import { Router } from "express";
import { addClient } from "../events";

export const streamRouter = Router();

streamRouter.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders?.();

  addClient(res);
});
