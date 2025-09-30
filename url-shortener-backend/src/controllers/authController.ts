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
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto: LoginDTO = req.body;
      const result = await this.authService.login(dto);
      if (result.success && result.token) {
        res.cookie('token', result.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
        });
      }

      res
        .status(result.success ? STATUS_CODES.OK : STATUS_CODES.BAD_REQUEST)
        .json({
          success: result.success,
          message: result.message,
        });
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.clearCookie('token');
      res
        .status(STATUS_CODES.OK)
        .json({ success: true, message: MESSAGES.LOGGED_OUT });
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
    } catch (error) {
      next(error);
    }
  }
}
