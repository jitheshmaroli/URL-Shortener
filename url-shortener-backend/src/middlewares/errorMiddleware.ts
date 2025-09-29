import { Request, Response } from 'express';
import { STATUS_CODES, MESSAGES } from '../constants';
import logger from '../utils/logger';

export const errorMiddleware = (error: Error, req: Request, res: Response) => {
  logger.error('Application error', {
    error: error.message,
    statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
    path: req.path,
    method: req.method,
  });
  res
    .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
    .json({ success: false, message: MESSAGES.SERVER_ERROR });
};
