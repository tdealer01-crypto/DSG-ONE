import { randomUUID } from "node:crypto";
import { db } from "./db";

export type StoredLedgerEntry = {
  id: string;
  execution_id: string;
  proof_id: string;
  audit_id: string;
  event_type: string;
  payload: any;
  created_at: string;
};

export type CreateLedgerEntryInput = {
  execution_id: string;
  proof_id: string;
  audit_id: string;
  event_type: string;
  payload: any;
};

export async function appendLedger(
  input: CreateLedgerEntryInput,
): Promise<StoredLedgerEntry> {
  const store = db.data as typeof db.data & { ledger?: StoredLedgerEntry[] };
  if (!store.ledger) store.ledger = [];

  const entry: StoredLedgerEntry = {
    id: `ledger_${randomUUID()}`,
    execution_id: input.execution_id,
    proof_id: input.proof_id,
    audit_id: input.audit_id,
    event_type: input.event_type,
    payload: input.payload,
    created_at: new Date().toISOString(),
  };

  store.ledger.push(entry);
  await db.write();

  return entry;
}
