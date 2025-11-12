import { Document, FilterQuery } from 'mongoose';

export interface IBaseRepository<T extends Document> {
  create(date: Partial<T>): Promise<T>;
  findById(id: string): Promise<T | null>;
  findOne(query: FilterQuery<T>): Promise<T | null>;
  find(query: FilterQuery<T>, page?: number, limit?: number): Promise<T[]>;
  count(query: FilterQuery<T>): Promise<number>;
  delete(id: string): Promise<void>;
}
