const request = require("supertest");
const { createApp } = require("../src/app");
const { PrismaClient } = require("@prisma/client");
const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
const path = require("path");

const DB_PATH = path.join(__dirname, "../prisma/dev.db");

let app;
let prisma;

describe("Tasks API", () => {
  beforeAll(async () => {
    const adapter = new PrismaBetterSqlite3({ url: `file:${DB_PATH}` });
    prisma = new PrismaClient({ adapter });
    // Limpiar tabla antes de las pruebas
    await prisma.task.deleteMany({});
    app = createApp();
  });

  afterAll(async () => {
    // Limpiar tabla al finalizar
    await prisma.task.deleteMany({});
    await prisma.$disconnect();
  });

  let createdTaskId;

  it("Debe devolver 200 y array vacío al inicio", async () => {
    const res = await request(app).get("/api/tasks");
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toEqual([]);
  });

  it("Debe devolver 400 si se intenta crear con payload inválido", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .send({
        title: "", // vacío — debe fallar validación
        description: "Test",
      });
    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toContain("Error de validación");
  });

  it("Debe crear una tarea correctamente y retornar 201", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .send({
        title: "Tarea de prueba",
        description: "Test description",
        date: "2026-05-10",
        time: "10:00",
        endTime: "11:00"
      });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty("id");
    expect(res.body.data.title).toBe("Tarea de prueba");
    createdTaskId = res.body.data.id;
  });

  it("Debe actualizar una tarea existente y retornar 200", async () => {
    const res = await request(app)
      .put(`/api/tasks/${createdTaskId}`)
      .send({
        title: "Tarea actualizada",
        description: "Test description"
      });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.title).toBe("Tarea actualizada");
  });

  it("Debe devolver 404 al intentar eliminar un ID inexistente", async () => {
    const res = await request(app).delete("/api/tasks/id-que-no-existe");
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });

  it("Debe eliminar la tarea y retornar 200", async () => {
    const res = await request(app).delete(`/api/tasks/${createdTaskId}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
  });
});
