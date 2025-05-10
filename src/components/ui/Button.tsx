import { cn } from '@utils/styles';

import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  isLoading?: boolean;
  disabled?: boolean;
  fullWidth?: boolean;
  onClick?: (event?: React.MouseEvent<HTMLButtonElement>) => void;
  className?: string;
  type?: 'button' | 'submit' | 'reset';
  title?: string;
}

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  isLoading = false,
  disabled = false,
  fullWidth = false,
  onClick,
  className,
  type = 'button',
  title,
  ...props
}: ButtonProps) => {
  // Базовые классы для всех кнопок
  const baseClasses = 'btn font-medium rounded transition-colors';

  // Варианты стилей
  const variantClasses = {
    primary: 'btn-primary text-white',
    secondary: 'btn-secondary text-white',
    outline: 'btn-outline',
    ghost: 'btn-ghost',
    danger: 'btn-error text-white',
    success: 'btn-success text-white',
  };

  // Размеры кнопок
  const sizeClasses = {
    sm: 'btn-sm',
    md: 'btn-md',
    lg: 'btn-lg',
  };

  // Дополнительные классы
  const additionalClasses = [
    fullWidth ? 'w-full' : '',
    isLoading ? 'loading' : '',
    disabled ? 'opacity-50 cursor-not-allowed' : '',
  ];

  return (
    <button
      type={type}
      className={cn(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        ...additionalClasses,
        className
      )}
      onClick={onClick}
      disabled={disabled || isLoading}
      title={title}
      {...props}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
