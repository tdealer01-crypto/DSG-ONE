import { db, StoredProvider } from "../db";

export async function listProviders() {
  return db.data.providers;
}

export async function saveProvider(provider: StoredProvider) {
  const idx = db.data.providers.findIndex((p) => p.id === provider.id);
  if (idx >= 0) db.data.providers[idx] = provider;
  else db.data.providers.push(provider);

  if (provider.isDefault) {
    db.data.providers = db.data.providers.map((p) =>
      p.id === provider.id ? p : { ...p, isDefault: false }
    );
  }

  await db.write();
  return provider;
}

export async function getDefaultProvider() {
  return db.data.providers.find((p) => p.isDefault && p.enabled);
}
