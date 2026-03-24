import { db, StoredExecution } from "../db";

export async function saveExecution(entry: StoredExecution) {
  db.data.executions.push(entry);
  await db.write();
  return entry;
}

export async function listExecutions(limit = 100) {
  return [...db.data.executions]
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
}
