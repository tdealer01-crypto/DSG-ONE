import express from "express";
import { handleMcpRequest } from "./router";

export function startMcpServer() {
  const app = express();
  app.use(express.json());

  app.post("/mcp/rpc", async (req, res) => {
    const { jsonrpc, id, method, params } = req.body ?? {};

    try {
      const result = await handleMcpRequest(method, params);

      res.json({
        jsonrpc: jsonrpc || "2.0",
        id: id ?? null,
        result: {
          content: [
            {
              type: "text",
              text: JSON.stringify(result)
            }
          ]
        }
      });
    } catch (err: any) {
      res.status(200).json({
        jsonrpc: jsonrpc || "2.0",
        id: id ?? null,
        error: {
          code: -32000,
          message: err?.message || "MCP request failed"
        }
      });
    }
  });

  const port = Number(process.env.MCP_PORT || 5000);
  app.listen(port, "0.0.0.0", () => {
    console.log("MCP server running on " + port);
  });
}
