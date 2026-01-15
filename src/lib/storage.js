const KEY = "sonicwave_v1";

export function loadDB() {
  const raw = localStorage.getItem(KEY);
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function saveDB(db) {
  localStorage.setItem(KEY, JSON.stringify(db));
}

export function ensureDB(seed) {
  let db = loadDB();
  if (!db) {
    db = seed;
    saveDB(db);
  }
  return db;
}
