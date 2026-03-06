// Types matching the Household API responses

export type HouseholdMemberRole = 'admin' | 'member';

export interface HouseholdMemberUser {
  id: string;
  fullName: string;
  email: string;
  avatarUrl: string | null;
}

export interface HouseholdMember {
  id: string;
  householdId: string;
  userId: string;
  role: HouseholdMemberRole;
  joinedAt: string;
  user: HouseholdMemberUser;
}

export interface Household {
  id: string;
  name: string;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  owner: HouseholdMemberUser;
  members: HouseholdMember[];
  activeInvite: HouseholdInvite | null;
}

export interface HouseholdInvite {
  id: string;
  token: string;
  expiresAt: string;
  createdAt: string;
}
