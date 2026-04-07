// usa los días marcados en AssignTaskCalendar.
import { useState, useContext } from "react";
import { TaskContext } from "../context/TaskContext";
import { isValidTaskHour, isEndAfterStart } from "../utils/taskTime";

export default function TaskForm({ assignDates = [] }) {
  const { addTask } = useContext(TaskContext);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [timeStr, setTimeStr] = useState("06:00");
  const [endTimeStr, setEndTimeStr] = useState("07:00");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return alert("El título no puede estar vacío");

    if (!assignDates.length) {
      return alert("Selecciona al menos un día en el calendario (puedes elegir varios).");
    }

    if (!isValidTaskHour(timeStr) || !isValidTaskHour(endTimeStr)) {
      return alert("Las horas de inicio y fin deben estar entre las 04:00 y las 20:59.");
    }

    if (!isEndAfterStart(timeStr, endTimeStr)) {
      return alert("La hora de fin debe ser posterior a la hora de inicio.");
    }

    const n = assignDates.length;
    const fechasTexto = assignDates.join(", ");
    const horario = `${timeStr} – ${endTimeStr}`;
    const mensaje =
      n === 1
        ? `¿Crear la tarea el ${fechasTexto} de ${horario}?\n\nAceptar para guardar · Cancelar para volver al formulario.`
        : `¿Crear la misma tarea en ${n} días?\n${fechasTexto}\n\nHorario: ${horario}\n\nAceptar para guardar · Cancelar para volver al formulario.`;

    if (!window.confirm(mensaje)) return;

    try {
      setIsSubmitting(true);
      for (const date of assignDates) {
        await addTask({ title, description, date, time: timeStr, endTime: endTimeStr });
      }
    } catch {
      alert("No se pudieron guardar todas las tareas. Revisa el mensaje de error en pantalla.");
      return;
    } finally {
      setIsSubmitting(false);
    }

    setTitle("");
    setDescription("");
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
      <p
        style={{
          fontSize: "0.9rem",
          color: "#444",
          background: "#f0f4fa",
          padding: "10px 12px",
          borderRadius: "8px",
          border: "1px solid #dde4f0",
        }}
      >
        <strong>Días marcados para esta tarea:</strong> {assignDates.length ? assignDates.join(", ") : "ninguno — pulsa días en el calendario"}
      </p>

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
        rows={3}
        style={{ padding: "10px", borderRadius: "6px", border: "1px solid #ccc", fontFamily: "inherit" }}
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
            title="Debe ser posterior al inicio; máximo 20:59"
          />
        </label>
      </div>
      <p style={{ fontSize: "0.8rem", color: "#777", margin: 0 }}>
        El mismo horario se aplica a todos los días marcados en el calendario.
      </p>

      <button type="submit" style={{ width: "100%" }} disabled={isSubmitting}>
        {isSubmitting ? "Guardando..." : "Agregar"}
      </button>
    </form>
  );
}
