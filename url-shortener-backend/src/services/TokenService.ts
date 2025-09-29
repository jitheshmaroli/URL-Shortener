import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export class TokenService {
  private static secret = env.JWT_SECRET;

  static generateToken(userId: string): string {
    if (!this.secret) throw new Error('JWT_SECRET is not defined');
    return jwt.sign({ userId }, this.secret, { expiresIn: '1h' });
  }

  static verifyToken(token: string): { userId: string } | null {
    try {
      if (!this.secret) throw new Error('JWT_SECRET is not defined');
      return jwt.verify(token, this.secret) as { userId: string };
    } catch {
      return null;
    }
  }
}
