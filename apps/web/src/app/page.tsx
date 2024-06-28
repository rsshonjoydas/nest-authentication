import { Button, buttonVariants, cn } from 'ui';

export default function Home() {
  return (
    <div>
      <h1 className='text-red-500'>Shonjoy</h1>
      <Button variant='destructive'>Click</Button>
      <div className={cn(buttonVariants({ variant: 'destructive' }))}>
        Shonjoy
      </div>
    </div>
  );
}
