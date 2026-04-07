// renderizar lista iterativa tareas.
// Recibe la lista "tasks" (que fue filtrada en la página padre) y la función "onDelete" como propiedades ("props").
import TaskItem from "./TaskItem";

export default function TaskList({ tasks, onDelete, onToggle }) {
  return (
    <ul>
      {/* Iteramos "mapeando" el arreglo de tareas. Cada iteración devuelve un componente visual <TaskItem /> */}
      {tasks.map(task => (
        <TaskItem
          key={task.id}     // Una prop para React lista
          task={task}       // prop, Item extraiga su título y descripción
          onDelete={onDelete} // función igual (el nieto avisará al padre)
          onToggle={onToggle}
        />
      ))}
    </ul>
  );
}