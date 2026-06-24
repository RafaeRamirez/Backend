import 'dotenv/config';

import express from 'express';
import cors from 'cors';

import { HttpError } from './errors/http-error';
import { errorHandler, notFoundHandler } from './middlewares/error.middleware';
import taskRouter from './routes/task.routes';

const app = express();
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:4200')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new HttpError(403, `Origen no permitido por CORS: ${origin}`));
    },
  }),
);
app.use(express.json());

app.get('/', (_req, res) => {
  res.json({ message: 'Backend listo' });
});

app.use('/api/tasks', taskRouter);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;
