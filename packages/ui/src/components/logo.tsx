'use client';

import { Montserrat } from 'next/font/google';
import Link from 'next/link';

import { cn } from '../lib/utils';
import { HrefType } from '../types';

const font = Montserrat({ weight: '600', subsets: ['latin'] });

export const Logo = ({ href }: { href: HrefType }) => (
  <Link href={href}>
    <div
      className={cn(
        'text-lavender flex select-none items-center justify-center gap-x-2 text-3xl font-bold transition hover:opacity-75',
        font.className,
      )}
    >
      RS
      <p className={cn('hidden lg:flex', font.className)}>Shonjoy</p>
    </div>
  </Link>
);
