'use client';

import { cn, NavAction, UserProfile, useScrollTop } from 'ui';

import useUser from '@/hooks/use-user';

import { MobileSidebar } from './mobile-sidebar';
import { Navbar } from './navbar';

export const Header = () => {
  const scrolled = useScrollTop();
  const { user } = useUser();

  return (
    <header
      className={cn(
        'supports-backdrop-blur:bg-background/60 bg-background/80 sticky top-0 z-50 w-full backdrop-blur',
        scrolled && 'border-b shadow-sm dark:border-slate-700/70',
      )}
    >
      <div className='container flex h-14 items-center justify-between bg-transparent p-4'>
        <div className='container mx-auto px-4 sm:px-6'>
          <div className='flex items-center justify-between md:justify-center lg:justify-end'>
            <MobileSidebar />
            <Navbar />
          </div>
        </div>
        <NavAction />
        {user && <UserProfile user={user} />}
      </div>
    </header>
  );
};
