import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';
import { AuthRepository } from '../repositories/AuthRepository';
import User from '../models/User';
import { RegisterDTO, LoginDTO } from '../dtos/AuthDTO';
import { MESSAGES, STATUS_CODES } from '../constants';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService(new AuthRepository(User));
  }

  async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const dto: RegisterDTO = req.body;
      const result = await this.authService.register(dto);
      res
        .status(
          result.success ? STATUS_CODES.CREATED : STATUS_CODES.BAD_REQUEST
        )
        .json(result);
      return;
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto: LoginDTO = req.body;
      const result = await this.authService.login(dto);
      if (result.success && result.token && result.refreshToken) {
        res.cookie('token', result.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
        });
        res.cookie('refreshToken', result.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
      }

      res
        .status(result.success ? STATUS_CODES.OK : STATUS_CODES.BAD_REQUEST)
        .json({
          success: result.success,
          message: result.message,
        });
      return;
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.clearCookie('token');
      res.clearCookie('refreshToken');
      res
        .status(STATUS_CODES.OK)
        .json({ success: true, message: MESSAGES.LOGGED_OUT });
      return;
    } catch (error) {
      next(error);
    }
  }

  async checkAuth(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const token = req.cookies.token;
      if (!token) {
        res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json({ success: false, message: MESSAGES.NO_TOKEN });
        return;
      }
      const result = await this.authService.checkAuth(token);
      res
        .status(result.success ? STATUS_CODES.OK : STATUS_CODES.UNAUTHORIZED)
        .json(result);
      return;
    } catch (error) {
      next(error);
    }
  }

  async refresh(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const refreshToken = req.cookies.refreshToken;
      if (!refreshToken) {
        res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json({ success: false, message: MESSAGES.NO_TOKEN });
        return;
      }
      const result = await this.authService.refresh(refreshToken);
      if (result.success && result.token && result.refreshToken) {
        res.cookie('token', result.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
        });
        res.cookie('refreshToken', result.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'strict',
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });
        res
          .status(STATUS_CODES.OK)
          .json({ success: true, message: 'Token refreshed' });
        return;
      } else {
        res.clearCookie('token');
        res.clearCookie('refreshToken');
        res.status(STATUS_CODES.UNAUTHORIZED).json({
          success: false,
          message: result.message || MESSAGES.UNAUTHORIZED,
        });
        return;
      }
    } catch (error) {
      next(error);
    }
  }
}
