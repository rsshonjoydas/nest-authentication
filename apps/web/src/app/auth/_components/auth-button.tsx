/* eslint-disable react/jsx-no-useless-fragment */
import React from 'react';
import { VariantProps } from 'class-variance-authority';
import { buttonVariants, cn, Icons } from 'ui';

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  isLoading?: boolean;
  onClick?: any;
  disabled?: boolean;
  type?: any;
  step?: number;
}

const AuthButton = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, children, variant, isLoading, size, step, ...props }, ref) => (
    <button
      className={cn(buttonVariants({ variant, size, className }))}
      ref={ref}
      disabled={isLoading}
      type={step === 1 ? 'button' : 'submit'}
      {...props}
    >
      {isLoading ? (
        <>
          {isLoading ? (
            <>
              <Icons.Loading /> Loading...
            </>
          ) : (
            `${children}`
          )}
        </>
      ) : (
        <>{children}</>
      )}
    </button>
  ),
);
AuthButton.displayName = 'AuthButton';

export { AuthButton };
