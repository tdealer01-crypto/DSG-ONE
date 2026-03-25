import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

export type StoredExecution = {
  id: string;
  timestamp: string;
  goal: string;
  tool: string;
  decision: string;
  reason: string;
  result: any;
  status: string;
  auditId: string;
  proofRef: string;
};

type DBSchema = {
  executions: StoredExecution[];
  providers: any[];
  proofs: any[];
  ledger: any[];
};

const adapter = new JSONFile<DBSchema>("data/db.json");

export const db = new Low<DBSchema>(adapter, {
  executions: [],
  providers: [],
  proofs: [],
  ledger: [],
});

export async function initDB() {
  await db.read();
  db.data ||= {
    executions: [],
    providers: [],
    proofs: [],
    ledger: [],
  };
  await db.write();
}
