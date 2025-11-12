import type { ReactNode } from "react";

export interface Url {
  _id: string;
  userId: string;
  originalUrl: string;
  shortUrl: string;
  clickCount: number;
  createdAt: string;
}

export interface ShortenUrlResponse {
  success: boolean;
  shortUrl?: string;
  clickCount?: number;
  message?: string;
}

export interface GetUrlsResponse {
  success: boolean;
  urls?: Url[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalUrls: number;
    limit: number;
  };
  message?: string;
}

export interface DeleteUrlResponse {
  success: boolean;
  message?: string;
}

export interface GetUrlDetailsResponse {
  success: boolean;
  url?: Url;
  message?: string;
}

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
}