import { randomUUID } from "node:crypto";
import { db } from "./db";

export type StoredProof = {
  id: string;
  execution_id: string;
  request_id: string;
  decision: string;
  reason: string;
  proof_seed: string;
  invariant_hits: any[];
  stability: {
    score: number;
    drift: number;
    pressure: number;
    anomaly_count: number;
  };
  created_at: string;
};

export type CreateProofInput = {
  execution_id: string;
  request_id: string;
  decision: string;
  reason: string;
  proof_seed: string;
  invariant_hits: any[];
  stability: {
    score: number;
    drift: number;
    pressure: number;
    anomaly_count: number;
  };
};

export async function writeProof(input: CreateProofInput): Promise<StoredProof> {
  const store = db.data as typeof db.data & { proofs?: StoredProof[] };
  if (!store.proofs) store.proofs = [];

  const proof: StoredProof = {
    id: `proof_${randomUUID()}`,
    execution_id: input.execution_id,
    request_id: input.request_id,
    decision: input.decision,
    reason: input.reason,
    proof_seed: input.proof_seed,
    invariant_hits: input.invariant_hits,
    stability: input.stability,
    created_at: new Date().toISOString(),
  };

  store.proofs.push(proof);
  await db.write();

  return proof;
}
