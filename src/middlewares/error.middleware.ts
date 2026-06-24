import { ErrorRequestHandler, RequestHandler } from 'express';

import { HttpError } from '../errors/http-error';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const getStatusCode = (error: unknown): number => {
  if (error instanceof HttpError) {
    return error.statusCode;
  }

  if (isRecord(error) && typeof error.status === 'number') {
    return error.status;
  }

  if (isRecord(error) && typeof error.statusCode === 'number') {
    return error.statusCode;
  }

  return 500;
};

const getErrorMessage = (error: unknown, statusCode: number): string => {
  if (statusCode >= 500) {
    return 'Error interno del servidor';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Solicitud invalida';
};

export const notFoundHandler: RequestHandler = (req, _res, next) => {
  next(new HttpError(404, `Ruta no encontrada: ${req.method} ${req.originalUrl}`));
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  const statusCode = getStatusCode(error);

  res.status(statusCode).json({
    message: getErrorMessage(error, statusCode),
  });
};
