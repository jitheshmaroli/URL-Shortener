import bcrypt from 'bcryptjs';
import { IAuthRepository } from '../interfaces/IAuthRepository';
import { RegisterDTO, LoginDTO, AuthResponseDTO } from '../dtos/AuthDTO';
import { ValidationService } from './ValidationService';
import { TokenService } from './TokenService';
import { MESSAGES } from '../constants';

export class AuthService {
  constructor(private authRepository: IAuthRepository) {}

  async register(dto: RegisterDTO): Promise<AuthResponseDTO> {
    const validation = ValidationService.validateRegister(dto);
    if (validation.error) {
      return {
        success: false,
        message: validation.error.details.map((d) => d.message).join(', '),
      };
    }

    const existingUser = await this.authRepository.findByEmail(dto.email);
    if (existingUser) {
      return { success: false, message: MESSAGES.USER_EXISTS };
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.password, salt);

    await this.authRepository.create({
      email: dto.email,
      password: hashedPassword,
    });
    return { success: true, message: MESSAGES.USER_REGISTERED };
  }

  async login(
    dto: LoginDTO
  ): Promise<AuthResponseDTO & { token?: string; refreshToken?: string }> {
    const validation = ValidationService.validateLogin(dto);
    if (validation.error) {
      return {
        success: false,
        message: validation.error.details.map((d) => d.message).join(', '),
      };
    }

    const user = await this.authRepository.findByEmail(dto.email);
    if (!user) {
      return { success: false, message: MESSAGES.INVALID_CREDENTIALS };
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      return { success: false, message: MESSAGES.INVALID_CREDENTIALS };
    }

    const token = TokenService.generateAccessToken(user._id.toString());
    const refreshToken = TokenService.generateRefreshToken(user._id.toString());
    return { success: true, message: MESSAGES.LOGGED_IN, token, refreshToken };
  }

  async refresh(
    refreshToken: string
  ): Promise<AuthResponseDTO & { token?: string; refreshToken?: string }> {
    const decoded = TokenService.verifyRefreshToken(refreshToken);
    if (!decoded || !decoded.userId) {
      return { success: false, message: MESSAGES.INVALID_CREDENTIALS };
    }

    const newToken = TokenService.generateAccessToken(decoded.userId);
    const newRefreshToken = TokenService.generateRefreshToken(decoded.userId);
    return { success: true, token: newToken, refreshToken: newRefreshToken };
  }

  async checkAuth(token: string): Promise<AuthResponseDTO> {
    const decoded = TokenService.verifyAccessToken(token);
    if (!decoded) {
      return { success: false, message: MESSAGES.UNAUTHORIZED };
    }
    return { success: true };
  }
}
