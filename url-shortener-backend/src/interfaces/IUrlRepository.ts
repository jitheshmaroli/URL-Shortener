import { IUrl } from '../models/Url';
import { IBaseRepository } from './IBaseRepository';

export interface IUrlRepository extends IBaseRepository<IUrl> {
  findByShortUrl(shortUrl: string): Promise<IUrl | null>;
  findByOriginalUrl(userId: string, originalUrl: string): Promise<IUrl | null>;
}
