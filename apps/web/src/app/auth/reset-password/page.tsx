'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { NextRouter } from 'next/router';
import { useMutation } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { RESET_PASSWORD } from '@/graphql/actions/reset-password.action';

import { AuthButton } from '../_components/auth-button';
import { FloatingLabelPasswordInput } from '../_components/auth-input';

interface ILogin {
  password: string;
  confirmPassword: string;
  remember?: boolean;
  router?: NextRouter;
}

const formSchema = z
  .object({
    password: z.string().min(8, 'Password must be at least 8 characters long!'),
    confirmPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters long!'),
  })
  .refine((values) => values.password === values.confirmPassword, {
    message: 'Passwords must need to match!',
    path: ['confirmPassword'],
  });

const ResetPasswordPage = ({
  searchParams,
}: {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}) => {
  const activationToken = searchParams.verify ?? '';

  const [resetPassword, { loading }] = useMutation(RESET_PASSWORD);

  const router = useRouter();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<ILogin>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
  });

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const onSubmit = async (data: z.infer<typeof formSchema>): Promise<void> => {
    try {
      await resetPassword({
        variables: {
          password: data.password,
          activationToken,
        },
      });
      toast.success('Password updated successfully!');
      reset();
      router.push('/auth/login');
    } catch (error) {
      const errMsg =
        error instanceof Error ? error.message : 'There is an error...';
      toast.error(errMsg);
    }
  };

  return (
    <section>
      <h1 className='mb-4 flex items-center justify-center text-3xl font-semibold'>
        Reset your password
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className='flex justify-center'
      >
        <div className='relative min-w-full max-w-xs space-y-5 py-3 sm:w-96 sm:rounded-lg md:w-96 lg:w-96'>
          <FloatingLabelPasswordInput
            label='Password'
            name='password'
            control={control}
            errors={errors}
            inputRef={inputRef}
          />
          <FloatingLabelPasswordInput
            label='Confirm Password'
            name='confirmPassword'
            control={control}
            errors={errors}
          />

          <AuthButton
            disabled={!isValid || loading}
            variant='primary'
            className='h-14'
          >
            Continue
          </AuthButton>
        </div>
      </form>
    </section>
  );
};

export default ResetPasswordPage;
