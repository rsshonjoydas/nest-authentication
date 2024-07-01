import Link from 'next/link';

import { cn } from '../lib/utils';
import { buttonVariants } from './ui/button';

export const Policies = () => (
  <div className='text-primary -mt-8 flex items-center justify-center text-sm opacity-90'>
    <Link
      className={cn(
        buttonVariants({
          variant: 'link',
        }),
      )}
      href='/policies/terms-of-use'
      target='_blank'
    >
      Terms of use
    </Link>
    <span className='mx-2'>|</span>
    <Link
      className={cn(
        buttonVariants({
          variant: 'link',
        }),
      )}
      href='/policies/privacy-policy'
      target='_blank'
    >
      Privacy policy
    </Link>
  </div>
);
