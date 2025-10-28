import { Model } from 'mongoose';
import { BaseRepository } from './BaseRepository';
import { IUrl } from '../models/Url';
import { IUrlRepository } from '../interfaces/IUrlRepository';

export class UrlRepository
  extends BaseRepository<IUrl>
  implements IUrlRepository
{
  constructor(model: Model<IUrl>) {
    super(model);
  }

  async findByShortUrl(shortUrl: string): Promise<IUrl | null> {
    return this.model.findOne({ shortUrl }).exec();
  }

  async findByOriginalUrl(
    userId: string,
    originalUrl: string
  ): Promise<IUrl | null> {
    return this.model.findOne({ userId, originalUrl }).exec();
  }
}
