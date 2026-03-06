import { useEffect, useRef } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { householdApi } from '@/api/household.api';
import { QUERY_KEYS, ROUTES } from '@/config/constants';

export function useJoinHousehold(token: string | undefined) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const attempted = useRef(false);

  const mutation = useMutation({
    mutationFn: (inviteToken: string) => householdApi.joinByToken(inviteToken),
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.HOUSEHOLDS] });
      const household = data.data;
      const alreadyMember =
        data.message === 'Bạn đã là thành viên của hộ gia đình này';
      navigate(`${ROUTES.HOUSEHOLDS}/${household.id}`, {
        replace: true,
        state: { joinStatus: alreadyMember ? 'already-member' : 'joined' },
      });
    },
  });

  const attemptJoin = () => {
    if (!token || attempted.current) return;
    attempted.current = true;
    mutation.mutate(token);
  };

  // Reset ref when token changes
  useEffect(() => {
    attempted.current = false;
  }, [token]);

  return { ...mutation, attemptJoin };
}
