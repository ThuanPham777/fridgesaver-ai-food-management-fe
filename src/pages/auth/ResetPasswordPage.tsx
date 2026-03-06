import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { ROUTES } from '@/config/constants';
import { authApi } from '@/api/auth.api';
import { validation } from '@/utils/validation';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState<{
    password?: string;
    confirm?: string;
    general?: string;
  }>({});
  const [success, setSuccess] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: () => authApi.resetPassword(token, password),
    onSuccess: () => setSuccess(true),
    onError: (err: unknown) => {
      const axiosErr = err as { response?: { data?: { message?: string } } };
      setErrors({
        general:
          axiosErr.response?.data?.message ??
          'Token không hợp lệ hoặc đã hết hạn',
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setErrors({ general: 'Token không hợp lệ' });
      return;
    }
    const newErrors: typeof errors = {};
    if (!password) newErrors.password = 'Mật khẩu là bắt buộc';
    else if (!validation.isStrongPassword(password))
      newErrors.password =
        'Mật khẩu phải có ít nhất 8 ký tự, gồm chữ hoa, chữ thường và số';
    if (!confirm) newErrors.confirm = 'Xác nhận mật khẩu là bắt buộc';
    else if (password !== confirm) newErrors.confirm = 'Mật khẩu không khớp';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    mutate();
  };

  if (success) {
    return (
      <Card>
        <CardHeader className='text-center'>
          <CardTitle>Đặt lại mật khẩu thành công</CardTitle>
          <CardDescription>Mật khẩu của bạn đã được cập nhật.</CardDescription>
        </CardHeader>
        <CardContent className='text-center'>
          <Button
            className='w-full'
            onClick={() => navigate(ROUTES.LOGIN, { replace: true })}
          >
            Đăng nhập ngay
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className='text-center'>
        <CardTitle>Đặt lại mật khẩu</CardTitle>
        <CardDescription>Nhập mật khẩu mới của bạn</CardDescription>
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
              type='password'
              placeholder='Mật khẩu mới'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isPending}
            />
            {errors.password && (
              <p className='text-destructive text-xs'>{errors.password}</p>
            )}
          </div>

          <div className='flex flex-col gap-1'>
            <Input
              type='password'
              placeholder='Xác nhận mật khẩu'
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              disabled={isPending}
            />
            {errors.confirm && (
              <p className='text-destructive text-xs'>{errors.confirm}</p>
            )}
          </div>

          <Button
            type='submit'
            className='w-full'
            disabled={isPending || !token}
          >
            {isPending ? 'Đang lưu...' : 'Đặt lại mật khẩu'}
          </Button>
        </form>

        <p className='text-muted-foreground mt-4 text-center text-xs'>
          <Link
            to={ROUTES.LOGIN}
            className='text-primary hover:underline'
          >
            Quay lại đăng nhập
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
