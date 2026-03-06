import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import {
  authApi,
  type LoginPayload,
  type RegisterPayload,
} from '@/api/auth.api';
import { useAuthStore } from '@/store/useAuthStore';
import { mapProfileToAuthUser } from '@/utils/auth';
import { ROUTES } from '@/config/constants';

export function useLogin(options?: {
  onSuccess?: () => void;
  onError?: (message: string) => void;
}) {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (payload: LoginPayload) => authApi.login(payload),
    onSuccess: (res) => {
      const { accessToken, user } = res.data.data;
      setAuth(mapProfileToAuthUser(user), { accessToken });
      options?.onSuccess?.();
    },
    onError: (err: unknown) => {
      const e = err as { response?: { data?: { message?: string } } };
      options?.onError?.(
        e.response?.data?.message ?? 'Email hoặc mật khẩu không đúng',
      );
    },
  });
}

export function useRegister(options?: {
  onSuccess?: () => void;
  onError?: (message: string) => void;
}) {
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authApi.register(payload),
    onSuccess: (res) => {
      const { accessToken, user } = res.data.data;
      setAuth(mapProfileToAuthUser(user), { accessToken });
      options?.onSuccess?.();
    },
    onError: (err: unknown) => {
      const e = err as { response?: { data?: { message?: string } } };
      options?.onError?.(
        e.response?.data?.message ?? 'Đăng ký thất bại. Vui lòng thử lại.',
      );
    },
  });
}

export function useLogout() {
  const navigate = useNavigate();
  const clearAuth = useAuthStore((s) => s.clearAuth);

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      clearAuth();
      navigate(ROUTES.HOME, { replace: true });
    },
  });
}
