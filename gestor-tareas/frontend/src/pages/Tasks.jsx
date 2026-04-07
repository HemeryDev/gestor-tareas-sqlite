// P listado de tareas.

import { Link } from "react-router-dom";
import { useContext } from "react";
import DailyAgenda from "../components/DailyAgenda";
import CalendarView from "../components/CalendarView";
import { TaskContext } from "../context/TaskContext";

export default function Tasks() {
  const { tasks, deleteTask, toggleTask, selectedDate, isLoading, errorMessage, clearError } = useContext(TaskContext);

  // Convertimos el objeto Date de selectedDate a un string 'YYYY-MM-DD'
  const selectedDateStr = selectedDate ? selectedDate.toISOString().split('T')[0] : "";

 
  const filteredTasks = tasks.filter(t => t.date === selectedDateStr);

  return (
    <div className="container" style={{ width: "100%", maxWidth: "500px" }}>
      <h1>ADSO:Gestor de Tareas</h1>
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
      {isLoading ? (
        <p style={{ color: "#555", marginBottom: "12px" }}>Cargando tareas...</p>
      ) : null}

      {/* Componente del Calendario Visual */}
      <CalendarView />

      <h2 style={{ fontSize: "1.2rem", textAlign: "left" }}>
        Tareas para {selectedDateStr}:
      </h2>

      <div style={{ margin: "15px 0" }}>
        {/* Botón para navegar a la ruta de Crear Tarea */}
        <Link to="/crear" style={{
          background: "#1f3c88", color: "white", padding: "10px",
          borderRadius: "6px", display: "inline-block"
        }}>
          ➕ Nueva tarea para este día
        </Link>
      </div>

      <DailyAgenda tasks={filteredTasks} onDelete={deleteTask} onToggle={toggleTask} />
    </div>
  );
}