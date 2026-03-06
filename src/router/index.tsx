import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { clientRoutes } from './client.routes';
import { adminRoutes } from './admin.routes';
import { AuthLayout } from '@/layouts/AuthLayout';
import { PageLoader } from '@/components/common/PageLoader';

const LoginPage = lazy(() => import('@/pages/auth/LoginPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const ForbiddenPage = lazy(() => import('@/pages/ForbiddenPage'));

const router = createBrowserRouter([
  // ── Client routes (path: "/") ──────────────────────────────────────────────
  ...clientRoutes,

  // ── Admin routes (path: "/admin/*") ───────────────────────────────────────
  ...adminRoutes,

  // ── Auth routes ───────────────────────────────────────────────────────────
  {
    element: <AuthLayout />,
    children: [{ path: 'login', element: <LoginPage /> }],
  },

  // ── Utility pages ─────────────────────────────────────────────────────────
  { path: '403', element: <ForbiddenPage /> },
  { path: '*', element: <NotFoundPage /> },
]);

export function AppRouter() {
  return (
    <Suspense fallback={<PageLoader />}>
      <RouterProvider router={router} />
    </Suspense>
  );
}
