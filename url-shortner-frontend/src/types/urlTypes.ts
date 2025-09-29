export interface Url {
  _id: string;
  userId: string;
  originalUrl: string;
  shortUrl: string;
  createdAt: string;
}

export interface ShortenUrlResponse {
  success: boolean;
  shortUrl?: string;
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