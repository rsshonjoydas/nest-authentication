import Link from 'next/link';

import { siteConfig } from '../lib/site';
import { cn } from '../lib/utils';
import { Icons } from './icons';
import { ModeToggle } from './mode-toggle';
import { buttonVariants } from './ui/button';

export const NavAction = () => (
  <nav className='flex flex-1 items-center justify-end space-x-1'>
    <Link href={siteConfig.links.github} target='_blank' rel='noreferrer'>
      <div
        className={cn(
          buttonVariants({
            variant: 'icon',
            size: 'icon',
          }),
        )}
      >
        <Icons.GitHub className='h-4 w-4' />
        <span className='sr-only'>GitHub</span>
      </div>
    </Link>
    <Link href={siteConfig.links.twitter} target='_blank' rel='noreferrer'>
      <div
        className={cn(
          buttonVariants({
            variant: 'icon',
            size: 'icon',
          }),
        )}
      >
        <Icons.XTwitter className='h-4 w-4' />
        <span className='sr-only'>Twitter</span>
      </div>
    </Link>
    <ModeToggle />
  </nav>
);
