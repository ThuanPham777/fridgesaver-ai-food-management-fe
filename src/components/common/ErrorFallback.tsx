import type { AxiosError } from 'axios';
import type { ApiError } from '@/types/api.types';
import { Button } from '@/components/ui/button';

interface ErrorFallbackProps {
  error?: Error | AxiosError<ApiError> | null;
  onReset?: () => void;
}

export function ErrorFallback({ error, onReset }: ErrorFallbackProps) {
  const message =
    (error as AxiosError<ApiError>)?.response?.data?.message ??
    error?.message ??
    'An unexpected error occurred.';

  return (
    <div className='flex flex-col items-center justify-center gap-4 py-16 text-center'>
      <h2 className='text-destructive text-xl font-bold'>Error</h2>
      <p className='text-muted-foreground max-w-sm text-sm'>{message}</p>
      {onReset && (
        <Button
          variant='outline'
          onClick={onReset}
        >
          Try again
        </Button>
      )}
    </div>
  );
}
