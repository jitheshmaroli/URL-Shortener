import axios, { AxiosError, type AxiosInstance } from "axios";
import type {
  CheckAuthResponse,
  ErrorResponse,
  LoginResponse,
  RegisterResponse,
} from "../types/authTypes";
import type { GetUrlsResponse, ShortenUrlResponse } from "../types/urlTypes";
import { API_URLS } from "../constants";

const api: AxiosInstance = axios.create({
  baseURL: API_URLS.BASE_URL,
  withCredentials: true,
});

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

export const shortenUrl = async (
  originalUrl: string
): Promise<ShortenUrlResponse> => {
  try {
    const res = await api.post(API_URLS.URL.SHORTEN, { originalUrl });
    return { success: true, shortUrl: res.data.shortUrl };
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return {
      success: false,
      message: axiosError.response?.data?.message || "Error shortening URL",
    };
  }
};

export const getMyUrls = async (
  page: number = 1,
  limit: number = 10
): Promise<GetUrlsResponse> => {
  try {
    const res = await api.get(API_URLS.URL.MY_URLS, {
      params: { page, limit },
    });
    return {
      success: true,
      urls: res.data.urls,
      pagination: res.data.pagination,
    };
  } catch (error) {
    const axiosError = error as AxiosError<ErrorResponse>;
    return {
      success: false,
      message: axiosError.response?.data?.message || "Error fetching URLs",
    };
  }
};
