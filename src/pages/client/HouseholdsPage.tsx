import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Users,
  Crown,
  Shield,
  Home,
  ChevronRight,
  Sparkles,
  Copy,
  Check,
} from 'lucide-react';

import { useAuthStore } from '@/store/useAuthStore';
import { useHouseholdStore } from '@/store/useHouseholdStore';
import { useHouseholdList, useCreateHousehold } from '@/hooks/useHouseholds';
import { useCopyToClipboard } from '@/hooks/useCopyToClipboard';
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

// Gradient palette for household cards
const CARD_GRADIENTS = [
  'from-emerald-500/10 to-teal-500/10 hover:from-emerald-500/15 hover:to-teal-500/15',
  'from-violet-500/10 to-purple-500/10 hover:from-violet-500/15 hover:to-purple-500/15',
  'from-amber-500/10 to-orange-500/10 hover:from-amber-500/15 hover:to-orange-500/15',
  'from-sky-500/10 to-blue-500/10 hover:from-sky-500/15 hover:to-blue-500/15',
  'from-rose-500/10 to-pink-500/10 hover:from-rose-500/15 hover:to-pink-500/15',
  'from-lime-500/10 to-green-500/10 hover:from-lime-500/15 hover:to-green-500/15',
];

const ICON_COLORS = [
  'text-emerald-600 bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/40',
  'text-violet-600 bg-violet-100 dark:text-violet-400 dark:bg-violet-900/40',
  'text-amber-600 bg-amber-100 dark:text-amber-400 dark:bg-amber-900/40',
  'text-sky-600 bg-sky-100 dark:text-sky-400 dark:bg-sky-900/40',
  'text-rose-600 bg-rose-100 dark:text-rose-400 dark:bg-rose-900/40',
  'text-lime-600 bg-lime-100 dark:text-lime-400 dark:bg-lime-900/40',
];

export default function HouseholdsPage() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { setCurrentHousehold } = useHouseholdStore();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [createdHousehold, setCreatedHousehold] = useState<Household | null>(
    null,
  );

  const { data: households = [], isLoading } = useHouseholdList();

  const handleViewDetail = (household: Household) => {
    setCurrentHousehold(household);
    navigate(`${ROUTES.HOUSEHOLDS}/${household.id}`);
  };

  const openCreateDialog = () => {
    setDialogOpen(true);
  };

  return (
    <div className='mx-auto max-w-5xl px-4 py-8'>
      {/* ── Hero header ── */}
      <div className='mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between'>
        <div className='space-y-1'>
          <div className='text-muted-foreground mb-2 flex items-center gap-2 text-sm'>
            <Home className='size-3.5' />
            Quản lý
          </div>
          <h1 className='text-3xl font-bold tracking-tight'>Hộ gia đình</h1>
          <p className='text-muted-foreground max-w-md text-[15px]'>
            Tạo hộ gia đình để cùng nhau quản lý thực phẩm và giảm lãng phí. Mời
            thành viên bằng link mời từ trang chi tiết.
          </p>
        </div>
        <div className='flex shrink-0 gap-2'>
          <Button onClick={openCreateDialog}>
            <Plus className='size-4' />
            Tạo mới
          </Button>
        </div>
      </div>

      {/* ── Content ── */}
      {isLoading ? (
        <div className='flex flex-col items-center justify-center py-24'>
          <LoadingSpinner size='lg' />
          <p className='text-muted-foreground mt-4 text-sm'>Đang tải...</p>
        </div>
      ) : households.length === 0 ? (
        /* ── Empty state ── */
        <div className='flex flex-col items-center justify-center rounded-2xl border-2 border-dashed py-24 text-center'>
          <div className='bg-muted mb-6 flex size-20 items-center justify-center rounded-2xl'>
            <Users className='text-muted-foreground size-10' />
          </div>
          <h2 className='text-xl font-semibold'>Chưa có hộ gia đình nào</h2>
          <p className='text-muted-foreground mt-2 max-w-sm text-sm'>
            Tạo hộ gia đình mới để bắt đầu quản lý thực phẩm cùng nhau, hoặc nhờ
            người thân gửi link mời cho bạn.
          </p>
          <div className='mt-8 flex gap-3'>
            <Button onClick={openCreateDialog}>
              <Plus className='size-4' />
              Tạo hộ gia đình
            </Button>
          </div>
        </div>
      ) : (
        <div className='grid gap-4 sm:grid-cols-2 lg:grid-cols-3'>
          {households.map((household, i) => (
            <HouseholdCard
              key={household.id}
              household={household}
              currentUserId={user?.id ?? ''}
              colorIndex={i % CARD_GRADIENTS.length}
              onView={() => handleViewDetail(household)}
            />
          ))}

          {/* ── Add new card ── */}
          <button
            type='button'
            onClick={() => openCreateDialog()}
            className='group flex min-h-45 cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed transition-colors hover:border-primary/40 hover:bg-accent/50'
          >
            <div className='flex size-12 items-center justify-center rounded-full bg-muted transition-colors group-hover:bg-primary/10'>
              <Plus className='size-5 text-muted-foreground transition-colors group-hover:text-primary' />
            </div>
            <span className='text-sm font-medium text-muted-foreground transition-colors group-hover:text-foreground'>
              Thêm hộ gia đình
            </span>
          </button>
        </div>
      )}

      {/* ── Dialogs ── */}
      <CreateHouseholdDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onCreated={setCreatedHousehold}
      />

      <InviteLinkDialog
        household={createdHousehold}
        onClose={() => setCreatedHousehold(null)}
        onView={(h) => {
          handleViewDetail(h);
          setCreatedHousehold(null);
        }}
      />
    </div>
  );
}

// ─── Create household dialog ────────────────────────────────────────────────

function CreateHouseholdDialog({
  open,
  onOpenChange,
  onCreated,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated: (household: Household) => void;
}) {
  const [newName, setNewName] = useState('');
  const [error, setError] = useState('');

  const createMutation = useCreateHousehold({
    onSuccess: (household) => {
      setNewName('');
      onOpenChange(false);
      setError('');
      onCreated(household);
    },
    onError: (message) => setError(message),
  });

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        if (!v) {
          onOpenChange(false);
          setError('');
          setNewName('');
        }
      }}
    >
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <div className='mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-primary/10'>
            <Sparkles className='size-6 text-primary' />
          </div>
          <DialogTitle className='text-center'>Tạo hộ gia đình mới</DialogTitle>
          <DialogDescription className='text-center'>
            Đặt tên cho hộ gia đình. Sau khi tạo, bạn có thể tạo link mời để mời
            thành viên.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (newName.trim()) createMutation.mutate(newName.trim());
          }}
        >
          <div className='space-y-4 py-2'>
            <div className='space-y-2'>
              <label className='text-sm font-medium'>Tên hộ gia đình</label>
              <Input
                placeholder='VD: Gia đình Nguyễn Văn A'
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                maxLength={100}
                autoFocus
              />
            </div>
            {error && (
              <p className='rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive'>
                {error}
              </p>
            )}
          </div>
          <DialogFooter className='mt-2'>
            <Button
              type='button'
              variant='ghost'
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </Button>
            <Button
              type='submit'
              disabled={!newName.trim() || createMutation.isPending}
            >
              {createMutation.isPending && (
                <LoadingSpinner
                  size='sm'
                  className='mr-1'
                />
              )}
              Tạo hộ gia đình
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// ─── Invite link dialog (shown after create) ────────────────────────────────

function InviteLinkDialog({
  household,
  onClose,
  onView,
}: {
  household: Household | null;
  onClose: () => void;
  onView: (household: Household) => void;
}) {
  const { copied, copy } = useCopyToClipboard();

  const inviteLink = household?.activeInvite
    ? `${window.location.origin}/households/join/${household.activeInvite.token}`
    : '';

  return (
    <Dialog
      open={!!household}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <div className='mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30'>
            <Check className='size-6 text-emerald-600 dark:text-emerald-400' />
          </div>
          <DialogTitle className='text-center'>Tạo thành công!</DialogTitle>
          <DialogDescription className='text-center'>
            Hộ gia đình <strong>{household?.name}</strong> đã được tạo. Chia sẻ
            link bên dưới để mời thành viên.
          </DialogDescription>
        </DialogHeader>
        {inviteLink && (
          <div className='space-y-3 py-2'>
            <div className='w-full break-all rounded-lg border bg-muted/30 px-3 py-3 text-sm font-mono select-all'>
              {inviteLink}
            </div>
            <Button
              variant={copied ? 'default' : 'outline'}
              className='w-full'
              onClick={() => copy(inviteLink)}
            >
              {copied ? (
                <>
                  <Check className='size-4' />
                  Đã sao chép!
                </>
              ) : (
                <>
                  <Copy className='size-4' />
                  Sao chép link mời
                </>
              )}
            </Button>
          </div>
        )}
        <DialogFooter>
          <Button
            className='w-full'
            onClick={() => household && onView(household)}
          >
            Xem hộ gia đình
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// ─── Household card ─────────────────────────────────────────────────────────

function HouseholdCard({
  household,
  currentUserId,
  colorIndex,
  onView,
}: {
  household: Household;
  currentUserId: string;
  colorIndex: number;
  onView: () => void;
}) {
  const isOwner = household.ownerId === currentUserId;
  const currentMember = household.members.find(
    (m) => m.userId === currentUserId,
  );
  const isAdmin = currentMember?.role === 'admin';

  return (
    <Card
      className={`group cursor-pointer bg-linear-to-br transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${CARD_GRADIENTS[colorIndex]}`}
      onClick={onView}
    >
      <CardHeader className='pb-3'>
        <div className='flex items-start justify-between'>
          <div
            className={`flex size-10 items-center justify-center rounded-lg ${ICON_COLORS[colorIndex]}`}
          >
            <Home className='size-5' />
          </div>
          <div className='flex items-center gap-1.5'>
            {isOwner && (
              <Badge className='gap-1 border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-900/30 dark:text-amber-400'>
                <Crown className='size-3' />
                Owner
              </Badge>
            )}
            {isAdmin && !isOwner && (
              <Badge
                variant='secondary'
                className='gap-1'
              >
                <Shield className='size-3' />
                Admin
              </Badge>
            )}
          </div>
        </div>
        <CardTitle className='mt-3 text-lg leading-tight'>
          {household.name}
        </CardTitle>
        <CardDescription className='flex items-center gap-1.5'>
          <Users className='size-3.5' />
          {household.members.length} thành viên
        </CardDescription>
      </CardHeader>
      <CardContent className='pt-0'>
        <div className='flex items-center justify-between'>
          {/* Member avatars */}
          <div className='flex -space-x-2'>
            {household.members.slice(0, 4).map((member) => (
              <Tooltip key={member.id}>
                <TooltipTrigger asChild>
                  <span>
                    <Avatar className='size-8 border-2 border-background'>
                      <AvatarImage
                        src={member.user.avatarUrl ?? undefined}
                        alt={member.user.fullName}
                      />
                      <AvatarFallback className='text-xs font-medium'>
                        {member.user.fullName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </span>
                </TooltipTrigger>
                <TooltipContent>{member.user.fullName}</TooltipContent>
              </Tooltip>
            ))}
            {household.members.length > 4 && (
              <div className='flex size-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium text-muted-foreground'>
                +{household.members.length - 4}
              </div>
            )}
          </div>

          {/* Arrow indicator */}
          <ChevronRight className='size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5' />
        </div>
      </CardContent>
    </Card>
  );
}
