// edición actualizar tarea  hora agendada.
import { useContext, useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { TaskContext } from "../context/TaskContext";
import { isValidTaskHour, isEndAfterStart, defaultEndFromStart } from "../utils/taskTime";

export default function EditTask() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { tasks, editTask, errorMessage, clearError } = useContext(TaskContext);
  
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dateStr, setDateStr] = useState("");
  const [timeStr, setTimeStr] = useState("06:00");
  const [endTimeStr, setEndTimeStr] = useState("09:00");

  useEffect(() => {
    const taskToEdit = tasks.find(t => t.id === parseInt(id));
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setDescription(taskToEdit.description || "");
      setDateStr(taskToEdit.date || "");
      const start = taskToEdit.time || "06:00";
      setTimeStr(start);
      setEndTimeStr(taskToEdit.endTime || defaultEndFromStart(start));
    }
  }, [id, tasks]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return alert("El título no puede estar vacío");
    
    if (!isValidTaskHour(timeStr) || !isValidTaskHour(endTimeStr)) {
      return alert("Las horas de inicio y fin deben estar entre las 04:00 y las 20:59.");
    }

    if (!isEndAfterStart(timeStr, endTimeStr)) {
      return alert("La hora de fin debe ser posterior a la hora de inicio.");
    }

    const ok = await editTask(parseInt(id), title, description, dateStr, timeStr, endTimeStr);
    if (ok) navigate("/tareas");
  };

  return (
    <div className="container" style={{ width: "100%", maxWidth: "500px", margin: "0 auto" }}>
      <Link to="/tareas">⬅ Volver al Listado</Link>
      <br/><br/>
      <h1>Editar Tarea Agendada</h1>
      {errorMessage ? (
        <div
          style={{
            background: "#fde8e8",
            border: "1px solid #f5c2c7",
            color: "#8a1c2b",
            borderRadius: "8px",
            padding: "10px 12px",
            marginBottom: "12px",
            display: "flex",
            justifyContent: "space-between",
            gap: "10px",
            alignItems: "center",
          }}
        >
          <span>{errorMessage}</span>
          <button type="button" onClick={clearError} style={{ width: "auto", padding: "6px 10px" }}>
            Cerrar
          </button>
        </div>
      ) : null}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Título de la tarea"
          required
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Descripción de la tarea (opcional)"
          rows={4}
          style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc", fontFamily: "inherit" }}
        />
        <input
          type="date"
          value={dateStr}
          onChange={(e) => setDateStr(e.target.value)}
          required
        />
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <label style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1, minWidth: "120px" }}>
            <span style={{ fontSize: "0.85rem", color: "#666" }}>Hora de inicio</span>
            <input
              type="time"
              value={timeStr}
              min="04:00"
              max="20:59"
              onChange={(e) => setTimeStr(e.target.value)}
              required
              title="Horario permitido: 4:00 a 20:59"
            />
          </label>
          <label style={{ display: "flex", flexDirection: "column", gap: "4px", flex: 1, minWidth: "120px" }}>
            <span style={{ fontSize: "0.85rem", color: "#666" }}>Hora de fin</span>
            <input
              type="time"
              value={endTimeStr}
              min="04:00"
              max="20:59"
              onChange={(e) => setEndTimeStr(e.target.value)}
              required
              title="Debe ser posterior al inicio"
            />
          </label>
        </div>
        <button style={{ marginTop: "10px" }}>Guardar Cambios</button>
      </form>
    </div>
  );
}
