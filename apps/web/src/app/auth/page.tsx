import Link from 'next/link';
import { Button } from 'ui';

const AuthPage = () => (
  <section>
    <div className='my-8 text-sm dark:text-gray-400'>
      <span className='h-auto w-auto space-y-2 text-lg'>
        <p className='flex items-center justify-center'>Welcome to Redolence</p>
        <p className='flex items-center justify-center'>
          Log in with your Redolence account to continue
        </p>
      </span>
    </div>

    <span className='-mt-3 flex items-center justify-center gap-2 text-sm'>
      <Button variant='primary' className='h-12 w-20'>
        <Link href='/auth/login'>Login</Link>
      </Button>{' '}
      <Button variant='primary' className='h-12 w-20'>
        <Link href='/auth/register'>Sign&nbsp;up</Link>
      </Button>
    </span>
  </section>
);

export default AuthPage;
