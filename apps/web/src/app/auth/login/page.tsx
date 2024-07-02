'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { NextRouter } from 'next/router';
import { useMutation } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import Cookies from 'js-cookie';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { buttonVariants, cn } from 'ui';
import { z } from 'zod';

import { LOGIN_USER } from '@/graphql/actions/login.action';

import { AuthButton } from '../_components/auth-button';
import {
  FloatingLabelInput,
  FloatingLabelPasswordInput,
} from '../_components/auth-input';
import SocialAuth from '../_components/social-auth';

interface ILogin {
  email: string;
  password: string;
  remember?: boolean;
  router?: NextRouter;
}

const stepOne = z.object({
  email: z.string().email('Invalid email.').min(1, 'The email is required.'),
});

const stepTwo = z.object({
  email: z.string().email('Invalid email.').min(1, 'The email is required.'),
  password: z.string().min(8, 'The password is too short.').max(50),
});

const Login = () => {
  const [step, setStep] = useState(1);

  const [LoginUser, { loading }] = useMutation(LOGIN_USER);

  const router = useRouter();

  const localStorageEmail =
    typeof window !== 'undefined' ? localStorage.getItem('email') : null;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<ILogin>({
    defaultValues: {
      email: localStorageEmail || '', // Get the email value from local storage
      password: '',
    },
    resolver: zodResolver(step === 1 ? stepOne : stepTwo),
    mode: 'onChange',
  });

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [step]);

  const handleNextStep = (data: ILogin) => {
    localStorage.setItem('email', data.email); // * Set email data in local storage
    setStep((prevStep) => prevStep + 1);
  };

  const handlePrevStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const onSubmit = async (data: ILogin) => {
    try {
      const loginData = {
        email: data.email,
        password: data.password,
      };

      const response = await LoginUser({
        variables: loginData,
      });

      const loginResponse = response.data.login;

      if (loginResponse.user) {
        toast.success('Login Successful!');

        Cookies.set('refresh_token', loginResponse.refreshToken);
        Cookies.set('access_token', loginResponse.accessToken);

        reset();
        router.push('/');
        localStorage.removeItem('email');
      } else {
        toast.error(loginResponse.error.message);
      }
    } catch (error) {
      const errMsg =
        error instanceof Error ? error.message : 'There is an error...';
      toast.error(errMsg);
    }
  };

  return (
    <section>
      <h1
        className={`mb-4 flex items-center justify-center text-3xl font-semibold ${
          step === 1 && 'px-[45px]'
        }`}
      >
        {step === 1 ? 'Welcome back' : 'Enter your password'}
      </h1>

      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className='flex justify-center'
      >
        <div className='relative min-w-full max-w-xs space-y-5 py-3 sm:w-96 sm:rounded-lg md:w-96 lg:w-96'>
          {step === 1 && (
            <FloatingLabelInput
              label='Email address'
              name='email'
              type='email'
              control={control}
              errors={errors}
              inputRef={inputRef}
            />
          )}

          {step === 2 && (
            <>
              <div className='relative'>
                <FloatingLabelInput
                  name='email'
                  control={control}
                  errors={errors}
                  className='pointer-events-none'
                />
                <button
                  type='button'
                  onClick={handlePrevStep}
                  className='text-primary absolute right-2 top-1/2 mr-2 flex -translate-y-1/2 transform items-center justify-center text-sm opacity-75'
                >
                  Edit
                </button>
              </div>
              <FloatingLabelPasswordInput
                label='Password'
                name='password'
                control={control}
                errors={errors}
                inputRef={inputRef}
              />

              <span className='flex items-center justify-center text-sm'>
                <Link
                  href='/auth/forgot-password'
                  className={cn(
                    buttonVariants({ variant: 'ghost' }),
                    'text-primary-50 dark:text-primary-50 -mt-3 p-2',
                  )}
                >
                  Forgot password?
                </Link>
              </span>
            </>
          )}

          <AuthButton
            type={step}
            disabled={!isValid || loading}
            onClick={step === 1 ? handleSubmit(handleNextStep) : null}
            variant='primary'
            className='h-14'
          >
            Continue
          </AuthButton>

          <span className='-mt-24 flex items-center justify-center pb-3 pt-1 text-sm'>
            Don&apos;t have an account?&nbsp;
            <Link href='/auth/register' className='text-lavender'>
              Sign up
            </Link>
          </span>
        </div>
      </form>

      {step === 1 && <SocialAuth />}
    </section>
  );
};

export default Login;
