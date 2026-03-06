/**
 * Centralised API endpoint constants.
 * Group by resource so future projects can extend cleanly.
 *
 * Example usage:
 *   import { ENDPOINTS } from '@/api/endpoints';
 *   apiClient.get(ENDPOINTS.AUTH.ME)
 */
export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
  },
} as const;
