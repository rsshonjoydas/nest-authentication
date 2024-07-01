'use client';

import Link from 'next/link';
import { buttonVariants, cn } from 'ui';

export const links = [
  {
    label: 'About',
    href: '#about',
  },
  {
    label: 'Projects',
    href: '#projects',
  },
  {
    label: 'Contact',
    href: '#contact',
  },
] as const;

interface NavItemProps {
  className?: string;
}

export const NavItem = ({ className }: NavItemProps) => (
  <div className={className}>
    {links.map((link) => (
      <Link
        key={link.href}
        className={cn(
          buttonVariants({
            variant: 'icon',
          }),
          'hover:text-lavender relative rounded-md px-2 py-2 text-sm font-medium transition-all duration-500 ease-out',
        )}
        href={link.href}
      >
        <span className='relative z-10'>{link.label}</span>
      </Link>
    ))}
  </div>
);
