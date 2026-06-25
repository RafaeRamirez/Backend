# Backend

API REST básica para administrar tareas con Express y TypeScript.

## Requisitos

- Node.js 22.5 o superior
- npm

## Instalación

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

`FRONTEND_URL` acepta varios orígenes separados por comas. Solo esos orígenes podrán consumir la API desde un navegador.

## Ejecución

Modo desarrollo con recarga automática:

```bash
npm run dev
```

Compilar TypeScript:

```bash
npm run build
```

Ejecutar la versión compilada:

```bash
npm start
```

Ejecutar pruebas:

```bash
npm test
```

## Persistencia

Las tareas se almacenan en una base de datos SQLite. Por defecto se crea el archivo `data/tasks.db`, por lo que la información se conserva al reiniciar el servidor. Puedes cambiar su ubicación con la variable `DATABASE_PATH`.

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

| Método | Ruta | Descripción |
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

`status` es opcional. Si se envía, debe ser `pending` o `completed`.

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

Códigos comunes:

- `400`: datos inválidos
- `404`: tarea o ruta no encontrada
- `500`: error interno del servidor

## AWS (conceptos básicos)

1. ¿Dónde desplegarías una aplicación Angular? En Amazon S3 estático o Amplify.
2. ¿Dónde desplegarías una API Node.js? En Amazon EC2, ECS o App Runner.
3. ¿Qué servicio utilizarías para almacenar archivos? Amazon S3.
4. ¿Qué es Amazon S3? Un servicio de almacenamiento de objetos escalable y seguro.
5. ¿Qué es Amazon EC2? Un servicio que ofrece máquinas virtuales en la nube.
6. ¿Cómo protegerías las variables de entorno en AWS? Usando AWS Systems Manager Parameter Store o Secrets Manager.

## Uso de IA

- Herramienta utilizada: GitHub Copilot.
- Ayuda durante el desarrollo: generación de estructura, refactorización y revisión de errores.
- Ejemplos de prompts:
  - "Crea una API REST en Express con CRUD para tareas y manejo de errores."
  - "Ayúdame a corregir el manejo de CORS y validaciones de entrada en TypeScript."
- Verificación del código: se validó con compilación y pruebas automáticas mediante `npm test`.
