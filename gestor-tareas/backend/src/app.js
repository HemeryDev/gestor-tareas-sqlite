const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const { createTaskService } = require("./services/taskService");
const { createTaskController } = require("./controllers/taskController");
const { createTaskRouter } = require("./routes/taskRoutes");
const { createTaskRepository } = require("./repositories/taskRepository");
const errorHandler = require("./middlewares/errorHandler");

function createApp() {
  const app = express();

  // Logging and Parse Middlewares
  app.use(morgan("dev"));
  app.use(cors());
  app.use(express.json());

  const taskRepository = createTaskRepository();
  const taskService = createTaskService(taskRepository);
  const taskController = createTaskController(taskService);
  const taskRouter = createTaskRouter(taskController);

  app.get("/api/health", (req, res) => res.json({ ok: true }));
  app.use("/api/tasks", taskRouter);

  // Global Error Handler Middleware
  app.use(errorHandler);

  return app;
}

module.exports = { createApp };
