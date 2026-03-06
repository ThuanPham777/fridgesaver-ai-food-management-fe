import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, LogOut, User, ShieldCheck } from 'lucide-react';
import { useMutation } from '@tanstack/react-query';
import { ROUTES } from '@/config/constants';
import { useUIStore } from '@/store/useUIStore';
import { useAuthStore } from '@/store/useAuthStore';
import { authApi } from '@/api/auth.api';
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
import { cn } from '@/lib/utils';

const sidebarLinks = [{ label: 'Dashboard', to: ROUTES.ADMIN_DASHBOARD }];

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

export function AdminLayout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { user, clearAuth } = useAuthStore();

  const { mutate: logout, isPending: isLoggingOut } = useMutation({
    mutationFn: () => authApi.logout(),
    onSettled: () => {
      clearAuth();
      navigate(ROUTES.ADMIN_LOGIN, { replace: true });
    },
  });

  return (
    <div className='bg-background text-foreground flex min-h-screen'>
      {/* ── Sidebar ── */}
      <aside
        className={cn(
          'border-border flex flex-col border-r transition-all duration-300',
          sidebarOpen ? 'w-56' : 'w-14',
        )}
      >
        {/* Logo */}
        <div className='flex h-14 items-center px-4'>
          {sidebarOpen ? (
            <span className='text-primary font-bold'>Admin</span>
          ) : (
            <span className='text-primary font-bold'>A</span>
          )}
        </div>

        {/* Nav */}
        <nav className='flex flex-1 flex-col gap-1 px-2 py-4'>
          {sidebarLinks.map(({ label, to }) => (
            <Link
              key={to}
              to={to}
              className={cn(
                'flex items-center gap-3 rounded-md px-2 py-2 text-sm transition-colors',
                pathname.startsWith(to)
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground',
              )}
            >
              {sidebarOpen && label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* ── Main area ── */}
      <div className='flex flex-1 flex-col overflow-hidden'>
        {/* Top bar */}
        <header className='border-border flex h-14 items-center justify-between border-b px-4'>
          <Button
            variant='ghost'
            size='icon'
            onClick={toggleSidebar}
            aria-label='Toggle sidebar'
          >
            <Menu className='h-4 w-4' />
          </Button>

          {user && (
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
                className='w-60'
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
                    Thông tin tài khoản
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <ShieldCheck />
                    Vai trò: {user.role}
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
          )}
        </header>

        {/* Page content */}
        <main className='flex-1 overflow-auto p-6'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
