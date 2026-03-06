export const ROUTES = {
  // Client
  HOME: '/',
  HOUSEHOLDS: '/households',
  HOUSEHOLD_DETAIL: '/households/:id',
  HOUSEHOLD_JOIN: '/households/join/:token',
  // Admin
  ADMIN: '/admin',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_LOGIN: '/admin/login',
  // Client auth (standalone pages only — modal handles login/register)
  FORGOT_PASSWORD: '/forgot-password',
  RESET_PASSWORD: '/reset-password',
  OAUTH_CALLBACK: '/auth/oauth/callback',
  // Client auth uses a modal — redirect unauthenticated users to home
  LOGIN: '/',
  FORBIDDEN: '/403',
  NOT_FOUND: '/404',
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  THEME: 'theme',
} as const;

export const QUERY_KEYS = {
  USER: 'user',
  AUTH: 'auth',
  HOUSEHOLDS: 'households',
  HOUSEHOLD: 'household',
} as const;

export const PAGINATION_DEFAULTS = {
  PAGE: 1,
  PAGE_SIZE: 10,
} as const;
