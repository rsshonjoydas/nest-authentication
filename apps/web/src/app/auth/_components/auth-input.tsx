'use client';

import { useState } from 'react';
import { Controller } from 'react-hook-form';
import { Tooltip } from 'react-tooltip';
import { Icons } from 'ui';

export const FloatingLabelInput = ({
  label,
  type,
  name,
  control,
  errors,
  inputRef,
  className,
}: any) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const hasError = errors[name];

  return (
    <div className='relative'>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <>
            <input
              {...field}
              type={type}
              className={`h-14 border bg-transparent text-slate-500 hover:text-slate-900 dark:text-gray-400 ${className} ${
                hasError && 'border-red-400'
              } ${
                isFocused && 'border-[#b57edc] transition-all duration-300'
              } w-full rounded-[4px] px-3 py-2 focus:outline-none`}
              onFocus={handleFocus}
              onBlur={handleBlur}
              ref={inputRef}
            />
            <label
              htmlFor={name}
              className={`absolute left-3 top-4 transition-all duration-300 ${
                hasError && 'text-red-400'
              } ${isFocused && 'text-[#b57edc]'} ${
                isFocused || field.value
                  ? 'bg-background -mt-[25px] px-1 text-sm'
                  : 'text-base text-slate-400'
              } pointer-events-none`}
            >
              {label}
            </label>
          </>
        )}
      />
      {hasError && (
        <p className='my-2 flex justify-start text-[12px] text-red-400'>
          <Icons.Warning className='mr-1 h-4 w-4 fill-red-400' />
          {errors[name].message}
        </p>
      )}
    </div>
  );
};

export const FloatingLabelPasswordInput = ({
  label,
  name,
  control,
  errors,
  inputRef,
}: any) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };
  return (
    <div className='relative'>
      <FloatingLabelInput
        label={label}
        name={name}
        control={control}
        errors={errors}
        inputRef={inputRef}
        type={showPassword ? 'text' : 'password'}
      />
      <button
        type='button'
        onClick={handleTogglePasswordVisibility}
        onMouseDown={(e) => e.preventDefault()}
        aria-label='toggle password visibility'
        className={`absolute right-[1px] top-1/2 flex -translate-y-1/2 transform items-center justify-center rounded-r-sm p-[17px] text-sm text-gray-500 hover:bg-gray-200 dark:hover:bg-slate-600/30 ${
          errors.password &&
          'top-1/2 -mt-[13px] flex -translate-y-1/2 items-center justify-center'
        }`}
        data-tooltip-id='my-tooltip-children-multiline'
      >
        {showPassword ? (
          <Icons.EyeSlash className='fill-foreground/50 h-5 w-5' />
        ) : (
          <Icons.Eye className='fill-foreground/50 h-5 w-5' />
        )}

        <Tooltip
          id='my-tooltip-children-multiline'
          className='flex items-center justify-center'
        >
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span>{showPassword ? 'Hide' : 'Show'}</span>
            <span>password</span>
          </div>
        </Tooltip>
      </button>
    </div>
  );
};
