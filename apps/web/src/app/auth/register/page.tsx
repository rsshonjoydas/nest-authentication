'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { NextRouter } from 'next/router';
import { useMutation } from '@apollo/client';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

import { REGISTER_USER } from '@/graphql/actions/register.action';

import { AuthButton } from '../_components/auth-button';
import {
  FloatingLabelInput,
  FloatingLabelPasswordInput,
} from '../_components/auth-input';
import SocialAuth from '../_components/social-auth';

interface IRegister {
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
  name: z.string().min(3, 'Name must be at least 3 characters long!'),
});

const Register = () => {
  const [step, setStep] = useState(1);

  const [registerUserMutation, { loading }] = useMutation(REGISTER_USER);

  const router = useRouter();

  const localStorageEmail =
    typeof window !== 'undefined' ? localStorage.getItem('email') : null;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<IRegister>({
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

  const handleNextStep = (data: IRegister) => {
    localStorage.setItem('email', data.email); // * Set email data in local storage
    setStep((prevStep) => prevStep + 1);
  };

  const handlePrevStep = () => {
    setStep((prevStep) => prevStep - 1);
  };

  const onSubmit = async (data: IRegister) => {
    try {
      const response = await registerUserMutation({
        variables: data,
      });
      localStorage.setItem(
        'activation_token',
        response.data.register.activationToken,
      );
      toast.success('Please check your email to activate your account!');
      reset();
      router.push('/auth/verify-email');
    } catch (error) {
      const errMsg =
        error instanceof Error ? error.message : 'There is an error...';
      toast.error(errMsg);
    }
  };

  return (
    <section>
      <div className='mb-4 text-sm'>
        <h1 className='mb-2 flex items-center justify-center text-3xl font-semibold'>
          {step === 1 ? 'Create your account' : 'Enter your password'}
        </h1>
        <span className='h-auto w-auto text-[13px]'>
          <p className='flex items-center justify-center'>
            Please note that email verification is required for
          </p>
          <p className='flex items-center justify-center'>
            signup. Your email will only be used to verify
          </p>
          <p className='flex items-center justify-center'>
            your identity for security purposes.
          </p>
        </span>
      </div>

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
                  className='absolute right-2 top-1/2 mr-2 flex -translate-y-1/2 transform items-center justify-center text-sm opacity-70'
                >
                  Edit
                </button>
              </div>
              <FloatingLabelInput
                label='Name'
                name='name'
                type='text'
                control={control}
                errors={errors}
                inputRef={inputRef}
              />

              <FloatingLabelPasswordInput
                label='Password'
                name='password'
                control={control}
                errors={errors}
              />
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
            Already have an account&nbsp;
            <Link href='/auth/login' className='text-lavender'>
              Log in
            </Link>
          </span>
        </div>
      </form>

      {step === 1 && <SocialAuth />}
    </section>
  );
};

export default Register;
