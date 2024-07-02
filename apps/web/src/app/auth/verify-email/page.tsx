'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client';
import { toast } from 'sonner';
import { Button, InputOTP, InputOTPGroup, InputOTPSlot } from 'ui';

import { ACTIVATE_USER } from '@/graphql/actions/activation.action';

const VerifyEmail = () => {
  const [value, setValue] = useState('');
  const [email, setEmail] = useState('');

  const [ActivateUser, { loading }] = useMutation(ACTIVATE_USER);

  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const localStorageEmail = localStorage.getItem('email');
      setEmail(localStorageEmail || '');
    }
  }, []);

  const handleSubmit = async () => {
    const verificationNumber = Object.values(value).join('');
    const activationToken = localStorage.getItem('activation_token');

    const data = {
      activationToken,
      activationCode: verificationNumber,
    };

    try {
      await ActivateUser({
        variables: data,
      });
      localStorage.removeItem('activation_token');
      toast.success('Account activated successfully!');
      router.push('/auth/login');
    } catch (error) {
      const errMsg =
        error instanceof Error ? error.message : 'There is an error...';
      toast.error(errMsg);
    }
  };

  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    firstInputRef.current?.focus();
  }, []);

  return (
    <section>
      <div className='-mt-48 mb-8 text-sm'>
        <h1 className='mb-4 flex items-center justify-center text-2xl font-thin'>
          Verify your account
        </h1>
        <span className='h-auto w-auto space-y-1 text-sm dark:text-gray-400'>
          <p className='flex items-center justify-center'>
            We sent an email to
          </p>
          <p className='flex items-center justify-center'>{email}</p>
          <p className='flex items-center justify-center'>
            Click the link inside to get started.
          </p>
        </span>
      </div>

      <div className='space-y-2'>
        <InputOTP
          maxLength={6}
          ref={firstInputRef}
          value={value}
          onChange={(inputValue) => setValue(inputValue)}
        >
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
          </InputOTPGroup>
        </InputOTP>
        <div className='text-center text-sm'>
          {value === '' ? (
            <>Enter your one-time password.</>
          ) : (
            <>You entered: {value}</>
          )}
        </div>
      </div>

      <span className='mt-3 flex items-center justify-center text-sm'>
        <Button
          variant='glass'
          disabled={loading || value.length !== 6}
          onClick={handleSubmit}
          className='h-14'
        >
          Verify OTP
        </Button>
      </span>
    </section>
  );
};

export default VerifyEmail;
