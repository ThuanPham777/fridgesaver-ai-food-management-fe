import type { UserProfileDto, AuthUser } from '@/types/auth.types';

/**  Map backend UserProfileDto → client-side AuthUser. */
export function mapProfileToAuthUser(profile: UserProfileDto): AuthUser {
  return {
    id: profile.id,
    email: profile.email,
    fullName: profile.fullName,
    role: profile.role,
    avatarUrl: profile.avatarUrl ?? undefined,
    phone: profile.phone ?? undefined,
  };
}
