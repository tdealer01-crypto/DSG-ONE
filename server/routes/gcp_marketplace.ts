import { Router } from "express";

export const gcpMarketplaceRouter = Router();

type MarketplaceAck = {
  ok: boolean;
  service: string;
  endpoint: string;
  method: string;
  timestamp: string;
  message: string;
  requestId: string | null;
};

function buildAck(method: string, requestId: string | null, message: string): MarketplaceAck {
  return {
    ok: true,
    service: "dsg-one",
    endpoint: "/api/gcp/marketplace",
    method,
    timestamp: new Date().toISOString(),
    message,
    requestId,
  };
}

function getRequestId(req: { get: (name: string) => string | undefined }) {
  return req.get("x-request-id") || req.get("x-cloud-trace-context") || null;
}

gcpMarketplaceRouter.get("/", (req, res) => {
  const requestId = getRequestId(req);
  res.status(200).json(
    buildAck(
      "GET",
      requestId,
      "DSG ONE Google Cloud Marketplace integration endpoint is reachable.",
    ),
  );
});

gcpMarketplaceRouter.post("/", (req, res) => {
  const requestId = getRequestId(req);
  res.status(200).json({
    ...buildAck(
      "POST",
      requestId,
      "DSG ONE Google Cloud Marketplace integration payload received.",
    ),
    received: req.body ?? null,
  });
});

gcpMarketplaceRouter.options("/", (_req, res) => {
  res.setHeader("Allow", "GET, POST, OPTIONS");
  res.status(204).end();
});
