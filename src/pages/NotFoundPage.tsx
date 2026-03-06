import { Link } from 'react-router-dom';
import { ROUTES } from '@/config/constants';
import { Button } from '@/components/ui/button';

export default function NotFoundPage() {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center gap-4 text-center'>
      <h1 className='text-7xl font-black'>404</h1>
      <p className='text-muted-foreground'>
        The page you're looking for doesn't exist.
      </p>
      <Button asChild>
        <Link to={ROUTES.HOME}>Go home</Link>
      </Button>
    </div>
  );
}
