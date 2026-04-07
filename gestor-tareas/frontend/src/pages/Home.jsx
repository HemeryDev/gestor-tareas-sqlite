// P inicio.

import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>
      {/* Título de bienvenida */}
      <h1>Bienvenido 🚀</h1>

      {/* Menú de navegación básico */}
      <nav>
        {/* <Link> de react-router funciona etiqueta <a>,sin reiniciar*/}
        <Link to="/tareas">Ver Tareas</Link><br />
        <Link to="/crear">Crear Tarea</Link>
      </nav>
    </div>
  );
}