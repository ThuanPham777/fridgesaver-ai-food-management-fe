import { Outlet, Link, useLocation } from 'react-router-dom';
import { ROUTES } from '@/config/constants';
import { cn } from '@/lib/utils';

const navLinks = [{ label: 'Home', to: ROUTES.HOME }];

export function ClientLayout() {
  const { pathname } = useLocation();

  return (
    <div className='bg-background text-foreground flex min-h-screen flex-col'>
      {/* ── Header ── */}
      <header className='border-border sticky top-0 z-40 border-b bg-white/80 backdrop-blur-sm dark:bg-neutral-950/80'>
        <div className='mx-auto flex h-14 max-w-7xl items-center justify-between px-4'>
          <Link
            to={ROUTES.HOME}
            className='text-primary text-lg font-bold'
          >
            MyApp
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
        </div>
      </header>

      {/* ── Page content ── */}
      <main className='mx-auto w-full max-w-7xl flex-1 px-4 py-8'>
        <Outlet />
      </main>

      {/* ── Footer ── */}
      <footer className='border-border border-t py-4 text-center text-xs text-muted-foreground'>
        © {new Date().getFullYear()} MyApp. All rights reserved.
      </footer>
    </div>
  );
}
