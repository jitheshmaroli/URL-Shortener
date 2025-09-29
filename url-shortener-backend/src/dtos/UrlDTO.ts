export interface CreateUrlDTO {
  originalUrl: string;
}

export interface UrlResponseDTO {
  success: boolean;
  shortUrl?: string;
  message?: string;
}

export interface GetUrlsResponseDTO {
  success: boolean;
  urls?: Array<{
    _id: string;
    originalUrl: string;
    shortUrl: string;
    createdAt: string;
  }>;
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalUrls: number;
    limit: number;
  };
  message?: string;
}
