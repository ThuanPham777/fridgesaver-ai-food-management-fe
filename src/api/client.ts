import axios, {
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import { env } from '@/config/env';
import { ROUTES } from '@/config/constants';
import { useAuthStore } from '@/store/useAuthStore';
import type { ApiError, ApiResponse } from '@/types/api.types';
import type { AuthResponseDto } from '@/types/auth.types';

// ---------- create instance ----------
const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
  // Required so the browser sends the HttpOnly refresh-token cookie on every request
  withCredentials: true,
});

// ---------- token refresh queue ----------
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token!)));
  failedQueue = [];
};

/** Clear auth state and redirect admin users to the admin login page. */
const forceLogout = () => {
  const { user } = useAuthStore.getState();
  useAuthStore.getState().clearAuth();

  const isAdmin = user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN';
  window.location.href = isAdmin ? ROUTES.ADMIN_LOGIN : ROUTES.HOME;
};

// ---------- request interceptor — attach access token from memory ----------
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().tokens?.accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// ---------- response interceptor — silent refresh on 401 ----------
// Endpoints that must never trigger the silent-refresh retry (avoids loops)
const AUTH_SKIP_URLS = [
  '/auth/refresh',
  '/auth/logout',
  '/auth/login',
  '/auth/register',
];

apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<ApiError>) => {
    const original = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };
    const status = error.response?.status;
    const url = original?.url ?? '';

    // Skip retry for auth-control endpoints — just reject so callers handle it
    const isAuthEndpoint = AUTH_SKIP_URLS.some((path) => url.includes(path));

    if (status === 401 && !original._retry && !isAuthEndpoint) {
      // Queue concurrent requests while a refresh is already in-flight
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((newToken) => {
          original.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(original);
        });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        // No body needed — refresh token travels as an HttpOnly cookie
        const { data } = await axios.post<ApiResponse<AuthResponseDto>>(
          `${env.apiBaseUrl}/auth/refresh`,
          undefined,
          { withCredentials: true },
        );
        const { accessToken } = data.data;

        // Store new access token in memory only
        useAuthStore.getState().setAccessToken(accessToken);
        apiClient.defaults.headers.common.Authorization = `Bearer ${accessToken}`;

        processQueue(null, accessToken);
        original.headers.Authorization = `Bearer ${accessToken}`;
        return apiClient(original);
      } catch (refreshError) {
        processQueue(refreshError, null);
        forceLogout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default apiClient;
