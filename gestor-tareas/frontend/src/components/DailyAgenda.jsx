// Renderiza horas tareas asignadas.
import TaskItem from "./TaskItem";

export default function DailyAgenda({ tasks, onDelete, onToggle }) {
  
  if (tasks.length === 0) {
    return <p style={{ color: "gray", marginTop: "20px", fontStyle: "italic" }}>No hay tareas programadas para este día.</p>;
  }

  //  horas permitidas.
  const hours = Array.from({ length: 17 }, (_, i) => i + 4); 

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1px", marginTop: "20px", background: "#fcf8f8", border: "1px solid #faf6f6", borderRadius: "8px", overflow: "hidden" }}>
      {/* Iteramos bloque de hora */}
      {hours.map(hour => {
        
        const hourStr = hour.toString().padStart(2, '0');
        
        // Filtramos las tareas por Tasks.jsx
        const tasksInThisHour = tasks.filter(task => {
          if (!task.time) return false;
          return task.time.startsWith(hourStr + ":");
        });

        // Hora NO tiene elementos asignados, retornamos null
        if (tasksInThisHour.length === 0) return null;

        //  AM o PM
        const displayProps = hour < 12 ? `${hour}:00 AM` : 
                             hour === 12 ? `12:00 PM` : 
                             `${hour - 12}:00 PM`;

        return (
          <div key={hour} style={{ display: "flex", background: "white", padding: "10px", borderLeft: "4px solid #39a0ed" }}>
            {/* Columna de la Hora Izquierda */}
            <div style={{ width: "90px", color: "#444", fontWeight: "bold", paddingTop: "10px", borderRight: "1px solid #faf7f7", marginRight: "10px" }}>
              {displayProps}
            </div>
            
            {/* Casillero Tareas*/}
            <ul style={{ flex: 1, listStyle: "none", padding: 0, margin: 0 }}>
              {tasksInThisHour.map(task => (
                <TaskItem key={task.id} task={task} onDelete={onDelete} onToggle={onToggle} />
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
}
