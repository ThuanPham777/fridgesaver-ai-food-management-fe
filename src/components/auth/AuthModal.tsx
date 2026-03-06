import { useState, useEffect } from 'react';
import { useLogin, useRegister } from '@/hooks/useAuth';
import { validation } from '@/utils/validation';
import { env } from '@/config/env';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { XIcon } from 'lucide-react';

// ─── Modal ───────────────────────────────────────────────────────────────────

interface AuthModalProps {
  open: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'register';
}

export function AuthModal({
  open,
  onClose,
  defaultTab = 'login',
}: AuthModalProps) {
  const [view, setView] = useState<'login' | 'register'>(defaultTab);

  // Sync view to whichever button (Login / Register) opened the modal
  useEffect(() => {
    if (open) setView(defaultTab);
  }, [open, defaultTab]);

  if (!open) return null;

  return (
    <div
      className='fixed inset-0 z-50 flex items-center justify-center p-4'
      aria-modal='true'
      role='dialog'
    >
      {/* Backdrop */}
      <div
        className='absolute inset-0 bg-black/60 backdrop-blur-sm'
        onClick={onClose}
        aria-hidden='true'
      />

      {/* Card panel */}
      <Card className='relative z-10 w-full max-w-md gap-0 border-0 shadow-2xl'>
        {/* Close button */}
        <button
          onClick={onClose}
          className='text-muted-foreground hover:text-foreground absolute right-4 top-4 rounded-sm p-1 transition-colors'
          aria-label='Đóng'
        >
          <XIcon />
        </button>

        <CardHeader className='items-center pb-2 pt-8 text-center'>
          <CardTitle className='text-2xl font-bold'>
            {view === 'login' ? 'Chào mừng trở lại!' : 'Tạo tài khoản'}
          </CardTitle>
          <CardDescription className='mt-1'>
            {view === 'login'
              ? 'Đăng nhập để quản lý tủ lạnh thông minh của bạn'
              : 'Bắt đầu hành trình tiết kiệm thực phẩm của bạn'}
          </CardDescription>
        </CardHeader>

        <CardContent className='px-8 pb-8 pt-6'>
          {view === 'login' ? (
            <LoginForm
              onSuccess={onClose}
              onSwitchView={() => setView('register')}
            />
          ) : (
            <RegisterForm
              onSuccess={onClose}
              onSwitchView={() => setView('login')}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

// ─── Login form ──────────────────────────────────────────────────────────────

function LoginForm({
  onSuccess,
  onSwitchView,
}: {
  onSuccess: () => void;
  onSwitchView: () => void;
}) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  const { mutate, isPending } = useLogin({
    onSuccess: () => onSuccess(),
    onError: (message) => setErrors({ general: message }),
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
    mutate({ email, password });
  };

  return (
    <div className='flex flex-col gap-4'>
      {/* Google OAuth — prominent at the top */}
      <Button
        type='button'
        variant='outline'
        className='w-full gap-2'
        onClick={() => {
          window.location.href = `${env.apiBaseUrl}/auth/google`;
        }}
        disabled={isPending}
      >
        <GoogleIcon />
        Tiếp tục với Google
      </Button>

      {/* Divider */}
      <div className='flex items-center gap-3'>
        <Separator className='flex-1' />
        <span className='text-muted-foreground text-xs'>hoặc</span>
        <Separator className='flex-1' />
      </div>

      {/* Email / password form */}
      <form
        onSubmit={handleSubmit}
        className='flex flex-col gap-3'
        noValidate
      >
        {errors.general && (
          <p className='bg-destructive/10 text-destructive rounded-lg px-3 py-2 text-center text-sm'>
            {errors.general}
          </p>
        )}

        <div className='flex flex-col gap-1'>
          <label className='text-sm font-medium'>Email</label>
          <Input
            type='email'
            placeholder='you@example.com'
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isPending}
            className={errors.email ? 'border-destructive' : ''}
          />
          {errors.email && (
            <p className='text-destructive text-xs'>{errors.email}</p>
          )}
        </div>

        <div className='flex flex-col gap-1'>
          <div className='flex items-center justify-between'>
            <label className='text-sm font-medium'>Mật khẩu</label>
            <a
              href='/forgot-password'
              className='text-primary text-xs hover:underline'
            >
              Quên mật khẩu?
            </a>
          </div>
          <Input
            type='password'
            placeholder='••••••••'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isPending}
            className={errors.password ? 'border-destructive' : ''}
          />
          {errors.password && (
            <p className='text-destructive text-xs'>{errors.password}</p>
          )}
        </div>

        <Button
          type='submit'
          className='mt-1 w-full'
          disabled={isPending}
        >
          {isPending ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </Button>
      </form>

      <p className='text-muted-foreground text-center text-sm'>
        Chưa có tài khoản?{' '}
        <button
          type='button'
          onClick={onSwitchView}
          className='text-primary font-medium hover:underline'
        >
          Đăng ký ngay
        </button>
      </p>
    </div>
  );
}

// ─── Register form ───────────────────────────────────────────────────────────

function RegisterForm({
  onSuccess,
  onSwitchView,
}: {
  onSuccess: () => void;
  onSwitchView: () => void;
}) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    general?: string;
  }>({});

  const { mutate, isPending } = useRegister({
    onSuccess: () => onSuccess(),
    onError: (message) => setErrors({ general: message }),
  });

  const handleSubmit = (ev: React.FormEvent) => {
    ev.preventDefault();
    const next: typeof errors = {};
    if (!fullName.trim()) next.fullName = 'Họ và tên là bắt buộc';
    if (!email) next.email = 'Email là bắt buộc';
    else if (!validation.isEmail(email)) next.email = 'Email không hợp lệ';
    if (!password) next.password = 'Mật khẩu là bắt buộc';
    else if (!validation.isStrongPassword(password))
      next.password = 'Ít nhất 8 ký tự, gồm chữ hoa, chữ thường và số';
    if (Object.keys(next).length) {
      setErrors(next);
      return;
    }
    setErrors({});
    mutate({ fullName, email, password });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className='flex flex-col gap-3'
      noValidate
    >
      {errors.general && (
        <p className='bg-destructive/10 text-destructive rounded-lg px-3 py-2 text-center text-sm'>
          {errors.general}
        </p>
      )}

      <div className='flex flex-col gap-1'>
        <label className='text-sm font-medium'>Họ và tên</label>
        <Input
          placeholder='Nguyễn Văn A'
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          disabled={isPending}
          className={errors.fullName ? 'border-destructive' : ''}
        />
        {errors.fullName && (
          <p className='text-destructive text-xs'>{errors.fullName}</p>
        )}
      </div>

      <div className='flex flex-col gap-1'>
        <label className='text-sm font-medium'>Email</label>
        <Input
          type='email'
          placeholder='you@example.com'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={isPending}
          className={errors.email ? 'border-destructive' : ''}
        />
        {errors.email && (
          <p className='text-destructive text-xs'>{errors.email}</p>
        )}
      </div>

      <div className='flex flex-col gap-1'>
        <label className='text-sm font-medium'>Mật khẩu</label>
        <Input
          type='password'
          placeholder='••••••••'
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={isPending}
          className={errors.password ? 'border-destructive' : ''}
        />
        {errors.password && (
          <p className='text-destructive text-xs'>{errors.password}</p>
        )}
      </div>

      <Button
        type='submit'
        className='mt-1 w-full'
        disabled={isPending}
      >
        {isPending ? 'Đang tạo tài khoản...' : 'Tạo tài khoản'}
      </Button>

      <p className='text-muted-foreground text-center text-sm'>
        Đã có tài khoản?{' '}
        <button
          type='button'
          onClick={onSwitchView}
          className='text-primary font-medium hover:underline'
        >
          Đăng nhập
        </button>
      </p>
    </form>
  );
}

function GoogleIcon() {
  return (
    <svg
      className='h-4 w-4'
      viewBox='0 0 24 24'
      aria-hidden='true'
    >
      <path
        d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
        fill='#4285F4'
      />
      <path
        d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
        fill='#34A853'
      />
      <path
        d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z'
        fill='#FBBC05'
      />
      <path
        d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
        fill='#EA4335'
      />
    </svg>
  );
}
