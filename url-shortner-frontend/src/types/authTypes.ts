export interface ErrorResponse {
  message: string;
}

export interface RegisterResponse {
  success: boolean;
  message?: string;
}

export interface LoginResponse {
  success: boolean;
  message?: string;
}

export interface CheckAuthResponse {
  success: boolean;
  message?: string;
}