import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/store/useAuthStore';
import { authApi } from '@/api/auth.api';
import { ROUTES } from '@/config/constants';
import { PageLoader } from '@/components/common/PageLoader';
import type { AuthUser } from '@/types/auth.types';

/**
 * Handles the redirect from the backend Google OAuth callback.
 * URL format: /auth/oauth/callback?accessToken=...
 * The refresh token is already set as an HttpOnly cookie by the backend redirect.
 */
export default function OAuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const accessToken = searchParams.get('accessToken');

    if (!accessToken) {
      navigate(ROUTES.HOME, { replace: true });
      return;
    }

    // Store access token in-memory so the /me request is authenticated
    useAuthStore.getState().setAccessToken(accessToken);

    authApi
      .me()
      .then(({ data }) => {
        const profile = data.data;
        const user: AuthUser = {
          id: profile.id,
          email: profile.email,
          fullName: profile.fullName,
          role: profile.role,
          avatarUrl: profile.avatarUrl ?? undefined,
          phone: profile.phone ?? undefined,
        };
        setAuth(user, { accessToken });
        navigate(ROUTES.HOME, { replace: true });
      })
      .catch(() => {
        useAuthStore.getState().clearAuth();
        navigate(ROUTES.HOME, { replace: true });
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <PageLoader />;
}
