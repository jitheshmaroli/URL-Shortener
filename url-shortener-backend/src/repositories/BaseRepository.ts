import { Document, FilterQuery, Model } from 'mongoose';
import { IBaseRepository } from '../interfaces/IBaseRepository';

export abstract class BaseRepository<T extends Document>
  implements IBaseRepository<T>
{
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }

  async findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  async findOne(query: FilterQuery<T>): Promise<T | null> {
    return this.model.findOne(query).exec();
  }

  async find(
    query: FilterQuery<T>,
    page?: number,
    limit?: number
  ): Promise<T[]> {
    const queryBuilder = this.model.find(query);
    if (page && limit) {
      queryBuilder.skip((page - 1) * limit).limit(limit);
    }
    return queryBuilder.sort({ createdAt: -1 }).exec();
  }

  async count(query: FilterQuery<T>): Promise<number> {
    return this.model.countDocuments(query).exec();
  }
}
