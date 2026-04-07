const fs = require("fs/promises");
const path = require("path");

async function ensureDbFile(dbPath) {
  await fs.mkdir(path.dirname(dbPath), { recursive: true });
  try {
    await fs.access(dbPath);
  } catch {
    await fs.writeFile(dbPath, JSON.stringify({ tasks: [] }, null, 2), "utf8");
  }
}

async function readDb(dbPath) {
  await ensureDbFile(dbPath);
  const raw = await fs.readFile(dbPath, "utf8");
  const parsed = JSON.parse(raw || "{}");
  return { tasks: Array.isArray(parsed.tasks) ? parsed.tasks : [] };
}

async function writeDb(dbPath, data) {
  await ensureDbFile(dbPath);
  const tmp = `${dbPath}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), "utf8");
  await fs.rename(tmp, dbPath);
}

module.exports = { readDb, writeDb, ensureDbFile };

