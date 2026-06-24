import { RequestHandler } from 'express';

import { HttpError } from '../errors/http-error';
import { CreateTaskInput, isTaskStatus, UpdateTaskInput } from '../interfaces/task.interface';
import { taskService } from '../services/task.service';

type TaskParams = {
  id: string;
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const requireBodyObject = (body: unknown): Record<string, unknown> => {
  if (!isRecord(body)) {
    throw new HttpError(400, 'El cuerpo de la solicitud debe ser un objeto');
  }

  return body;
};

const parseTitle = (title: unknown): string => {
  const normalizedTitle = typeof title === 'string' ? title.trim() : '';

  if (!normalizedTitle) {
    throw new HttpError(400, 'El titulo es obligatorio');
  }

  return normalizedTitle;
};

const parseCreateTaskInput = (body: unknown): CreateTaskInput => {
  const requestBody = requireBodyObject(body);

  return {
    title: parseTitle(requestBody.title),
  };
};

const parseUpdateTaskInput = (body: unknown): UpdateTaskInput => {
  const requestBody = requireBodyObject(body);
  const status = requestBody.status;

  if (status !== undefined && !isTaskStatus(status)) {
    throw new HttpError(400, 'El estado debe ser pending o completed');
  }

  return {
    title: parseTitle(requestBody.title),
    status,
  };
};

export const getTasks: RequestHandler = (_req, res) => {
  res.json(taskService.findAll());
};

export const getTaskById: RequestHandler<TaskParams> = (req, res) => {
  res.json(taskService.findById(req.params.id));
};

export const createTask: RequestHandler = (req, res) => {
  const task = taskService.create(parseCreateTaskInput(req.body));

  res.status(201).json(task);
};

export const updateTask: RequestHandler<TaskParams> = (req, res) => {
  const task = taskService.update(req.params.id, parseUpdateTaskInput(req.body));

  res.json(task);
};

export const completeTask: RequestHandler<TaskParams> = (req, res) => {
  res.json(taskService.complete(req.params.id));
};

export const deleteTask: RequestHandler<TaskParams> = (req, res) => {
  taskService.remove(req.params.id);

  res.status(204).send();
};
