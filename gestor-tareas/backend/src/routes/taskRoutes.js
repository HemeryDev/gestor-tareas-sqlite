const express = require("express");
const validate = require("../middlewares/validate");
const { createTaskSchema, updateTaskSchema } = require("../schemas/taskSchema");

function createTaskRouter(controller) {
  const router = express.Router();

  router.get("/", controller.list);
  router.post("/", validate(createTaskSchema), controller.create);
  router.put("/:id", validate(updateTaskSchema), controller.update);
  router.delete("/:id", controller.remove);

  return router;
}

module.exports = { createTaskRouter };
