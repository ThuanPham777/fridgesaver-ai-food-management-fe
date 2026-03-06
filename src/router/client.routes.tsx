import { lazy } from 'react';
import type { RouteObject } from 'react-router-dom';
import { ClientLayout } from '@/layouts/ClientLayout';

const HomePage = lazy(() => import('@/pages/client/HomePage'));

export const clientRoutes: RouteObject[] = [
  {
    element: <ClientLayout />,
    children: [
      { index: true, element: <HomePage /> },
      // Add more client routes here
    ],
  },
];
