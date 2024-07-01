import type { Metadata } from 'next';
import { Policies } from 'ui';

import { Header } from './_components/header';

export const metadata: Metadata = {
  title: 'Auth',
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
      <div className='flex h-[90vh] items-center justify-center'>
        {children}
      </div>
      <Policies />
    </>
  );
}
