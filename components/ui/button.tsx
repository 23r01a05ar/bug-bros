import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...props
}: ButtonProps) {
  if (variant === 'primary') {
    return (
      <button
        className={`btn-gold ${sizeClasses[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }

  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed';

  const variantStyles: Record<string, string> = {
    secondary:
      'bg-[var(--color-fg)] text-[var(--color-bg)] hover:opacity-90 dark:bg-[var(--color-dark-fg)] dark:text-[var(--color-dark-bg)]',
    outline:
      'border border-[var(--color-border)] text-[var(--color-fg)] hover:bg-[var(--color-surface-raised)] dark:border-[var(--color-dark-border)] dark:text-[var(--color-dark-fg)] dark:hover:bg-[var(--color-dark-surface-raised)]',
    ghost:
      'text-[var(--color-muted)] hover:text-[var(--color-fg)] hover:bg-[var(--color-surface-raised)] dark:text-[var(--color-dark-muted)] dark:hover:text-[var(--color-dark-fg)] dark:hover:bg-[var(--color-dark-surface-raised)]',
    danger:
      'bg-[var(--color-error)] text-white hover:opacity-90',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeClasses[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

const sizeClasses: Record<string, string> = {
  sm: 'px-3 py-1.5 text-xs rounded',
  md: 'px-5 py-2.5 text-sm rounded',
  lg: 'px-8 py-3.5 text-base rounded',
};
