# API Documentación - Gestor de Tareas

## Base URL
Local: `http://localhost:4000/api/tasks`

## Endpoints

### 1. Obtener todas las tareas
- **Método**: `GET`
- **Ruta**: `/`
- **Descripción**: Retorna un array con todas las tareas agendadas.

#### Ejemplo de Respuesta (200 OK)
```json
{
  "success": true,
  "message": "Tareas obtenidas exitosamente",
  "data": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "title": "Aprender React",
      "description": "Completar la sección de hooks",
      "date": "2026-04-08",
      "time": "15:00",
      "endTime": "16:00",
      "completed": false
    }
  ]
}
```

### 2. Crear una tarea
- **Método**: `POST`
- **Ruta**: `/`
- **Descripción**: Retorna el objeto de la tarea creada tras validar la estructura.
- **Requiere**: `title` (string), `date` (YYYY-MM-DD), `time` (HH:MM), `endTime` (HH:MM).

#### Ejemplo de Body
```json
{
    "title": "Aprender React",
    "description": "Completar la sección de hooks",
    "date": "2026-04-08",
    "time": "15:00",
    "endTime": "16:00"
}
```

#### Ejemplo de Respuesta (201 Created)
```json
{
  "success": true,
  "message": "Tarea creada exitosamente",
  "data": { ... }
}
```

### 3. Actualizar una tarea
- **Método**: `PUT`
- **Ruta**: `/:id`
- **Descripción**: Actualiza cualquier campo de una tarea dada su UUID.

#### Ejemplo de Respuesta (200 OK o 404 Not Found)
```json
// Si no existe:
{
  "success": false,
  "error": "Tarea no encontrada"
}
```

### 4. Eliminar una tarea
- **Método**: `DELETE`
- **Ruta**: `/:id`
- **Descripción**: Elimina una tarea basándose en su UUID. Lanza un 404 Not Found si no existe la tarea.

## Validaciones y Errores

Todos los fallos retornan una estructura estandarizada gracias a nuestro Middleware central de error:
```json
{
  "success": false,
  "error": "Mensaje describiendo el error exacto (ej. Error de validación: El título es requerido)"
}
```
