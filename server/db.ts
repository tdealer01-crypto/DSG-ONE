import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

type DBSchema = {
  executions: any[];
  providers: any[];
  proofs: any[];
  ledger: any[];
};

const adapter = new JSONFile<DBSchema>("data/db.json");

export const db = new Low<DBSchema>(adapter, {
  executions: [],
  providers: [],
  proofs: [],
  ledger: []
});

// ❌ ห้ามใช้ top-level await
// await db.read();

// ✅ ใช้ init function แทน
export async function initDB() {
  await db.read();
  db.data ||= {
    executions: [],
    providers: [],
    proofs: [],
    ledger: []
  };
  await db.write();
}
