import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';
import { AuthRepository } from '../repositories/AuthRepository';
import User from '../models/User';
import { RegisterDTO, LoginDTO } from '../dtos/AuthDTO';
import { STATUS_CODES } from '../constants';
import logger from '../utils/logger';

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
      logger.info('User registration attempt', { email: dto.email });
      res
        .status(
          result.success ? STATUS_CODES.CREATED : STATUS_CODES.BAD_REQUEST
        )
        .json(result);
    } catch (error) {
      logger.error('Registration error', {
        error: (error as Error).message,
        email: req.body.email,
      });
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto: LoginDTO = req.body;
      const result = await this.authService.login(dto);
      if (result.success && result.token) {
        logger.info('User logged in successfully', { email: dto.email });
        res.cookie('token', result.token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
        });
      } else {
        logger.warn('Login failed', { email: dto.email });
      }
      res
        .status(result.success ? STATUS_CODES.OK : STATUS_CODES.BAD_REQUEST)
        .json({
          success: result.success,
          message: result.message,
        });
    } catch (error) {
      logger.error('Login error', {
        error: (error as Error).message,
        email: req.body.email,
      });
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      res.clearCookie('token');
      logger.info('User logged out successfully');
      res
        .status(STATUS_CODES.OK)
        .json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
      logger.error('Logout error', { error: (error as Error).message });
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
        logger.warn('No token provided for auth check');
        res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json({ success: false, message: 'No token provided' });
        return;
      }
      const result = await this.authService.checkAuth(token);
      logger.debug('Token verification attempt', {
        token: token.slice(0, 10) + '...',
      });
      res
        .status(result.success ? STATUS_CODES.OK : STATUS_CODES.UNAUTHORIZED)
        .json(result);
    } catch (error) {
      logger.error('Auth check error', { error: (error as Error).message });
      next(error);
    }
  }
}
