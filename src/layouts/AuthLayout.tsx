import { Outlet } from 'react-router-dom';

/**
 * Minimal layout for auth pages (login, register, forgot-password).
 * Centres content on a neutral background — no header/sidebar.
 */
export function AuthLayout() {
  return (
    <div className='flex min-h-screen items-center justify-center bg-muted/40 p-4'>
      <div className='w-full max-w-sm'>
        <Outlet />
      </div>
    </div>
  );
}
