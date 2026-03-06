import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { ClientLayout } from '@/layouts/ClientLayout';
import { AuthGuard } from '@/guards/AuthGuard';

const HomePage = lazy(() => import('@/pages/client/HomePage'));
const HouseholdsPage = lazy(() => import('@/pages/client/HouseholdsPage'));
const HouseholdDetailPage = lazy(
  () => import('@/pages/client/HouseholdDetailPage'),
);
const JoinHouseholdPage = lazy(
  () => import('@/pages/client/JoinHouseholdPage'),
);

export const clientRoutes: RouteObject[] = [
  {
    element: <ClientLayout />,
    children: [
      { index: true, element: <HomePage /> },
      {
        path: 'households',
        element: (
          <AuthGuard>
            <HouseholdsPage />
          </AuthGuard>
        ),
      },
      {
        path: 'households/join/:token',
        element: <JoinHouseholdPage />,
      },
      {
        path: 'households/:id',
        element: (
          <AuthGuard>
            <HouseholdDetailPage />
          </AuthGuard>
        ),
      },
    ],
  },
];
