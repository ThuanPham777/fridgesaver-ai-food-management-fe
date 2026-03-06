import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { ROUTES } from '@/config/constants';
import { useUIStore } from '@/store/useUIStore';
import { useAuthStore } from '@/store/useAuthStore';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

const sidebarLinks = [{ label: 'Dashboard', to: ROUTES.ADMIN_DASHBOARD }];

export function AdminLayout() {
  const { pathname } = useLocation();
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const { user, clearAuth } = useAuthStore();

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
          <div className='flex items-center gap-3'>
            {user && (
              <>
                <span className='text-muted-foreground text-sm'>
                  {user.email}
                </span>
                <Separator
                  orientation='vertical'
                  className='h-4'
                />
              </>
            )}
            <Button
              variant='ghost'
              size='sm'
              onClick={clearAuth}
              className='text-destructive hover:text-destructive'
            >
              Sign out
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className='flex-1 overflow-auto p-6'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
