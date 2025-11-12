import { Request, Response, NextFunction } from 'express';
import { UrlService } from '../services/UrlService';
import { UrlRepository } from '../repositories/UrlRepository';
import Url from '../models/Url';
import { AuthRequest } from '../middlewares/authMiddleware';
import { MESSAGES, STATUS_CODES } from '../constants';
import { CreateUrlDTO, DeleteUrlDTO } from '../dtos/UrlDTO';

export class UrlController {
  private urlService: UrlService;

  constructor() {
    this.urlService = new UrlService(new UrlRepository(Url));
  }

  async shortenUrl(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user?.userId) {
        res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json({ success: false, message: MESSAGES.UNAUTHORIZED });
        return;
      }
      const dto: CreateUrlDTO = req.body;
      const result = await this.urlService.shortenUrl(dto, req.user.userId);
      res
        .status(result.success ? STATUS_CODES.OK : STATUS_CODES.BAD_REQUEST)
        .json(result);
    } catch (error) {
      next(error);
    }
  }

  async getMyUrls(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user?.userId) {
        res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json({ success: false, message: MESSAGES.UNAUTHORIZED });
        return;
      }
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 5;
      const result = await this.urlService.getMyUrls(
        req.user.userId,
        page,
        limit
      );
      res
        .status(result.success ? STATUS_CODES.OK : STATUS_CODES.BAD_REQUEST)
        .json(result);
    } catch (error) {
      next(error);
    }
  }

  async redirect(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { shortCode } = req.params;
      const result = await this.urlService.redirect(
        `${process.env.BASE_URL}/api/url/${shortCode}`
      );
      if (result.success && result.shortUrl) {
        res.redirect(result.shortUrl);
      } else {
        res.status(STATUS_CODES.NOT_FOUND).json(result);
      }
    } catch (error) {
      next(error);
    }
  }

  async deleteUrl(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user?.userId) {
        res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json({ success: false, message: MESSAGES.UNAUTHORIZED });
        return;
      }
      const { id } = req.params;
      const dto: DeleteUrlDTO = { urlId: id };
      const result = await this.urlService.deleteUrl(dto, req.user.userId);
      res
        .status(result.success ? STATUS_CODES.OK : STATUS_CODES.BAD_REQUEST)
        .json(result);
    } catch (error) {
      next(error);
    }
  }
}
