import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { householdApi } from '@/api/household.api';
import { useHouseholdStore } from '@/store/useHouseholdStore';
import { QUERY_KEYS, ROUTES } from '@/config/constants';
import type { Household } from '@/types/household.types';

export function useHouseholdDetail(id: string | undefined) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { setCurrentHousehold } = useHouseholdStore();

  // Helper: sync both detail and list caches
  const syncHousehold = (updated: Household) => {
    queryClient.setQueryData([QUERY_KEYS.HOUSEHOLD, id], updated);
    queryClient.setQueryData<Household[]>([QUERY_KEYS.HOUSEHOLDS], (old = []) =>
      old.map((h) => (h.id === id ? updated : h)),
    );
  };

  const query = useQuery({
    queryKey: [QUERY_KEYS.HOUSEHOLD, id],
    queryFn: async () => {
      const res = await householdApi.getDetail(id!);
      return res.data.data;
    },
    enabled: !!id,
  });

  const updateMutation = useMutation({
    mutationFn: (name: string) => householdApi.update(id!, name),
    onSuccess: ({ data }) => {
      syncHousehold(data.data);
      setCurrentHousehold(data.data);
    },
  });

  const removeMemberMutation = useMutation({
    mutationFn: (targetUserId: string) =>
      householdApi.removeMember(id!, targetUserId),
    onSuccess: ({ data }) => syncHousehold(data.data),
  });

  const deleteMutation = useMutation({
    mutationFn: () => householdApi.remove(id!),
    onSuccess: () => {
      queryClient.setQueryData<Household[]>(
        [QUERY_KEYS.HOUSEHOLDS],
        (old = []) => old.filter((h) => h.id !== id),
      );
      setCurrentHousehold(null);
      navigate(ROUTES.HOUSEHOLDS, { replace: true });
    },
  });

  const createInviteMutation = useMutation({
    mutationFn: () => householdApi.createInvite(id!),
    onSuccess: ({ data }) => syncHousehold(data.data),
  });

  return {
    household: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    updateMutation,
    removeMemberMutation,
    deleteMutation,
    createInviteMutation,
  };
}
