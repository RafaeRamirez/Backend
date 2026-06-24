# Backend

API REST basica para administrar tareas en memoria con Express y TypeScript.

## Requisitos

- Node.js 18 o superior
- npm

## Instalacion

```bash
npm install
```

Opcionalmente puedes crear un archivo `.env` a partir de `.env.template`:

```bash
PORT=3000
NODE_ENV=development
FRONTEND_URL=http://localhost:4200
DATABASE_PATH=./data/tasks.db
```

`FRONTEND_URL` acepta varios orígenes separados por comas. Solo esos orígenes podrán
consumir la API desde un navegador.

## Ejecucion

Modo desarrollo con recarga automatica:

```bash
npm run dev
```

Compilar TypeScript:

```bash
npm run build
```

Ejecutar la version compilada:

```bash
npm start
```

Ejecutar las pruebas CRUD:

```bash
npm test
```

## Persistencia

Las tareas se almacenan en una base de datos SQLite. Por defecto se crea el archivo
`data/tasks.db`, por lo que la información se conserva al reiniciar el servidor.
Puedes cambiar su ubicación con la variable `DATABASE_PATH`.

## Modelo de tarea

```json
{
  "id": "uuid",
  "title": "Comprar leche",
  "status": "pending"
}
```

Estados permitidos:

- `pending`
- `completed`

## Endpoints

| Metodo | Ruta | Descripcion |
| --- | --- | --- |
| GET | `/` | Health check del backend |
| GET | `/api/tasks` | Lista todas las tareas |
| GET | `/api/tasks/:id` | Consulta una tarea por ID |
| POST | `/api/tasks` | Crea una tarea |
| PUT | `/api/tasks/:id` | Actualiza una tarea |
| PATCH | `/api/tasks/:id/complete` | Marca una tarea como completada |
| DELETE | `/api/tasks/:id` | Elimina una tarea |

## Crear tarea

`POST /api/tasks`

Body:

```json
{
  "title": "Comprar leche"
}
```

Respuesta `201`:

```json
{
  "id": "uuid",
  "title": "Comprar leche",
  "status": "pending"
}
```

## Actualizar tarea

`PUT /api/tasks/:id`

Body:

```json
{
  "title": "Comprar leche y pan",
  "status": "completed"
}
```

`status` es opcional. Si se envia, debe ser `pending` o `completed`.

## Marcar completada

`PATCH /api/tasks/:id/complete`

Respuesta:

```json
{
  "id": "uuid",
  "title": "Comprar leche",
  "status": "completed"
}
```

## Eliminar tarea

`DELETE /api/tasks/:id`

Respuesta `204 No Content`.

## Errores

Las respuestas de error usan este formato:

```json
{
  "message": "Tarea no encontrada"
}
```

Codigos comunes:

- `400`: datos invalidos
- `404`: tarea o ruta no encontrada
- `500`: error interno del servidor
