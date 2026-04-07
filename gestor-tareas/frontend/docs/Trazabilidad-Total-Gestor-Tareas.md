# Trazabilidad total — Gestor de tareas (React + Node.js)

**Proyecto:** `gestor-tareas-nuevo`  
**Fecha de documento:** abril 2026

---

## 1. Arquitectura y construcción

### Tipo de sistema: desacoplado (dos procesos)

- **Frontend:** SPA React (servidor de desarrollo habitual en puerto 3000). No persiste en disco.
- **Backend:** API Express en `server.js` (puerto **3001**), lectura/escritura de **`db.json`** mediante **`fs`** síncrono.

Es un **desacoplamiento por red**: el cliente usa `fetch` hacia `http://localhost:3001/...`. No es un único proceso monolítico; es un repositorio con **cliente y API separados** que deben ejecutarse a la vez.

### Estructura de carpetas

| Ubicación | Rol |
|-----------|-----|
| `src/index.js` | Monta React en el DOM y renderiza `App`. |
| `src/App.jsx` | Raíz de enrutado + `TaskProvider` envolviendo la aplicación. |
| `src/context/TaskContext.jsx` | Estado global: `tasks`, `selectedDate`, funciones que llaman a la API. |
| `src/pages/` | Vistas: `Home`, `Tasks`, `CreateTask`, `EditTask`. |
| `src/components/` | UI: calendarios, agenda, ítem de tarea, formulario. |
| `src/utils/taskTime.js` | Validación de horas inicio/fin (frontend). |
| `server.js` | API REST + `db.json`. |
| `db.json` | Persistencia (array `tasks`). |

### Jerarquía: componente padre raíz

1. **Raíz del árbol React:** `index.js` → `<App />`.
2. **Raíz de estado de tareas:** `TaskProvider` en `App.jsx` envuelve `BrowserRouter` y todas las rutas; cualquier descendiente puede usar `useContext(TaskContext)`.

**Rutas en `App.jsx`:** `/` → `Home`; `/tareas` → `Tasks`; `/crear` → `CreateTask`; `/editar/:id` → `EditTask`.

**Distribución:**

- `Tasks` es padre de `CalendarView` y `DailyAgenda`.
- `DailyAgenda` renderiza varios `TaskItem`.
- `CreateTask` es padre de `AssignTaskCalendar` y `TaskForm`.
- `TaskForm` consume `addTask` del contexto (no hay componente `TaskList`; el listado del día está en `DailyAgenda` + `TaskItem`).

---

## 2. Flujo paso a paso

### A) Ingreso de tarea

**Nota:** “La misma tarea en varios días” se implementa como **varias filas** en `tasks`, cada una con un **`date`** distinto; no hay un registro único multi-día.

| Paso | Descripción |
|------|-------------|
| 1 | `TaskForm`: `onChange` actualiza `title`, `description`, `timeStr`, `endTimeStr` (estado local). |
| 2 | `AssignTaskCalendar`: `onClickDay` → `toggleAssignDay` en `CreateTask` actualiza `assignDates` (estado local de la página). |
| 3 | `CreateTask` pasa `assignDates` a `TaskForm` por props. |
| 4 | Submit del formulario → `handleSubmit` en `TaskForm`: validaciones y `window.confirm`. |
| 5 | Por cada fecha: `addTask({ title, description, date, time, endTime })` desde `useContext(TaskContext)`. |
| 6 | `TaskContext.addTask`: `POST http://localhost:3001/tasks` con cuerpo JSON; al responder, `setTasks(prev => [...prev, data])`. |
| 7 | `server.js` `POST /tasks`: `readDB()` → `newTask = { id: Date.now(), ...req.body }` → `push` → `writeDB(data)` → `res.json(newTask)`. |
| 8 | Persistencia: `writeFileSync` sobre `db.json` con el array `tasks` completo serializado. |

**Camino de datos:** Formulario + calendario de creación → objeto plano → `addTask` → HTTP → Express → `db.json` → respuesta → `setTasks` → re-render.

### B) Edición

| Paso | Descripción |
|------|-------------|
| 1 | Ruta `/editar/:id`; `EditTask` lee `id` con `useParams`. |
| 2 | `useEffect` busca la tarea en `tasks` y rellena el estado del formulario. |
| 3 | Submit → `editTask(id, title, description, dateStr, timeStr, endTimeStr)`. |
| 4 | `PUT http://localhost:3001/tasks/:id` con fusión `...task` y campos nuevos. |
| 5 | Servidor: `map` fusiona documento → `writeDB` → `res.json(updated)`. |
| 6 | `setTasks` con la respuesta; `navigate("/tareas")`. |

### C) Finalización (checkbox)

| Paso | Descripción |
|------|-------------|
| 1 | `TaskItem`: `onChange` del checkbox → `onToggle(task)`. |
| 2 | `DailyAgenda` recibió `onToggle={toggleTask}` desde `Tasks`. |
| 3 | `toggleTask`: `PUT` con `{ ...task, completed: !task.completed }`. |
| 4 | Mismo flujo PUT que edición; `setTasks` actualiza la lista. |

### D) Eliminación

| Paso | Descripción |
|------|-------------|
| 1 | `TaskItem`: botón eliminar → `onDelete(task.id)`. |
| 2 | `deleteTask` en contexto: `DELETE /tasks/:id` → `setTasks(prev => prev.filter(...))`. |
| 3 | Servidor: `filter` del array → `writeDB`. No se borra otro archivo; solo se reescribe `db.json`. |

---

## 3. Lógica de fechas y calendario

- **Varios días al crear:** N llamadas a `addTask`, una por cada string `YYYY-MM-DD` en `assignDates`.
- **Filtrado en `/tareas`:** `CalendarView` actualiza `selectedDate` vía `setSelectedDate`. En `Tasks.jsx`: `selectedDateStr = selectedDate.toISOString().split('T')[0]` y `filteredTasks = tasks.filter(t => t.date === selectedDateStr)`.
- **Agenda por horas:** `DailyAgenda` filtra por prefijo de `task.time` (hora de **inicio**); `endTime` no repite la tarea en otras franjas.

**Zonas horarias:** `CalendarView` usa `toISOString()` en tiles; `AssignTaskCalendar` usa fecha local (`toYMD`). Puede haber desajuste de string entre vistas en algunos husos.

---

## 4. Latencia y rendimiento

- **HTTP:** latencia de ida y vuelta por cada `fetch`.
- **Servidor:** `readFileSync` / `writeFileSync` bloquean el hilo de Node durante E/S.
- **React:** funciones `async` + `await fetch` no bloquean el hilo del navegador; tras la respuesta, `setTasks` provoca re-render asíncrono.

---

## 5. Tabla de componentes

| Componente | Padre / Hijo | Función principal |
|--------------|--------------|-------------------|
| `TaskProvider` | Raíz de estado | `tasks`, `selectedDate`, `addTask`, `deleteTask`, `toggleTask`, `editTask` |
| `App` | Raíz de rutas | `BrowserRouter`, `Routes`, `TaskProvider` |
| `Tasks` | Ruta | Filtro por día; `CalendarView`, `DailyAgenda` |
| `CalendarView` | Hijo de `Tasks` | Día activo global; resalta días con tareas |
| `DailyAgenda` | Hijo de `Tasks` | Agrupa por hora; lista `TaskItem` |
| `TaskItem` | Hijo de `DailyAgenda` | UI de una tarea; toggle y delete |
| `CreateTask` | Ruta | `assignDates`; `AssignTaskCalendar` + `TaskForm` |
| `AssignTaskCalendar` | Hijo de `CreateTask` | Multi-selección de días |
| `TaskForm` | Hijo de `CreateTask` | Validación y `addTask` por cada día |
| `EditTask` | Ruta | Carga por `id`, `editTask` |

---

## Pregunta frecuente (examen)

**¿Cómo `TaskForm` “avisa” que hay una tarea nueva?**  
No sube un callback al padre para persistir. Obtiene **`addTask`** del **`TaskContext`** y la ejecuta tras confirmar; eso dispara **POST** y **`setTasks`**. La conexión es **contexto → API → estado global**.

---

*Documento generado para entrega académica / documentación del proyecto.*
