import { Model } from 'mongoose';
import { BaseRepository } from './BaseRepository';
import { IUser } from '../models/User';
import { IAuthRepository } from '../interfaces/IAuthRepository';

export class AuthRepository
  extends BaseRepository<IUser>
  implements IAuthRepository
{
  constructor(model: Model<IUser>) {
    super(model);
  }

  async findByEmail(email: string): Promise<IUser | null> {
    return this.model.findOne({ email }).exec();
  }
}
