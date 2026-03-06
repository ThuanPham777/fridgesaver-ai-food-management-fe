import { Link } from 'react-router-dom';
import { ROUTES } from '@/config/constants';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function LoginPage() {
  return (
    <Card>
      <CardHeader className='text-center'>
        <CardTitle>Sign in</CardTitle>
        <CardDescription>Enter your credentials to continue</CardDescription>
      </CardHeader>

      <CardContent>
        {/* Replace this form with your real auth form / auth provider */}
        <form className='flex flex-col gap-4'>
          <Input
            type='email'
            placeholder='Email'
          />
          <Input
            type='password'
            placeholder='Password'
          />
          <Button
            type='submit'
            className='w-full'
          >
            Sign in
          </Button>
        </form>

        <p className='text-muted-foreground mt-4 text-center text-xs'>
          Don&apos;t have an account?{' '}
          <Link
            to={ROUTES.HOME}
            className='text-primary hover:underline'
          >
            Sign up
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
