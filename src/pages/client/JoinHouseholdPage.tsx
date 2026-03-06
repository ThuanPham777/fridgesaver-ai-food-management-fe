import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { XCircle, LogIn } from 'lucide-react';

import { householdApi } from '@/api/household.api';
import { useAuthStore } from '@/store/useAuthStore';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { AuthModal } from '@/components/auth/AuthModal';
import { ROUTES } from '@/config/constants';

export default function JoinHouseholdPage() {
  const { token } = useParams<{ token: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { isAuthenticated } = useAuthStore();
  const attempted = useRef(false);

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'register'>('login');

  const joinMutation = useMutation({
    mutationFn: (inviteToken: string) => householdApi.joinByToken(inviteToken),
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({ queryKey: ['households'] });
      const household = data.data;
      const alreadyMember =
        data.message === 'Bạn đã là thành viên của hộ gia đình này';
      navigate(`${ROUTES.HOUSEHOLDS}/${household.id}`, {
        replace: true,
        state: { joinStatus: alreadyMember ? 'already-member' : 'joined' },
      });
    },
  });

  // Auto-join when authenticated and token available
  useEffect(() => {
    if (!token || !isAuthenticated || attempted.current) return;
    attempted.current = true;
    joinMutation.mutate(token);
  }, [token, isAuthenticated]);

  // ── Not authenticated ──
  if (!isAuthenticated) {
    return (
      <div className='flex flex-col items-center justify-center py-32 text-center'>
        <div className='mb-4 flex size-16 items-center justify-center rounded-full bg-primary/10'>
          <LogIn className='size-8 text-primary' />
        </div>
        <h2 className='text-xl font-semibold'>Đăng nhập để tham gia</h2>
        <p className='text-muted-foreground mt-1 max-w-sm text-sm'>
          Bạn cần đăng nhập hoặc tạo tài khoản để tham gia hộ gia đình.
        </p>
        <div className='mt-6 flex gap-3'>
          <Button
            variant='outline'
            onClick={() => {
              setAuthTab('login');
              setAuthModalOpen(true);
            }}
          >
            Đăng nhập
          </Button>
          <Button
            onClick={() => {
              setAuthTab('register');
              setAuthModalOpen(true);
            }}
          >
            Đăng ký
          </Button>
        </div>

        <AuthModal
          open={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          defaultTab={authTab}
        />
      </div>
    );
  }

  // ── Loading (pending or idle before effect fires, or navigating after success) ──
  if (joinMutation.isPending || joinMutation.isIdle || joinMutation.isSuccess) {
    return (
      <div className='flex flex-col items-center justify-center py-32'>
        <LoadingSpinner size='lg' />
        <p className='text-muted-foreground mt-4 text-sm'>
          Đang tham gia hộ gia đình...
        </p>
      </div>
    );
  }

  // ── Error ──
  if (joinMutation.isError) {
    const message =
      (joinMutation.error as any)?.response?.data?.message ??
      'Không thể tham gia hộ gia đình. Link mời có thể đã hết hạn hoặc không tồn tại.';
    return (
      <div className='flex flex-col items-center justify-center py-32 text-center'>
        <div className='mb-4 flex size-16 items-center justify-center rounded-full bg-destructive/10'>
          <XCircle className='size-8 text-destructive' />
        </div>
        <h2 className='text-xl font-semibold'>Không thể tham gia</h2>
        <p className='text-muted-foreground mt-1 max-w-sm text-sm'>{message}</p>
        <Button
          variant='outline'
          className='mt-6'
          onClick={() => navigate(ROUTES.HOUSEHOLDS, { replace: true })}
        >
          Về danh sách hộ gia đình
        </Button>
      </div>
    );
  }

  return null;
}
