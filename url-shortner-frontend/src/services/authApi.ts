import api from "./api";
import type {
  CheckAuthResponse,
  ErrorResponse,
  LoginResponse,
  RegisterResponse,
} from "../types/authTypes";
import { API_URLS } from "../constants";
import type { AxiosError } from "axios";

export const register = async (
  email: string,
  password: string
): Promise<RegisterResponse> => {
  try {
    await api.post(API_URLS.AUTH.REGISTER, { email, password });
    return { success: true };
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return {
      success: false,
      message: axiosError.response?.data?.message || "Registration error",
    };
  }
};

export const login = async (
  email: string,
  password: string
): Promise<LoginResponse> => {
  try {
    await api.post(API_URLS.AUTH.LOGIN, { email, password });
    return { success: true };
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return {
      success: false,
      message: axiosError.response?.data?.message || "Login error",
    };
  }
};

export const logout = async (): Promise<LoginResponse> => {
  try {
    await api.post(API_URLS.AUTH.LOGOUT);
    return { success: true };
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return {
      success: false,
      message: axiosError.response?.data?.message || "Logout error",
    };
  }
};

export const checkAuth = async (): Promise<CheckAuthResponse> => {
  try {
    await api.get(API_URLS.AUTH.CHECK_AUTH);
    return { success: true };
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    console.error(
      "Authentication check failed:",
      axiosError.response?.data?.message || axiosError.message
    );
    return {
      success: false,
      message:
        axiosError.response?.data?.message || "Authentication check failed",
    };
  }
};
