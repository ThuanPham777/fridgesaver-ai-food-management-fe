import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { ROUTES } from '@/config/constants';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/useAuthStore';
import { useMutation } from '@tanstack/react-query';
import { authApi } from '@/api/auth.api';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { AuthModal } from '@/components/auth/AuthModal';

const navLinks = [{ label: 'Home', to: ROUTES.HOME }];

function UserAvatar({
  avatarUrl,
  fullName,
}: {
  avatarUrl?: string;
  fullName: string;
}) {
  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={fullName}
        className='size-8 rounded-full object-cover ring-2 ring-border'
      />
    );
  }
  return (
    <span className='bg-primary text-primary-foreground flex size-8 items-center justify-center rounded-full text-sm font-semibold uppercase'>
      {fullName.charAt(0)}
    </span>
  );
}

export function ClientLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalTab, setModalTab] = useState<'login' | 'register'>('login');

  const { mutate: logout, isPending: isLoggingOut } = useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      clearAuth();
      navigate(ROUTES.HOME, { replace: true });
    },
  });

  const openLogin = () => {
    setModalTab('login');
    setModalOpen(true);
  };
  const openRegister = () => {
    setModalTab('register');
    setModalOpen(true);
  };

  return (
    <div className='bg-background text-foreground flex min-h-screen flex-col'>
      {/* ── Header ── */}
      <header className='border-border sticky top-0 z-40 border-b bg-white/80 backdrop-blur-sm dark:bg-neutral-950/80'>
        <div className='mx-auto flex h-14 max-w-7xl items-center justify-between px-4'>
          <Link
            to={ROUTES.HOME}
            className='text-primary text-lg font-bold'
          >
            FridgeSaver
          </Link>

          <nav className='flex items-center gap-6'>
            {navLinks.map(({ label, to }) => (
              <Link
                key={to}
                to={to}
                className={cn(
                  'text-sm transition-colors hover:text-foreground',
                  pathname === to
                    ? 'text-foreground font-medium'
                    : 'text-muted-foreground',
                )}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* Auth actions */}
          <div className='flex items-center gap-2'>
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className='cursor-pointer rounded-full outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'>
                    <UserAvatar
                      avatarUrl={user.avatarUrl}
                      fullName={user.fullName}
                    />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align='end'
                  className='w-56'
                >
                  <DropdownMenuLabel className='font-normal'>
                    <div className='flex flex-col gap-1'>
                      <p className='text-sm font-medium leading-none'>
                        {user.fullName}
                      </p>
                      <p className='text-xs leading-none text-muted-foreground'>
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <User />
                      Trang cá nhân
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    variant='destructive'
                    disabled={isLoggingOut}
                    onSelect={() => logout()}
                  >
                    <LogOut />
                    {isLoggingOut ? 'Đang đăng xuất...' : 'Đăng xuất'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={openLogin}
                >
                  Đăng nhập
                </Button>
                <Button
                  size='sm'
                  onClick={openRegister}
                >
                  Đăng ký
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* ── Page content ── */}
      <main className='mx-auto w-full max-w-7xl flex-1 px-4 py-8'>
        <Outlet />
      </main>

      {/* ── Footer ── */}
      <footer className='border-border border-t py-4 text-center text-xs text-muted-foreground'>
        © {new Date().getFullYear()} FridgeSaver. All rights reserved.
      </footer>

      {/* ── Auth Modal ── */}
      <AuthModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        defaultTab={modalTab}
      />
    </div>
  );
}
