# Gestor de Tareas - Estructura Profesional Frontend/Backend

Proyecto organizado por responsabilidades:

- `src/`, `public/`, `package.json` raíz: **Frontend (React)**.
- `backend/server.js`, `backend/db.json`, `backend/package.json`: **Backend (Node.js + Express)**.

## Estructura

```text
gestor-tareas-nuevo/
├── backend/
│   ├── server.js
│   ├── db.json
│   └── package.json
├── public/
├── src/
├── package.json
└── server.js (compatibilidad; redirige a backend/server.js)
```

## Ejecución

### Frontend

```bash
npm run start:frontend
```

o

```bash
npm start
```

### Backend

```bash
npm run start:backend
```

También puedes entrar a `backend/` y ejecutar:

```bash
npm start
```

## API

- Base URL: `http://localhost:3001`
- Endpoints:
  - `GET /tasks`
  - `POST /tasks`
  - `PUT /tasks/:id`
  - `DELETE /tasks/:id`
