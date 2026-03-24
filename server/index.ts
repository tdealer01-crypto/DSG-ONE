import express from "express";
import cors from "cors";
import path from "path";
import { createServer as createViteServer } from "vite";
import { executeRouter } from "./routes/execute";
import { streamRouter } from "./routes/stream";

async function startServer() {
  const app = express();
  const PORT = Number(process.env.PORT || 3000);

  app.use(cors());
  app.use(express.json());

  app.get("/api/health", (_req, res) => {
    res.json({ ok: true, service: "dsg-runtime" });
  });

  app.use("/api/execute", executeRouter);
  app.use("/api/stream", streamRouter);

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`DSG runtime listening on ${PORT}`);
  });
}

startServer();
