import jwt from 'jsonwebtoken';
import { env } from '../config/env';

export class TokenService {
  private static secret = env.JWT_SECRET;
  private static refreshSecret = env.JWT_REFRESH_SECRET || env.JWT_SECRET;

  static generateAccessToken(userId: string): string {
    if (!this.secret) throw new Error('JWT_SECRET is not defined');
    return jwt.sign({ userId }, this.secret, { expiresIn: '1h' });
  }

  static generateRefreshToken(userId: string): string {
    if (!this.refreshSecret)
      throw new Error('JWT_REFRESH_SECRET is not defined');
    return jwt.sign({ userId }, this.refreshSecret, { expiresIn: '7d' });
  }

  static verifyAccessToken(token: string): { userId: string } | null {
    try {
      if (!this.secret) throw new Error('JWT_SECRET is not defined');
      return jwt.verify(token, this.secret) as { userId: string };
    } catch {
      return null;
    }
  }

  static verifyRefreshToken(token: string): { userId: string } | null {
    try {
      if (!this.refreshSecret)
        throw new Error('JWT_REFRESH_SECRET is not defined');
      return jwt.verify(token, this.refreshSecret) as { userId: string };
    } catch {
      return null;
    }
  }
}
