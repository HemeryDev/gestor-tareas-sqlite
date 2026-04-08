const { PrismaClient } = require("@prisma/client");
const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
const path = require("path");
const ApiError = require("../utils/ApiError");

const DB_PATH = path.join(__dirname, "../../prisma/dev.db");

function createPrismaClient() {
  const adapter = new PrismaBetterSqlite3({ url: `file:${DB_PATH}` });
  return new PrismaClient({ adapter });
}

/**
 * Repositorio de Tareas — Operaciones CRUD contra SQLite vía Prisma ORM.
 */
function createTaskRepository() {
  const prisma = createPrismaClient();

  return {
    /**
     * Lista todas las tareas almacenadas en la base de datos.
     * @returns {Promise<Task[]>}
     */
    async list() {
      return prisma.task.findMany();
    },

    /**
     * Crea una nueva tarea.
     * @param {object} payload - Datos de la nueva tarea (validados previamente).
     * @returns {Promise<Task>}
     */
    async create(payload) {
      return prisma.task.create({
        data: {
          title: payload.title,
          description: payload.description || "",
          date: payload.date,
          time: payload.time,
          endTime: payload.endTime,
          completed: Boolean(payload.completed),
        },
      });
    },

    /**
     * Actualiza una tarea existente por ID.
     * @param {string} id - UUID de la tarea.
     * @param {object} payload - Campos a actualizar.
     * @returns {Promise<Task>}
     */
    async update(id, payload) {
      try {
        return await prisma.task.update({
          where: { id: String(id) },
          data: {
            ...(payload.title !== undefined && { title: payload.title }),
            ...(payload.description !== undefined && { description: payload.description }),
            ...(payload.date !== undefined && { date: payload.date }),
            ...(payload.time !== undefined && { time: payload.time }),
            ...(payload.endTime !== undefined && { endTime: payload.endTime }),
            ...(payload.completed !== undefined && { completed: Boolean(payload.completed) }),
          },
        });
      } catch (error) {
        if (error.code === "P2025") {
          throw new ApiError(404, "Tarea no encontrada");
        }
        throw error;
      }
    },

    /**
     * Elimina una tarea por ID. Lanza 404 si no existe.
     * @param {string} id - UUID de la tarea.
     * @returns {Promise<{message: string}>}
     */
    async remove(id) {
      try {
        await prisma.task.delete({ where: { id: String(id) } });
        return { message: "Tarea eliminada exitosamente" };
      } catch (error) {
        if (error.code === "P2025") {
          throw new ApiError(404, "Tarea no encontrada");
        }
        throw error;
      }
    },
  };
}

module.exports = { createTaskRepository };
