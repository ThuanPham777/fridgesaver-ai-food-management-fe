import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { ROUTES } from '@/config/constants';
import { useAuthStore } from '@/store/useAuthStore';
import { authApi } from '@/api/auth.api';
import { validation } from '@/utils/validation';
import type { AuthUser } from '@/types/auth.types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ??
    ROUTES.ADMIN_DASHBOARD;
  const setAuth = useAuthStore((s) => s.setAuth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  const { mutate, isPending } = useMutation({
    mutationFn: () => authApi.login({ email, password }),
    onSuccess: (res) => {
      const { data } = res.data;
      const role = data.user.role;
      if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
        setErrors({ general: 'Bạn không có quyền truy cập trang quản trị' });
        return;
      }
      const user: AuthUser = {
        id: data.user.id,
        email: data.user.email,
        fullName: data.user.fullName,
        role,
        avatarUrl: data.user.avatarUrl ?? undefined,
        phone: data.user.phone ?? undefined,
      };
      setAuth(user, {
        accessToken: data.accessToken,
      });
      navigate(from, { replace: true });
    },
    onError: (err: unknown) => {
      const e = err as { response?: { data?: { message?: string } } };
      setErrors({ general: e.response?.data?.message ?? 'Đăng nhập thất bại' });
    },
  });

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const next: typeof errors = {};
    if (!email) next.email = 'Email là bắt buộc';
    else if (!validation.isEmail(email)) next.email = 'Email không hợp lệ';
    if (!password) next.password = 'Mật khẩu là bắt buộc';
    if (Object.keys(next).length) {
      setErrors(next);
      return;
    }
    setErrors({});
    mutate();
  };

  return (
    <Card>
      <CardHeader className='text-center'>
        <CardTitle>Quản trị viên</CardTitle>
        <CardDescription>Đăng nhập để truy cập trang quản trị</CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit}
          className='flex flex-col gap-4'
          noValidate
        >
          {errors.general && (
            <p className='text-destructive text-center text-sm'>
              {errors.general}
            </p>
          )}

          <div className='flex flex-col gap-1'>
            <Input
              type='email'
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isPending}
            />
            {errors.email && (
              <p className='text-destructive text-xs'>{errors.email}</p>
            )}
          </div>

          <div className='flex flex-col gap-1'>
            <Input
              type='password'
              placeholder='Mật khẩu'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isPending}
            />
            {errors.password && (
              <p className='text-destructive text-xs'>{errors.password}</p>
            )}
          </div>

          <Button
            type='submit'
            className='w-full'
            disabled={isPending}
          >
            {isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
