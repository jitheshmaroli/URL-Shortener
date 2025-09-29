import axios, { AxiosError, type AxiosInstance } from "axios";
import type {
    CheckAuthResponse,
  ErrorResponse,
  LoginResponse,
  RegisterResponse,
} from "../types/authTypes";

const api: AxiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true,
});

export const register = async (
  email: string,
  password: string
): Promise<RegisterResponse> => {
  try {
    await api.post("/auth/register", { email, password });
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
    await api.post("/auth/login", { email, password });
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
    await api.post("/auth/logout");
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
    await api.get("/auth/check");
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
