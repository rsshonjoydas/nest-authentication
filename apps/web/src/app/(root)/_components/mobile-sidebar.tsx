'use client';

import { Menu } from 'lucide-react';
import { Button, Sheet, SheetClose, SheetContent, SheetTrigger } from 'ui';

import { NavItem } from './nav-item';

export const MobileSidebar = () => (
  <nav className='inline-flex cursor-pointer items-center justify-center md:hidden'>
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant='icon'
          size='icon'
          className='-ml-3 block justify-start px-2 md:hidden'
        >
          <Menu className='h-6 w-6' />
        </Button>
      </SheetTrigger>
      <SheetContent side='left'>
        <SheetClose>
          <NavItem className='flex flex-col items-start justify-start space-y-6 pt-3' />
        </SheetClose>
      </SheetContent>
    </Sheet>
  </nav>
);
