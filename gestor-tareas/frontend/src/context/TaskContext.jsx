import { createContext, useState, useEffect } from "react";

export const TaskContext = createContext();

const API_BASE = "/api/tasks";

const parseErrorMessage = async (res) => {
  try {
    const data = await res.json();
    if (data?.error) return data.error;
  } catch {
    // Si no llega JSON, dejamos mensaje por defecto.
  }
  return `Error HTTP ${res.status}`;
};

const requestJson = async (url, options) => {
  const res = await fetch(url, options);
  if (!res.ok) {
    throw new Error(await parseErrorMessage(res));
  }
  return res.json();
};

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const clearError = () => setErrorMessage("");

  // 🔥 CARGAR DESDE API
  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoading(true);
      clearError();
      try {
        const data = await requestJson(API_BASE);
        setTasks(data);
      } catch (err) {
        setErrorMessage(`No se pudieron cargar las tareas. ${err.message}`);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTasks();
  }, []);

  // 🔥 CREAR
  const addTask = async (task) => {
    clearError();
    try {
      const data = await requestJson(API_BASE, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...task,
          completed: false
        })
      });
      setTasks(prev => [...prev, data]);
      return data;
    } catch (err) {
      setErrorMessage(`No se pudo crear la tarea. ${err.message}`);
      throw err;
    }
  };

  // 🔥 ELIMINAR
  const deleteTask = async (id) => {
    clearError();
    try {
      await requestJson(`${API_BASE}/${id}`, {
        method: "DELETE"
      });
      setTasks(prev => prev.filter(t => t.id !== id));
      return true;
    } catch (err) {
      setErrorMessage(`No se pudo eliminar la tarea. ${err.message}`);
      return false;
    }
  };

  // EDITAR
  const editTask = async (id, newTitle, newDescription, newDate, newTime, newEndTime) => {
    const task = tasks.find(t => t.id === id);
    clearError();
    try {
      const updated = await requestJson(`${API_BASE}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          ...task,
          title: newTitle,
          description: newDescription,
          date: newDate || task.date,
          time: newTime || task.time,
          endTime: newEndTime ?? task.endTime
        })
      });
      setTasks(prev =>
        prev.map(t => t.id === id ? updated : t)
      );
      return true;
    } catch (err) {
      setErrorMessage(`No se pudo editar la tarea. ${err.message}`);
      return false;
    }
  };

  // COMPLETED
  const toggleTask = async (task) => {
    const updatedTask = {
      ...task,
      completed: !task.completed
    };
    clearError();
    try {
      const data = await requestJson(`${API_BASE}/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(updatedTask)
      });
      setTasks(prev => prev.map(t => t.id === task.id ? data : t));
      return true;
    } catch (err) {
      setErrorMessage(`No se pudo actualizar el estado de la tarea. ${err.message}`);
      return false;
    }
  };

  return (
    <TaskContext.Provider value={{
      tasks,
      selectedDate,
      setSelectedDate,
      isLoading,
      errorMessage,
      clearError,
      addTask,
      deleteTask,
      toggleTask,
      editTask
    }}>
      {children}
    </TaskContext.Provider>
  );
};