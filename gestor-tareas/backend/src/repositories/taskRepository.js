const { readDb, writeDb } = require("../db/jsonDb");

function normalizeTask(task) {
  return {
    ...task,
    id: Number(task.id),
    completed: Boolean(task.completed),
  };
}

function createTaskRepository({ dbPath }) {
  return {
    async list() {
      const db = await readDb(dbPath);
      return db.tasks.map(normalizeTask);
    },

    async create(payload) {
      const db = await readDb(dbPath);
      const tasks = db.tasks.map(normalizeTask);
      const maxId = tasks.reduce((acc, t) => Math.max(acc, t.id || 0), 0);
      const newTask = normalizeTask({
        id: maxId + 1,
        title: payload.title ?? "",
        description: payload.description ?? "",
        date: payload.date ?? "",
        time: payload.time ?? "",
        endTime: payload.endTime ?? "",
        completed: Boolean(payload.completed),
      });
      db.tasks = [...tasks, newTask];
      await writeDb(dbPath, db);
      return newTask;
    },

    async update(id, payload) {
      const db = await readDb(dbPath);
      const tasks = db.tasks.map(normalizeTask);
      const idx = tasks.findIndex((t) => t.id === id);
      const existing = idx >= 0 ? tasks[idx] : { id };

      const updated = normalizeTask({
        ...existing,
        ...payload,
        id,
      });

      if (idx >= 0) tasks[idx] = updated;
      else tasks.push(updated);

      db.tasks = tasks;
      await writeDb(dbPath, db);
      return updated;
    },

    async remove(id) {
      const db = await readDb(dbPath);
      const tasks = db.tasks.map(normalizeTask);
      const before = tasks.length;
      db.tasks = tasks.filter((t) => t.id !== id);
      const changes = before - db.tasks.length;
      await writeDb(dbPath, db);
      return { message: "Eliminado", changes };
    },
  };
}

module.exports = { createTaskRepository };

