import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
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

export default function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const { mutate, isPending } = useMutation({
    mutationFn: () => authApi.forgotPassword(email),
    onSuccess: () => setSubmitted(true),
    onError: () => setSubmitted(true), // Always show success to avoid leaking email existence
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setEmailError('Email là bắt buộc');
      return;
    }
    if (!validation.isEmail(email)) {
      setEmailError('Email không hợp lệ');
      return;
    }
    setEmailError('');
    mutate();
  };

  if (submitted) {
    return (
      <Card>
        <CardHeader className='text-center'>
          <CardTitle>Kiểm tra email</CardTitle>
          <CardDescription>
            Nếu email tồn tại, chúng tôi đã gửi hướng dẫn đặt lại mật khẩu.
          </CardDescription>
        </CardHeader>
        <CardContent className='text-center'>
          <button
            onClick={() => navigate(-1)}
            className='text-primary text-sm hover:underline'
          >
            Quay lại đăng nhập
          </button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className='text-center'>
        <CardTitle>Quên mật khẩu</CardTitle>
        <CardDescription>
          Nhập email để nhận link đặt lại mật khẩu
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form
          onSubmit={handleSubmit}
          className='flex flex-col gap-4'
          noValidate
        >
          <div className='flex flex-col gap-1'>
            <Input
              type='email'
              placeholder='Email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={isPending}
            />
            {emailError && (
              <p className='text-destructive text-xs'>{emailError}</p>
            )}
          </div>

          <Button
            type='submit'
            className='w-full'
            disabled={isPending}
          >
            {isPending ? 'Đang gửi...' : 'Gửi link đặt lại mật khẩu'}
          </Button>
        </form>

        <p className='text-muted-foreground mt-4 text-center text-xs'>
          <button
            onClick={() => navigate(-1)}
            className='text-primary hover:underline'
          >
            Quay lại đăng nhập
          </button>
        </p>
      </CardContent>
    </Card>
  );
}
