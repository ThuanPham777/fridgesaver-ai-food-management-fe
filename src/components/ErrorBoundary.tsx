import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Replace with your error-reporting service (Sentry, etc.)
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className='flex min-h-screen flex-col items-center justify-center gap-4 p-8 text-center'>
          <h1 className='text-2xl font-bold text-destructive'>
            Something went wrong
          </h1>
          <p className='text-muted-foreground max-w-md text-sm'>
            {this.state.error?.message ?? 'An unexpected error occurred.'}
          </p>
          <Button
            variant='outline'
            onClick={() => this.setState({ hasError: false, error: null })}
          >
            Try again
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}
