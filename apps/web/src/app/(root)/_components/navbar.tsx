'use client';

import { Logo } from 'ui';

import { NavItem } from './nav-item';

export const Navbar = () => (
  <>
    <div className='flex flex-1 items-center justify-center md:items-stretch md:justify-start'>
      <div className='flex flex-shrink-0 items-center'>
        <Logo href='/' />
      </div>
    </div>
    <div className='items-center justify-between md:justify-center lg:justify-end'>
      <nav className='hidden justify-end p-3 md:flex'>
        <NavItem className='flex gap-6' />
      </nav>
    </div>
  </>
);
