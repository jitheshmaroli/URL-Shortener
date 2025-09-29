import Joi from 'joi';
import { RegisterDTO, LoginDTO } from '../dtos/AuthDTO';
import { MESSAGES } from '../constants';
import { CreateUrlDTO } from '../dtos/UrlDTO';

export class ValidationService {
  private static authSchema = Joi.object({
    email: Joi.string().email().required().messages({
      'string.email': MESSAGES.INVALID_CREDENTIALS,
      'any.required': MESSAGES.EMAIL_PASSWORD_REQUIRED,
    }),
    password: Joi.string().min(6).required().messages({
      'string.min': 'Password must be at least 6 characters',
      'any.required': MESSAGES.EMAIL_PASSWORD_REQUIRED,
    }),
  });

  private static urlSchema = Joi.object({
    originalUrl: Joi.string().uri().required().messages({
      'string.uri': MESSAGES.INVALID_URL,
      'any.required': MESSAGES.URL_REQUIRED,
    }),
  });

  static validateRegister(data: RegisterDTO): Joi.ValidationResult {
    return this.authSchema.validate(data, { abortEarly: false });
  }

  static validateLogin(data: LoginDTO): Joi.ValidationResult {
    return this.authSchema.validate(data, { abortEarly: false });
  }

  static validateUrl(data: CreateUrlDTO): Joi.ValidationResult {
    return this.urlSchema.validate(data, { abortEarly: false });
  }
}
