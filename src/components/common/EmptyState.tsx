import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function EmptyState({
  title = 'No results found',
  description = 'There is nothing to display here yet.',
  icon,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center gap-3 py-16 text-center',
        className,
      )}
    >
      {icon && <div className='text-muted-foreground text-5xl'>{icon}</div>}
      <h3 className='text-foreground text-lg font-semibold'>{title}</h3>
      <p className='text-muted-foreground max-w-sm text-sm'>{description}</p>
      {action && <div className='mt-2'>{action}</div>}
    </div>
  );
}
