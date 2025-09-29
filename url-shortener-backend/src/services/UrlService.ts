import { ValidationService } from './ValidationService';
import { MESSAGES } from '../constants';
import { env } from '../config/env';
import { IUrlRepository } from '../interfaces/IUrlRepository';
import {
  CreateUrlDTO,
  GetUrlsResponseDTO,
  UrlResponseDTO,
} from '../dtos/UrlDTO';

export class UrlService {
  constructor(private urlRepository: IUrlRepository) {}

  private generateShortCode(): string {
    return Math.random().toString(36).substring(2, 8);
  }

  async shortenUrl(dto: CreateUrlDTO, userId: string): Promise<UrlResponseDTO> {
    const validation = ValidationService.validateUrl(dto);
    if (validation.error) {
      return {
        success: false,
        message: validation.error.details.map((d) => d.message).join(', '),
      };
    }

    try {
      new URL(dto.originalUrl);
    } catch {
      return { success: false, message: MESSAGES.INVALID_URL };
    }

    const baseUrl = env.BASE_URL;
    if (!baseUrl) throw new Error('BASE_URL is not defined');

    let shortCode = this.generateShortCode();
    let shortUrl = `${baseUrl}/api/url/${shortCode}`;
    let attempts = 0;
    const maxAttempts = 5;

    while (
      (await this.urlRepository.findByShortUrl(shortUrl)) &&
      attempts < maxAttempts
    ) {
      shortCode = this.generateShortCode();
      shortUrl = `${baseUrl}/api/url/${shortCode}`;
      attempts++;
    }

    if (attempts >= maxAttempts) {
      return { success: false, message: 'Failed to generate unique short URL' };
    }

    const url = await this.urlRepository.create({
      userId,
      originalUrl: dto.originalUrl,
      shortUrl,
    });
    return { success: true, shortUrl: url.shortUrl };
  }

  async getMyUrls(
    userId: string,
    page: number,
    limit: number
  ): Promise<GetUrlsResponseDTO> {
    const urls = await this.urlRepository.find({ userId }, page, limit);
    const total = await this.urlRepository.count({ userId });
    return {
      success: true,
      urls: urls.map((url) => ({
        _id: url._id.toString(),
        originalUrl: url.originalUrl,
        shortUrl: url.shortUrl,
        createdAt: url.createdAt.toISOString(),
      })),
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(total / limit),
        totalUrls: total,
        limit,
      },
    };
  }

  async redirect(shortUrl: string): Promise<UrlResponseDTO> {
    const url = await this.urlRepository.findByShortUrl(shortUrl);
    if (!url) {
      return { success: false, message: MESSAGES.NOT_FOUND };
    }
    return { success: true, shortUrl: url.originalUrl };
  }
}
