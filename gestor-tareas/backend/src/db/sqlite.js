const sqlite3 = require("sqlite3").verbose();

let db;

function getDb(dbPath) {
  if (db) return db;
  db = new sqlite3.Database(dbPath);
  return db;
}

function initSchema(dbPath) {
  const database = getDb(dbPath);
  database.serialize(() => {
    database.run(`CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      description TEXT,
      date TEXT,
      time TEXT,
      endTime TEXT,
      completed BOOLEAN DEFAULT 0
    )`);
  });
  return database;
}

module.exports = { getDb, initSchema };

