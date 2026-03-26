import express from "express";
import cors from "cors";
import path from "path";
import { createServer as createViteServer } from "vite";
import { executeRouter } from "./routes/execute";
import { streamRouter } from "./routes/stream";
import { executeRouterV2 } from "./routes/execute_v2";
import { providersRouter } from "./routes/providers";
import { executionsRouter } from "./routes/executions";
import { proofsRouter } from "./routes/proofs";
import { replayRouter } from "./routes/replay";
import { agentRouter } from "./routes/agent";
import { gcpMarketplaceRouter } from "./routes/gcp_marketplace";
import { startMcpServer } from "./mcp/index";
import { initDB } from "./db";

async function startServer() {
  await initDB();

  const app = express();
  const PORT = Number(process.env.PORT || 3000);

  app.use(cors());
  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, service: "dsg-one", timestamp: new Date().toISOString() });
  });

  app.use("/api/execute", executeRouter);
  app.use("/api/execute-v2", executeRouterV2);
  app.use("/api/stream", streamRouter);
  app.use("/api/providers", providersRouter);
  app.use("/api/executions", executionsRouter);
  app.use("/api/proofs", proofsRouter);
  app.use("/api/replay", replayRouter);
  app.use("/api/agent", agentRouter);
  app.use("/api/gcp/marketplace", gcpMarketplaceRouter);

  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log("DSG runtime listening on " + PORT);
  });
}

startServer();
startMcpServer();
