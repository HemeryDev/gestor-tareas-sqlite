// Componente enrutador principal
// Coordina componente de página  dependiendo URL actual.

import { BrowserRouter, Routes, Route } from "react-router-dom"; // Librerías que habilitan la navegación SPA (Single Page Application)
import { TaskProvider } from "./context/TaskContext"; // Proveedor del estado global de las tareas

// Dist pá. 
import Home from "./pages/Home";
import Tasks from "./pages/Tasks";
import CreateTask from "./pages/CreateTask";
import EditTask from "./pages/EditTask";

function App() {
  return (
    
    // compt y modf list tr.
    <TaskProvider>
      {/* per 👀 sin 🔄*/}
      <BrowserRouter>
        {/* switch URL */}
        <Routes>

          {/*  */}
          <Route path="/" element={<Home />} />

          {/*lista general por dia*/}
          <Route path="/tareas" element={<Tasks />} />

          {/*creación nueva tarea */}
          <Route path="/crear" element={<CreateTask />} />

          {/* edición. El ':id'*/}
          <Route path="/editar/:id" element={<EditTask />} />

        </Routes>
      </BrowserRouter>
    </TaskProvider>
  );
}

export default App;