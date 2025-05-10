import { cn } from '@utils/styles';

import React from 'react';

// Определение типа для register из React Hook Form
type RegisterFunction = {
  (
    name: string,
    options?: {
      required?: boolean | string;
      min?: number | { value: number; message: string };
      max?: number | { value: number; message: string };
      pattern?: RegExp | { value: RegExp; message: string };
      validate?:
        | Record<string, (value: string) => boolean | string>
        | ((value: string) => boolean | string);
    }
  ): {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
    ref: React.RefCallback<HTMLInputElement>;
    name: string;
  };
};

interface InputProps {
  name: string;
  label?: string;
  placeholder?: string;
  type?: 'text' | 'number' | 'email' | 'password';
  error?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  register?: RegisterFunction; // Типизированная версия
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  value?: string;
}

const Input = ({
  name,
  label,
  placeholder,
  type = 'text',
  error,
  helperText,
  disabled = false,
  required = false,
  className,
  register,
  onChange,
  value,
  ...props
}: InputProps) => {
  // Применяем регистрацию для React Hook Form, если она передана
  const inputProps = register
    ? register(name, { required: required ? `${label || name} is required` : false })
    : { onChange, name, value };

  return (
    <div className="form-control w-full">
      {label && (
        <label htmlFor={name} className="label">
          <span className="label-text">
            {label}
            {required && <span className="text-error ml-1">*</span>}
          </span>
        </label>
      )}
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        className={cn('input input-bordered w-full', error ? 'input-error' : '', className)}
        {...inputProps}
        {...props}
      />
      {(error || helperText) && (
        <label className="label">
          <span className={cn('label-text-alt', error ? 'text-error' : '')}>
            {error || helperText}
          </span>
        </label>
      )}
    </div>
  );
};

export default Input;
