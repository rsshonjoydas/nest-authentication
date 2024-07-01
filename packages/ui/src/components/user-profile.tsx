'use client';

import Cookies from 'js-cookie';
import { toast } from 'sonner';

import { Avatar, AvatarFallback } from './ui/avatar';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export const UserProfile = () => {
  const logoutHandler = () => {
    Cookies.remove('accessToken');
    Cookies.remove('refreshToken');
    toast.success('Log out successful!');
    window.location.reload();
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='secondary' size='icon' className='rounded-full'>
            <Avatar>
              <AvatarFallback>RS</AvatarFallback>
            </Avatar>
            <span className='sr-only'>Toggle user menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end'>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>Settings</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={logoutHandler}>Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
