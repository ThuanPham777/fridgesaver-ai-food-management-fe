import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { AdminLayout } from '@/layouts/AdminLayout';
import { AuthGuard } from '@/guards/AuthGuard';
import { ROUTES } from '@/config/constants';

const DashboardPage = lazy(() => import('@/pages/admin/DashboardPage'));

export const adminRoutes: RouteObject[] = [
  {
    path: 'admin',
    element: (
      <AuthGuard
        allowedRoles={['ADMIN', 'SUPER_ADMIN']}
        redirectTo={ROUTES.ADMIN_LOGIN}
      >
        <AdminLayout />
      </AuthGuard>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'dashboard', element: <DashboardPage /> },
    ],
  },
];
