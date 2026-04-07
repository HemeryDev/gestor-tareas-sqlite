const express = require("express");
const cors = require("cors");

const { createTaskService } = require("./services/taskService");
const { createTaskController } = require("./controllers/taskController");
const { createTaskRouter } = require("./routes/taskRoutes");
const { createTaskRepository } = require("./repositories/taskRepository");

function createApp({ dbPath }) {
  const app = express();

  app.use(cors());
  app.use(express.json());

  const taskRepository = createTaskRepository({ dbPath });
  const taskService = createTaskService(taskRepository);
  const taskController = createTaskController(taskService);
  const taskRouter = createTaskRouter(taskController);

  app.get("/api/health", (req, res) => res.json({ ok: true }));
  app.use("/api/tasks", taskRouter);

  return app;
}

module.exports = { createApp };

