import { Document } from 'mongoose';

export interface IBaseRepository<T extends Document> {
  create(date: Partial<T>): Promise<T>;
  findById(id: string): Promise<T | null>;
}
