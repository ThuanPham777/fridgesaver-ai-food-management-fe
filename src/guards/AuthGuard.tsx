import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import type { UserRole } from '@/types/auth.types';
import { ROUTES } from '@/config/constants';

interface AuthGuardProps {
  children: ReactNode;
  /**
   * Roles allowed to access this route.
   * Leave undefined to allow any authenticated user.
   */
  allowedRoles?: UserRole[];
  /** Redirect destination when not authenticated. Defaults to /login. */
  redirectTo?: string;
}

/**
 * Wraps a route and guards it behind authentication (and optionally RBAC).
 *
 * Usage:
 *   <AuthGuard allowedRoles={['admin']}>
 *     <AdminDashboard />
 *   </AuthGuard>
 */
export function AuthGuard({
  children,
  allowedRoles,
  redirectTo = ROUTES.LOGIN,
}: AuthGuardProps) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    // Preserve the attempted URL so the login page can redirect back after login
    return (
      <Navigate
        to={redirectTo}
        state={{ from: location }}
        replace
      />
    );
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return (
      <Navigate
        to={ROUTES.FORBIDDEN}
        replace
      />
    );
  }

  return <>{children}</>;
}
