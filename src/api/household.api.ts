import apiClient from './client';
import { ENDPOINTS } from './endpoints';
import type { ApiResponse } from '@/types/api.types';
import type { Household } from '@/types/household.types';

export const householdApi = {
  getMyHouseholds: () =>
    apiClient.get<ApiResponse<Household[]>>(ENDPOINTS.HOUSEHOLDS.BASE),

  create: (name: string) =>
    apiClient.post<ApiResponse<Household>>(ENDPOINTS.HOUSEHOLDS.BASE, { name }),

  createInvite: (householdId: string) =>
    apiClient.post<ApiResponse<Household>>(
      ENDPOINTS.HOUSEHOLDS.INVITES(householdId),
    ),

  joinByToken: (token: string) =>
    apiClient.post<ApiResponse<Household>>(
      ENDPOINTS.HOUSEHOLDS.JOIN_TOKEN(token),
    ),

  getDetail: (id: string) =>
    apiClient.get<ApiResponse<Household>>(ENDPOINTS.HOUSEHOLDS.DETAIL(id)),

  update: (id: string, name: string) =>
    apiClient.patch<ApiResponse<Household>>(ENDPOINTS.HOUSEHOLDS.DETAIL(id), {
      name,
    }),

  removeMember: (id: string, userId: string) =>
    apiClient.delete<ApiResponse<Household>>(
      ENDPOINTS.HOUSEHOLDS.MEMBER(id, userId),
    ),

  remove: (id: string) =>
    apiClient.delete<ApiResponse<null>>(ENDPOINTS.HOUSEHOLDS.DETAIL(id)),
};
