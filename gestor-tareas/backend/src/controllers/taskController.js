function createTaskController(taskService) {
  return {
    async list(req, res) {
      try {
        const tasks = await taskService.list();
        res.json(tasks);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    },

    async create(req, res) {
      try {
        const created = await taskService.create(req.body || {});
        res.json(created);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    },

    async update(req, res) {
      try {
        const id = Number(req.params.id);
        const updated = await taskService.update(id, req.body || {});
        res.json(updated);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    },

    async remove(req, res) {
      try {
        const id = Number(req.params.id);
        const result = await taskService.remove(id);
        res.json(result);
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    },
  };
}

module.exports = { createTaskController };

