import { db } from "../db";
import type { StoredProof } from "../proofs";

export async function listProofs(limit = 100): Promise<StoredProof[]> {
  const proofs = (db.data as typeof db.data & { proofs?: StoredProof[] }).proofs || [];
  return [...proofs]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, limit);
}

export async function getProofById(id: string): Promise<StoredProof | null> {
  const proofs = (db.data as typeof db.data & { proofs?: StoredProof[] }).proofs || [];
  return proofs.find((proof) => proof.id === id) || null;
}
