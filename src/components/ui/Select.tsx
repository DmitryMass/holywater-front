import { cn } from '@utils/styles';

import React from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

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
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    onBlur: (e: React.FocusEvent<HTMLSelectElement>) => void;
    ref: React.RefCallback<HTMLSelectElement>;
    name: string;
  };
};

interface SelectProps {
  name: string;
  options: SelectOption[];
  label?: string;
  placeholder?: string;
  error?: string;
  helperText?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  register?: RegisterFunction; // Типизированная версия
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  value?: string;
}

const Select = ({
  name,
  options,
  label,
  placeholder,
  error,
  helperText,
  disabled = false,
  required = false,
  className,
  register,
  onChange,
  value,
  ...props
}: SelectProps) => {
  // Применяем регистрацию для React Hook Form, если она передана
  const selectProps = register
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
      <select
        id={name}
        disabled={disabled}
        className={cn('select select-bordered w-full', error ? 'select-error' : '', className)}
        {...selectProps}
        {...props}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
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

export default Select;
