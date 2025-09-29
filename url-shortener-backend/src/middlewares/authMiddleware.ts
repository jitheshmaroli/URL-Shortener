import { Request, Response, NextFunction } from 'express';
import { TokenService } from '../services/TokenService';
import { STATUS_CODES, MESSAGES } from '../constants';

export interface AuthRequest extends Request {
  user?: { userId: string };
}

export const authMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies.token;
  if (!token) {
    return res
      .status(STATUS_CODES.UNAUTHORIZED)
      .json({ success: false, message: MESSAGES.UNAUTHORIZED });
  }

  const decoded = TokenService.verifyToken(token);
  if (!decoded) {
    return res
      .status(STATUS_CODES.UNAUTHORIZED)
      .json({ success: false, message: MESSAGES.UNAUTHORIZED });
  }

  req.user = { userId: decoded.userId };
  next();
};
