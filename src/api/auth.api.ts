import apiClient from './client';
import { ENDPOINTS } from './endpoints';
import type { ApiResponse } from '@/types/api.types';
import type { AuthResponseDto, UserProfileDto } from '@/types/auth.types';

export interface RegisterPayload {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authApi = {
  register: (data: RegisterPayload) =>
    apiClient.post<ApiResponse<AuthResponseDto>>(ENDPOINTS.AUTH.REGISTER, data),

  login: (data: LoginPayload) =>
    apiClient.post<ApiResponse<AuthResponseDto>>(ENDPOINTS.AUTH.LOGIN, data),

  /** Refresh token travels as an HttpOnly cookie — no body needed */
  refresh: () =>
    apiClient.post<ApiResponse<AuthResponseDto>>(ENDPOINTS.AUTH.REFRESH),

  /** Refresh token cookie is cleared server-side — no body needed */
  logout: () => apiClient.post<ApiResponse<null>>(ENDPOINTS.AUTH.LOGOUT),

  me: () => apiClient.get<ApiResponse<UserProfileDto>>(ENDPOINTS.AUTH.ME),

  forgotPassword: (email: string) =>
    apiClient.post<ApiResponse<null>>(ENDPOINTS.AUTH.FORGOT_PASSWORD, {
      email,
    }),

  resetPassword: (token: string, newPassword: string) =>
    apiClient.post<ApiResponse<null>>(ENDPOINTS.AUTH.RESET_PASSWORD, {
      token,
      newPassword,
    }),
};
