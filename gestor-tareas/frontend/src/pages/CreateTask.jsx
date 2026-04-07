// Crear tarea: selección múltiple días + formulario.
import { useState, useEffect, useRef, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import TaskForm from "../components/TaskForm";
import AssignTaskCalendar, { toYMD } from "../components/AssignTaskCalendar";
import { TaskContext } from "../context/TaskContext";

export default function CreateTask() {
  const navigate = useNavigate();
  const { selectedDate, errorMessage, clearError } = useContext(TaskContext);
  const [assignDates, setAssignDates] = useState([]);
  const didInit = useRef(false);

  useEffect(() => {
    if (didInit.current) return;
    if (selectedDate instanceof Date) {
      didInit.current = true;
      setAssignDates([toYMD(selectedDate)]);
    }
  }, [selectedDate]);

  const toggleAssignDay = (date) => {
    const ymd = toYMD(date);
    setAssignDates((prev) =>
      prev.includes(ymd) ? prev.filter((x) => x !== ymd) : [...prev, ymd].sort(),
    );
  };

  return (
    <div className="container" style={{ width: "100%", maxWidth: "500px", margin: "0 auto" }}>
      <Link to="/tareas">⬅ Volver</Link>

      <h1>ADSO: Crear Nueva Tarea</h1>
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

      <p style={{ fontSize: "0.9rem", color: "#555", textAlign: "center", marginBottom: "8px" }}>
        Pulsa uno o varios días en el calendario (otro clic sobre el mismo día lo quita). Los días que ya tienen tareas
        siguen resaltados en azul; el borde oscuro indica que están elegidos para esta nueva tarea.
      </p>

      <AssignTaskCalendar selectedDates={assignDates} onToggleDay={toggleAssignDay} />

      <TaskForm assignDates={assignDates} />

      <button type="button" onClick={() => navigate("/tareas")}>
        Ir a Tareas
      </button>
    </div>
  );
}
