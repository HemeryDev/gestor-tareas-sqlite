const { successResponse } = require("../utils/response");

function createTaskController(taskService) {
  return {
    async list(req, res, next) {
      try {
        const tasks = await taskService.list();
        successResponse(res, 200, tasks, "Tareas obtenidas exitosamente");
      } catch (err) {
        next(err);
      }
    },

    async create(req, res, next) {
      try {
        const created = await taskService.create(req.body);
        successResponse(res, 201, created, "Tarea creada exitosamente");
      } catch (err) {
        next(err);
      }
    },

    async update(req, res, next) {
      try {
        const { id } = req.params;
        const updated = await taskService.update(id, req.body);
        successResponse(res, 200, updated, "Tarea actualizada exitosamente");
      } catch (err) {
        next(err);
      }
    },

    async remove(req, res, next) {
      try {
        const { id } = req.params;
        const result = await taskService.remove(id);
        successResponse(res, 200, result, "Tarea eliminada exitosamente");
      } catch (err) {
        next(err);
      }
    },
  };
}

module.exports = { createTaskController };
