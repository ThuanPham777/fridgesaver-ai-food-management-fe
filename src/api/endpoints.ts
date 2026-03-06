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
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password',
    GOOGLE: '/auth/google',
  },

  HOUSEHOLDS: {
    BASE: '/households',
    INVITES: (id: string) => `/households/${id}/invites`,
    JOIN_TOKEN: (token: string) => `/households/join/${token}`,
    DETAIL: (id: string) => `/households/${id}`,
    MEMBER: (id: string, userId: string) =>
      `/households/${id}/members/${userId}`,
  },
} as const;
