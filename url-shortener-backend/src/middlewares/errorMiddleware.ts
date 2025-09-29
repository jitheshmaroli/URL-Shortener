import { Request, Response, NextFunction } from 'express';
import { STATUS_CODES, MESSAGES } from '../constants';
import logger from '../utils/logger';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number
  ) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorMiddleware = (
  error: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode =
    error instanceof AppError
      ? error.statusCode
      : STATUS_CODES.INTERNAL_SERVER_ERROR;
  const message =
    error instanceof AppError ? error.message : MESSAGES.SERVER_ERROR;

  logger.error('Application error', {
    error: error.message,
    statusCode,
    path: req.path,
    method: req.method,
    stack: error.stack,
  });

  res.status(statusCode).json({ success: false, message });
  next();
};
