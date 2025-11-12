import api from "./api";
import type {
  GetUrlsResponse,
  ShortenUrlResponse,
  DeleteUrlResponse,
} from "../types/urlTypes";
import { API_URLS } from "../constants";
import { AxiosError } from "axios";

export const shortenUrl = async (
  originalUrl: string
): Promise<ShortenUrlResponse> => {
  try {
    const res = await api.post(API_URLS.URL.SHORTEN, { originalUrl });
    return { success: true, shortUrl: res.data.shortUrl };
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    return {
      success: false,
      message: axiosError.response?.data?.message || "Error shortening URL",
    };
  }
};

export const getMyUrls = async (
  page: number = 1,
  limit: number = 5
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
    const axiosError = error as AxiosError<{ message: string }>;
    return {
      success: false,
      message: axiosError.response?.data?.message || "Error fetching URLs",
    };
  }
};

export const deleteUrl = async (urlId: string): Promise<DeleteUrlResponse> => {
  try {
    const res = await api.delete(`${API_URLS.URL.DELETE}/${urlId}`);
    return { success: true, message: res.data.message };
  } catch (error) {
    const axiosError = error as AxiosError<{ message: string }>;
    return {
      success: false,
      message: axiosError.response?.data?.message || "Error deleting URL",
    };
  }
};
