'use client';

import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { useMutation } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { buttonVariants, cn } from 'ui';
import { z } from 'zod';

import { FORGOT_PASSWORD } from '@/graphql/actions/forgot-password.action';

import { AuthButton } from '../_components/auth-button';
import { FloatingLabelInput } from '../_components/auth-input';

const emailSchema = z.object({
  email: z.string().email('Invalid email.').min(1, 'The email is required.'),
});

type IEmail = {
  email: string;
};

const ForgotPasswordPage = () => {
  const [forgotPassword, { loading }] = useMutation(FORGOT_PASSWORD);

  const localStorageEmail =
    typeof window !== 'undefined' ? localStorage.getItem('email') : null;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<IEmail>({
    defaultValues: {
      email: localStorageEmail || '', // Get the email value from local storage
    },
    resolver: zodResolver(emailSchema),
    mode: 'onChange',
  });

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const onSubmit = async (data: IEmail) => {
    try {
      await forgotPassword({
        variables: {
          email: data.email,
        },
      });
      toast.success('Please check your email to reset your password!');
      reset();
    } catch (error) {
      const errMsg =
        error instanceof Error ? error.message : 'There is an error...';
      toast.error(errMsg);
    }
  };

  return (
    <section>
      <div className='mb-4 text-sm dark:text-gray-400'>
        <h1 className='mb-2 flex items-center justify-center text-3xl font-semibold dark:text-gray-400'>
          Forgot your password
        </h1>
        <span className='h-auto w-auto text-sm'>
          <p className='flex items-center justify-center'>
            Enter your email address and we will send you
          </p>
          <p className='flex items-center justify-center'>
            instructions to reset your password.
          </p>
        </span>
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className='flex justify-center'
      >
        <div className='relative min-w-full max-w-xs space-y-5 py-3 sm:w-96 sm:rounded-lg md:w-96 lg:w-96'>
          <FloatingLabelInput
            label='Email address'
            name='email'
            type='email'
            control={control}
            errors={errors}
            inputRef={inputRef}
          />

          <AuthButton
            disabled={!isValid || loading}
            variant='primary'
            className='h-14'
          >
            Continue
          </AuthButton>

          <span className='flex items-center justify-center text-sm'>
            <Link
              href='/auth'
              className={cn(
                buttonVariants({ variant: 'ghost' }),
                'text-primary-50 dark:text-primary-50 -mt-3 p-2',
              )}
            >
              Back to Apps Client
            </Link>
          </span>
        </div>
      </form>
    </section>
  );
};

export default ForgotPasswordPage;
