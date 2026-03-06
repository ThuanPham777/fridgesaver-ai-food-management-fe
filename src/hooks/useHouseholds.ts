import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { householdApi } from '@/api/household.api';
import { QUERY_KEYS } from '@/config/constants';
import type { Household } from '@/types/household.types';
import type { AxiosError } from 'axios';

export function useHouseholdList() {
  return useQuery({
    queryKey: [QUERY_KEYS.HOUSEHOLDS],
    queryFn: async () => {
      const res = await householdApi.getMyHouseholds();
      return res.data.data;
    },
  });
}

export function useCreateHousehold(options?: {
  onSuccess?: (household: Household) => void;
  onError?: (message: string) => void;
}) {
  const queryClient = useQueryClient();

  const createMutation = useMutation({
    mutationFn: (name: string) => householdApi.create(name),
    onSuccess: async ({ data }) => {
      const household = data.data;
      queryClient.setQueryData<Household[]>(
        [QUERY_KEYS.HOUSEHOLDS],
        (old = []) => [...old, household],
      );

      // Chain: create invite link for the new household
      try {
        const inviteRes = await householdApi.createInvite(household.id);
        const updated = inviteRes.data.data;
        queryClient.setQueryData<Household[]>(
          [QUERY_KEYS.HOUSEHOLDS],
          (old = []) => old.map((h) => (h.id === updated.id ? updated : h)),
        );
        options?.onSuccess?.(updated);
      } catch {
        options?.onSuccess?.(household);
      }
    },
    onError: (err: AxiosError<{ message: string }>) => {
      options?.onError?.(
        err.response?.data?.message ?? 'Không thể tạo hộ gia đình',
      );
    },
  });

  return createMutation;
}
