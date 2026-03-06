import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  ArrowLeft,
  Copy,
  Check,
  CheckCircle2,
  Pencil,
  Trash2,
  UserMinus,
  Crown,
  Shield,
  Users,
  Home,
  AlertTriangle,
  X,
  Link2,
} from 'lucide-react';

import { householdApi } from '@/api/household.api';
import { useAuthStore } from '@/store/useAuthStore';
import { useHouseholdStore } from '@/store/useHouseholdStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ROUTES } from '@/config/constants';
import type { Household } from '@/types/household.types';

export default function HouseholdDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  const { setCurrentHousehold } = useHouseholdStore();

  const [joinBanner, setJoinBanner] = useState<string | null>(null);

  // Read join status from router state (set by JoinHouseholdPage)
  useEffect(() => {
    const state = location.state as { joinStatus?: string } | null;
    if (!state?.joinStatus) return;

    if (state.joinStatus === 'joined') {
      setJoinBanner('Bạn đã tham gia hộ gia đình thành công!');
    } else if (state.joinStatus === 'already-member') {
      setJoinBanner('Bạn đã là thành viên của hộ gia đình này.');
    }

    // Clear state so banner doesn't reappear on refresh
    window.history.replaceState({}, '');

    // Auto-dismiss after 5s
    const timer = setTimeout(() => setJoinBanner(null), 5000);
    return () => clearTimeout(timer);
  }, [location.state]);

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [kickTarget, setKickTarget] = useState<{
    userId: string;
    name: string;
  } | null>(null);

  // ── Fetch detail ──
  const {
    data: household,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['household', id],
    queryFn: async () => {
      const res = await householdApi.getDetail(id!);
      return res.data.data;
    },
    enabled: !!id,
  });

  const isOwner = household?.ownerId === user?.id;
  const currentMember = household?.members.find((m) => m.userId === user?.id);
  const isAdmin = currentMember?.role === 'admin';

  // Derive invite link from household data (persisted, survives reload)
  const inviteLink = household?.activeInvite
    ? `${window.location.origin}/households/join/${household.activeInvite.token}`
    : '';

  // helper to sync both caches
  const syncHousehold = (updated: Household) => {
    queryClient.setQueryData(['household', id], updated);
    queryClient.setQueryData<Household[]>(['households'], (old = []) =>
      old.map((h) => (h.id === id ? updated : h)),
    );
  };

  // ── Update name ──
  const updateMutation = useMutation({
    mutationFn: (name: string) => householdApi.update(id!, name),
    onSuccess: ({ data }) => {
      const updated = data.data;
      syncHousehold(updated);
      setCurrentHousehold(updated);
      setIsEditing(false);
      setError('');
    },
    onError: (err: any) => {
      setError(err.response?.data?.message ?? 'Không thể cập nhật');
    },
  });

  // ── Remove member ──
  const removeMemberMutation = useMutation({
    mutationFn: (targetUserId: string) =>
      householdApi.removeMember(id!, targetUserId),
    onSuccess: ({ data }) => {
      syncHousehold(data.data);
      setKickTarget(null);
    },
    onError: (err: any) => {
      setError(err.response?.data?.message ?? 'Không thể xóa thành viên');
      setKickTarget(null);
    },
  });

  // ── Delete household ──
  const deleteMutation = useMutation({
    mutationFn: () => householdApi.remove(id!),
    onSuccess: () => {
      queryClient.setQueryData<Household[]>(['households'], (old = []) =>
        old.filter((h) => h.id !== id),
      );
      setCurrentHousehold(null);
      navigate(ROUTES.HOUSEHOLDS, { replace: true });
    },
    onError: (err: any) => {
      setError(err.response?.data?.message ?? 'Không thể xóa hộ gia đình');
      setDeleteDialogOpen(false);
    },
  });

  // ── Create invite link (admin only) ──
  const createInviteMutation = useMutation({
    mutationFn: () => householdApi.createInvite(id!),
    onSuccess: ({ data }) => {
      syncHousehold(data.data);
      setError('');
    },
    onError: (err: any) => {
      setError(err.response?.data?.message ?? 'Không thể tạo link mời');
    },
  });

  const handleCopyLink = async () => {
    if (!inviteLink) return;
    await navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleStartEdit = () => {
    if (!household) return;
    setEditName(household.name);
    setIsEditing(true);
    setError('');
  };

  // ── Loading skeleton ──
  if (isLoading) {
    return (
      <div className='mx-auto max-w-5xl px-4 py-8'>
        <Skeleton className='mb-6 h-5 w-24' />
        <div className='space-y-6'>
          <div className='space-y-3'>
            <Skeleton className='h-8 w-64' />
            <Skeleton className='h-4 w-40' />
          </div>
          <div className='grid gap-6 lg:grid-cols-3'>
            <div className='lg:col-span-2'>
              <Skeleton className='h-64 rounded-xl' />
            </div>
            <Skeleton className='h-48 rounded-xl' />
          </div>
        </div>
      </div>
    );
  }

  if (isError || !household) {
    return (
      <div className='mx-auto flex max-w-5xl flex-col items-center justify-center px-4 py-24 text-center'>
        <div className='mb-4 flex size-16 items-center justify-center rounded-2xl bg-destructive/10'>
          <AlertTriangle className='size-8 text-destructive' />
        </div>
        <h2 className='text-xl font-semibold'>Không thể tải thông tin</h2>
        <p className='text-muted-foreground mt-1 text-sm'>
          Hộ gia đình không tồn tại hoặc bạn không có quyền truy cập.
        </p>
        <Button
          variant='outline'
          className='mt-6'
          onClick={() => navigate(ROUTES.HOUSEHOLDS)}
        >
          <ArrowLeft className='size-4' />
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  return (
    <div className='mx-auto max-w-5xl px-4 py-8'>
      {/* ── Breadcrumb row ── */}
      <button
        type='button'
        onClick={() => navigate(ROUTES.HOUSEHOLDS)}
        className='text-muted-foreground hover:text-foreground mb-6 flex items-center gap-1.5 text-sm transition-colors'
      >
        <ArrowLeft className='size-3.5' />
        Hộ gia đình
      </button>

      {/* ── Join notification banner ── */}
      {joinBanner && (
        <div className='mb-6 flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 dark:border-emerald-800 dark:bg-emerald-950/30'>
          <CheckCircle2 className='size-5 shrink-0 text-emerald-600 dark:text-emerald-400' />
          <p className='flex-1 text-sm font-medium text-emerald-800 dark:text-emerald-300'>
            {joinBanner}
          </p>
          <button
            type='button'
            onClick={() => setJoinBanner(null)}
            className='shrink-0 rounded-md p-1 text-emerald-600 hover:bg-emerald-100 dark:text-emerald-400 dark:hover:bg-emerald-900/50'
          >
            <X className='size-4' />
          </button>
        </div>
      )}

      {/* ── Header ── */}
      <div className='mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between'>
        <div className='flex items-start gap-4'>
          <div className='flex size-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-primary/20 to-primary/5'>
            <Home className='size-7 text-primary' />
          </div>
          <div>
            {isEditing ? (
              <form
                className='flex items-center gap-2'
                onSubmit={(e) => {
                  e.preventDefault();
                  if (editName.trim()) updateMutation.mutate(editName.trim());
                }}
              >
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  maxLength={100}
                  className='h-9 text-lg font-bold'
                  autoFocus
                />
                <Button
                  type='submit'
                  size='sm'
                  disabled={!editName.trim() || updateMutation.isPending}
                >
                  {updateMutation.isPending ? (
                    <LoadingSpinner size='sm' />
                  ) : (
                    'Lưu'
                  )}
                </Button>
                <Button
                  type='button'
                  variant='ghost'
                  size='sm'
                  onClick={() => setIsEditing(false)}
                >
                  <X className='size-4' />
                </Button>
              </form>
            ) : (
              <h1 className='text-2xl font-bold tracking-tight sm:text-3xl'>
                {household.name}
              </h1>
            )}
            <p className='text-muted-foreground mt-0.5 flex items-center gap-1.5 text-sm'>
              <Users className='size-3.5' />
              {household.members.length} thành viên
              {isOwner && (
                <Badge className='ml-2 gap-1 border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-400'>
                  <Crown className='size-3' />
                  Owner
                </Badge>
              )}
              {isAdmin && !isOwner && (
                <Badge
                  variant='secondary'
                  className='ml-2 gap-1'
                >
                  <Shield className='size-3' />
                  Admin
                </Badge>
              )}
            </p>
          </div>
        </div>

        {!isEditing && (
          <div className='flex gap-2'>
            {isAdmin && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={handleStartEdit}
                  >
                    <Pencil className='size-4' />
                    Đổi tên
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Chỉnh sửa tên hộ gia đình</TooltipContent>
              </Tooltip>
            )}
            {isOwner && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => setDeleteDialogOpen(true)}
                    className='border-destructive/30 text-destructive hover:bg-destructive/10 hover:text-destructive'
                  >
                    <Trash2 className='size-4' />
                    Xóa
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Xóa hộ gia đình vĩnh viễn</TooltipContent>
              </Tooltip>
            )}
          </div>
        )}
      </div>

      {/* ── Error banner ── */}
      {error && (
        <div className='mb-6 flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3'>
          <AlertTriangle className='size-4 shrink-0 text-destructive' />
          <p className='flex-1 text-sm text-destructive'>{error}</p>
          <button
            type='button'
            onClick={() => setError('')}
            className='text-destructive/60 hover:text-destructive'
          >
            <X className='size-4' />
          </button>
        </div>
      )}

      {/* ── Body ── */}
      <div className='grid gap-6 lg:grid-cols-3'>
        {/* ── Members section ── */}
        <Card className='lg:col-span-2'>
          <CardHeader>
            <CardTitle className='flex items-center gap-2 text-base'>
              <Users className='size-4' />
              Thành viên
            </CardTitle>
            <CardDescription>
              {household.members.length} người trong hộ gia đình
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className='divide-y'>
              {household.members.map((member) => {
                const isMemberOwner = member.userId === household.ownerId;
                const isMemberAdmin = member.role === 'admin';
                const canKick =
                  isAdmin && member.userId !== user?.id && !isMemberOwner;

                return (
                  <div
                    key={member.id}
                    className='flex items-center justify-between py-3 first:pt-0 last:pb-0'
                  >
                    <div className='flex items-center gap-3'>
                      <Avatar className='size-10'>
                        <AvatarImage
                          src={member.user.avatarUrl ?? undefined}
                          alt={member.user.fullName}
                        />
                        <AvatarFallback className='text-sm font-medium'>
                          {member.user.fullName.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className='min-w-0'>
                        <p className='flex items-center gap-1.5 text-sm font-medium'>
                          <span className='truncate'>
                            {member.user.fullName}
                          </span>
                          {member.userId === user?.id && (
                            <span className='text-muted-foreground text-xs font-normal'>
                              (bạn)
                            </span>
                          )}
                        </p>
                        <p className='text-muted-foreground truncate text-xs'>
                          {member.user.email}
                        </p>
                      </div>
                    </div>

                    <div className='flex shrink-0 items-center gap-2'>
                      {isMemberOwner && (
                        <Badge className='gap-1 border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-400'>
                          <Crown className='size-3' />
                          Owner
                        </Badge>
                      )}
                      {isMemberAdmin && !isMemberOwner && (
                        <Badge
                          variant='secondary'
                          className='gap-1'
                        >
                          <Shield className='size-3' />
                          Admin
                        </Badge>
                      )}
                      {canKick && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant='ghost'
                              size='sm'
                              className='size-8 p-0 text-muted-foreground hover:text-destructive'
                              onClick={() =>
                                setKickTarget({
                                  userId: member.userId,
                                  name: member.user.fullName,
                                })
                              }
                              disabled={removeMemberMutation.isPending}
                            >
                              <UserMinus className='size-4' />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            Xóa {member.user.fullName}
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* ── Invite link sidebar ── */}
        <div className='space-y-6'>
          <Card className='overflow-hidden'>
            <CardHeader className='bg-linear-to-br from-primary/5 to-transparent'>
              <CardTitle className='flex items-center gap-2 text-base'>
                <Link2 className='size-4 text-primary' />
                Link mời thành viên
              </CardTitle>
              <CardDescription>
                Chia sẻ link này để mời người thân tham gia
              </CardDescription>
            </CardHeader>
            <CardContent className='pt-4'>
              <div className='flex flex-col gap-4'>
                {inviteLink ? (
                  <>
                    <div className='w-full break-all rounded-lg border bg-muted/30 px-3 py-3 text-sm font-mono select-all'>
                      {inviteLink}
                    </div>
                    <div className='flex gap-2'>
                      <Button
                        variant={copied ? 'default' : 'outline'}
                        className='flex-1'
                        onClick={handleCopyLink}
                      >
                        {copied ? (
                          <>
                            <Check className='size-4' />
                            Đã chép!
                          </>
                        ) : (
                          <>
                            <Copy className='size-4' />
                            Sao chép link
                          </>
                        )}
                      </Button>
                      {isAdmin && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant='outline'
                              onClick={() => createInviteMutation.mutate()}
                              disabled={createInviteMutation.isPending}
                            >
                              {createInviteMutation.isPending ? (
                                <LoadingSpinner size='sm' />
                              ) : (
                                <Link2 className='size-4' />
                              )}
                              Tạo lại
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            Tạo link mới (link cũ sẽ hết hạn)
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>
                    <p className='text-muted-foreground text-xs text-center'>
                      Link có hiệu lực đến{' '}
                      {new Date(
                        household.activeInvite!.expiresAt,
                      ).toLocaleDateString('vi-VN')}
                    </p>
                  </>
                ) : (
                  <div className='text-center py-2'>
                    {isAdmin ? (
                      <Button
                        onClick={() => createInviteMutation.mutate()}
                        disabled={createInviteMutation.isPending}
                        className='w-full'
                      >
                        {createInviteMutation.isPending ? (
                          <LoadingSpinner
                            size='sm'
                            className='mr-1'
                          />
                        ) : (
                          <Link2 className='size-4' />
                        )}
                        Tạo link mời
                      </Button>
                    ) : (
                      <p className='text-muted-foreground text-sm'>
                        Chưa có link mời. Nhờ admin tạo link mới.
                      </p>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Quick stats */}
          <Card>
            <CardHeader>
              <CardTitle className='text-base'>Thông tin</CardTitle>
            </CardHeader>
            <CardContent className='space-y-3'>
              <div className='flex items-center justify-between text-sm'>
                <span className='text-muted-foreground'>Thành viên</span>
                <span className='font-medium'>
                  {household.members.length} người
                </span>
              </div>
              <Separator />
              <div className='flex items-center justify-between text-sm'>
                <span className='text-muted-foreground'>Admin</span>
                <span className='font-medium'>
                  {household.members.filter((m) => m.role === 'admin').length}{' '}
                  người
                </span>
              </div>
              <Separator />
              <div className='flex items-center justify-between text-sm'>
                <span className='text-muted-foreground'>Ngày tạo</span>
                <span className='font-medium'>
                  {new Date(household.createdAt).toLocaleDateString('vi-VN')}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── Delete confirmation dialog ── */}
      <Dialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      >
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <div className='mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-destructive/10'>
              <AlertTriangle className='size-6 text-destructive' />
            </div>
            <DialogTitle className='text-center'>Xóa hộ gia đình?</DialogTitle>
            <DialogDescription className='text-center'>
              Bạn có chắc chắn muốn xóa{' '}
              <strong className='text-foreground'>{household.name}</strong>?
              Hành động này không thể hoàn tác và tất cả dữ liệu sẽ bị mất.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='mt-2 gap-2 sm:gap-0'>
            <Button
              variant='ghost'
              onClick={() => setDeleteDialogOpen(false)}
            >
              Hủy
            </Button>
            <Button
              variant='destructive'
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending && (
                <LoadingSpinner
                  size='sm'
                  className='mr-1'
                />
              )}
              Xóa vĩnh viễn
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Kick member confirmation dialog ── */}
      <Dialog
        open={!!kickTarget}
        onOpenChange={(open) => !open && setKickTarget(null)}
      >
        <DialogContent className='sm:max-w-md'>
          <DialogHeader>
            <div className='mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-destructive/10'>
              <UserMinus className='size-6 text-destructive' />
            </div>
            <DialogTitle className='text-center'>Xóa thành viên?</DialogTitle>
            <DialogDescription className='text-center'>
              Bạn có chắc chắn muốn xóa{' '}
              <strong className='text-foreground'>{kickTarget?.name}</strong>{' '}
              khỏi hộ gia đình?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className='mt-2 gap-2 sm:gap-0'>
            <Button
              variant='ghost'
              onClick={() => setKickTarget(null)}
            >
              Hủy
            </Button>
            <Button
              variant='destructive'
              onClick={() =>
                kickTarget && removeMemberMutation.mutate(kickTarget.userId)
              }
              disabled={removeMemberMutation.isPending}
            >
              {removeMemberMutation.isPending && (
                <LoadingSpinner
                  size='sm'
                  className='mr-1'
                />
              )}
              Xóa thành viên
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
