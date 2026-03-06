import { lazy, Suspense } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { clientRoutes } from './client.routes';
import { adminRoutes } from './admin.routes';
import { AuthLayout } from '@/layouts/AuthLayout';
import { PageLoader } from '@/components/common/PageLoader';

const AdminLoginPage = lazy(() => import('@/pages/admin/AdminLoginPage'));
const ForgotPasswordPage = lazy(
  () => import('@/pages/auth/ForgotPasswordPage'),
);
const ResetPasswordPage = lazy(() => import('@/pages/auth/ResetPasswordPage'));
const OAuthCallbackPage = lazy(() => import('@/pages/auth/OAuthCallbackPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));
const ForbiddenPage = lazy(() => import('@/pages/ForbiddenPage'));

const router = createBrowserRouter([
  // ── Client routes (path: "/") ── login/register handled via modal in ClientLayout
  ...clientRoutes,

  // ── Admin routes (path: "/admin/*") ───────────────────────────────────────
  ...adminRoutes,

  // ── Admin login (separate AuthLayout page) ────────────────────────────
  {
    element: <AuthLayout />,
    children: [{ path: 'admin/login', element: <AdminLoginPage /> }],
  },

  // ── Standalone auth pages (password reset flow + OAuth) ──────────────────
  {
    element: <AuthLayout />,
    children: [
      { path: 'forgot-password', element: <ForgotPasswordPage /> },
      { path: 'reset-password', element: <ResetPasswordPage /> },
    ],
  },
  { path: 'auth/oauth/callback', element: <OAuthCallbackPage /> },

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
