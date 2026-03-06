import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { AdminLayout } from '@/layouts/AdminLayout';
import { AuthGuard } from '@/guards/AuthGuard';

const DashboardPage = lazy(() => import('@/pages/admin/DashboardPage'));

export const adminRoutes: RouteObject[] = [
  {
    path: 'admin',
    element: (
      <AuthGuard allowedRoles={['admin', 'super_admin']}>
        <AdminLayout />
      </AuthGuard>
    ),
    children: [
      { index: true, element: <DashboardPage /> },
      { path: 'dashboard', element: <DashboardPage /> },
      // Add more admin routes here:
      // { path: 'users', element: <UsersPage /> },
    ],
  },
];
