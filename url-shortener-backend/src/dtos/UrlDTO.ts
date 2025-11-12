export interface CreateUrlDTO {
  originalUrl: string;
}

export interface DeleteUrlDTO {
  urlId: string;
}

export interface UrlResponseDTO {
  success: boolean;
  shortUrl?: string;
  message?: string;
  clickCount?: number;
}

export interface GetUrlsResponseDTO {
  success: boolean;
  urls?: Array<{
    _id: string;
    originalUrl: string;
    shortUrl: string;
    clickCount: number;
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
