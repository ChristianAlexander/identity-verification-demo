import { forwardRef } from 'react';

const buttonVariants = {
  primary: 'bg-brand-500 text-white hover:bg-brand-600 focus:ring-brand-500',
  secondary: 'bg-transparent text-brand-500 border border-brand-500 hover:bg-brand-50 dark:text-brand-400 dark:border-brand-400 dark:hover:bg-brand-900/20',
  danger: 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500',
  ghost: 'bg-transparent text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800'
};

const sizes = {
  sm: 'px-3 py-2 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-6 py-3 text-base',
  xl: 'px-8 py-4 text-lg'
};

export const Button = forwardRef(({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  loading = false,
  disabled = false,
  className = '',
  ...props 
}, ref) => {
  const baseClasses = 'inline-flex items-center justify-center font-semibold rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const classes = [
    baseClasses,
    buttonVariants[variant],
    sizes[size],
    fullWidth && 'w-full',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      ref={ref}
      className={classes}
      disabled={loading || disabled}
      {...props}
    >
      {loading && (
        <div className="w-4 h-4 mr-2 border-2 border-current border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  );
});

Button.displayName = 'Button';
