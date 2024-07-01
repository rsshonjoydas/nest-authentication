import { cn, Logo, NavAction } from 'ui';

export const Header = () => (
  <header
    className={cn(
      'supports-backdrop-blur:bg-background/60 bg-background/80 sticky top-0 z-50 w-full backdrop-blur',
    )}
  >
    <div className='container flex h-14 items-center justify-between bg-transparent p-4'>
      <Logo href='/' />
      <NavAction />
    </div>
  </header>
);
