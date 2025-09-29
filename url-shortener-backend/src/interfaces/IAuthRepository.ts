import { IUser } from '../models/User';
import { IBaseRepository } from './IBaseRepository';

export interface IAuthRepository extends IBaseRepository<IUser> {
  findByEmail(email: string): Promise<IUser | null>;
}
