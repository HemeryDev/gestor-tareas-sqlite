const { z } = require("zod");

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; // HH:MM

const createTaskSchema = z.object({
  title: z.string({ required_error: "El título es requerido" }).trim().min(1, "El título no puede estar vacío"),
  description: z.string().optional().default(""),
  date: z.string({ required_error: "La fecha es requerida" }).regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido (YYYY-MM-DD)"),
  time: z.string({ required_error: "La hora de inicio es requerida" }).regex(timeRegex, "Formato de tiempo inválido (HH:MM)"),
  endTime: z.string({ required_error: "La hora de fin es requerida" }).regex(timeRegex, "Formato de tiempo inválido (HH:MM)"),
  completed: z.boolean().optional().default(false)
});

const updateTaskSchema = z.object({
  title: z.string().trim().min(1, "El título no puede estar vacío").optional(),
  description: z.string().optional(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Formato de fecha inválido (YYYY-MM-DD)").optional(),
  time: z.string().regex(timeRegex, "Formato de tiempo inválido (HH:MM)").optional(),
  endTime: z.string().regex(timeRegex, "Formato de tiempo inválido (HH:MM)").optional(),
  completed: z.boolean().optional()
});

module.exports = {
  createTaskSchema,
  updateTaskSchema
};
