export const ROUTES = {
  LOGIN: "/login",
  REGISTER: "/register",
  SHORTEN: "/shorten",
  ROOT: "/",
} as const;

export const API_URLS = {
  BASE_URL: "http://localhost:3000/api",
  AUTH: {
    REGISTER: "/auth/register",
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    CHECK_AUTH: "/auth/check",
  },
  URL: {
    SHORTEN: "/url/shorten",
    MY_URLS: "/url/myurls",
  },
} as const;
