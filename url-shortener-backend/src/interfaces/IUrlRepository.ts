import { IUrl } from '../models/Url';
import { IBaseRepository } from './IBaseRepository';

export interface IUrlRepository extends IBaseRepository<IUrl> {
  findByShortUrl(shortUrl: string): Promise<IUrl | null>;
}
