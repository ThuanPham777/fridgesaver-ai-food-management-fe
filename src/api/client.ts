import axios, {
  type AxiosError,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios';
import { env } from '@/config/env';
import { STORAGE_KEYS } from '@/config/constants';
import { storage } from '@/utils/storage';
import type { ApiError } from '@/types/api.types';

// ---------- create instance ----------
const apiClient = axios.create({
  baseURL: env.apiBaseUrl,
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});

// ---------- request interceptor ----------
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = storage.get<string>(STORAGE_KEYS.ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// ---------- response interceptor ----------
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<ApiError>) => {
    const status = error.response?.status;

    if (status === 401) {
      // Clear credentials and redirect to login.
      // Actual token-refresh logic can be added here by future projects.
      storage.remove(STORAGE_KEYS.ACCESS_TOKEN);
      storage.remove(STORAGE_KEYS.REFRESH_TOKEN);
      storage.remove(STORAGE_KEYS.USER);
      window.location.href = '/login';
    }

    return Promise.reject(error);
  },
);

export default apiClient;
