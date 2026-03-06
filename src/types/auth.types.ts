// Must match Prisma UserRole enum (uppercase)
export type UserRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  avatarUrl?: string;
  phone?: string;
}

/** Only the access token is held client-side. Refresh token lives in an HttpOnly cookie. */
export interface AuthTokens {
  accessToken: string;
}

export interface AuthState {
  user: AuthUser | null;
  tokens: AuthTokens | null;
  isAuthenticated: boolean;
}

// Backend response shapes
export interface UserProfileDto {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  avatarUrl: string | null;
  role: UserRole;
  address: unknown | null;
  language: string | null;
  createdAt: string;
}

/** Backend login/register response — no refreshToken (it's in an HttpOnly cookie) */
export interface AuthResponseDto {
  accessToken: string;
  user: UserProfileDto;
}
