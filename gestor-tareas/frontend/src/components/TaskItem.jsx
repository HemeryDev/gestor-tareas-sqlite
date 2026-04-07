// Componente de UI que representa UNA sola tarea.
import { Link } from "react-router-dom";

// Objeto "task" individual y las funciones "onDelete" y "onToggle"
export default function TaskItem({ task, onDelete, onToggle }) {
  return (
    <li style={{ 
      display: "flex", 
      flexDirection: "column", 
      gap: "5px", 
      padding: "10px", 
      borderBottom: "1px solid #ddd",
      opacity: task.completed ? 0.6 : 1,
      background: task.completed ? "#f9f9f9" : "transparent"
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        
        {/* Lado izquierdo: Checkbox y Textos */}
        <div style={{ display: "flex", gap: "10px", alignItems: "flex-start", overflow: "hidden" }}>
          
          {/* Checkbox */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "5px", minWidth: "60px" }}>
            <input 
              type="checkbox"
              checked={task.completed}
              onChange={() => onToggle(task)}
              style={{ transform: "scale(1.3)", marginTop: "5px", cursor: "pointer" }}
              title="Marcar como completada"
            />
            <span style={{ 
              fontSize: "0.65rem", 
              color: task.completed ? "#28a745" : "#fd7e14", 
              fontWeight: "bold",
              textTransform: "uppercase"
            }}>
              {task.completed ? "Realizada" : "Pendiente"}
            </span>
          </div>

          {/* Columna de Textos */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {/* Título */}
            <strong style={{ 
              textDecoration: task.completed ? "line-through" : "none", 
              wordBreak: "break-word"
            }}>
              {task.title}
            </strong>
            {task.time && (
              <span
                style={{
                  fontSize: "0.85rem",
                  color: "#1f3c88",
                  fontWeight: 600,
                  marginTop: "4px",
                }}
              >
                {task.endTime ? `${task.time} – ${task.endTime}` : task.time}
              </span>
            )}
             {/* Renderizado para la Descripción */}
            {task.description && (
              <p style={{ 
                margin: "4px 0 0 0", 
                fontSize: "0.9rem", 
                color: "#555",
                textDecoration: task.completed ? "line-through" : "none",
                wordBreak: "break-word"
              }}>
                {task.description}
              </p>
            )}
          </div>
        </div>
        
        {/* Lado derecho: Interacciones (Editar/Borrar) */}
        <div style={{ marginLeft: "10px", whiteSpace: "nowrap" }}>
          {/* Enlace de Edición, lleva ruta dinámica combinando'/editar/'ID tarea */}
          <Link to={`/editar/${task.id}`} style={{ marginRight: "10px", textDecoration: "none" }}> ✏️ </Link>
          
          {/* Botón de eliminación. función onDelete(id) enviando el ID correcto */}
          <button 
            onClick={() => onDelete(task.id)} 
            style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.2rem" }}
            title="Eliminar tarea"
          >
            ❌
          </button>
        </div>
      </div>
    </li>
  );
}