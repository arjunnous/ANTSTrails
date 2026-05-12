import * as React from 'react';
import { cn } from '../../lib/utils';

type ButtonVariant = 'default' | 'outline' | 'destructive';

type ButtonSize = 'default' | 'sm' | 'lg';

const buttonStyles: Record<ButtonVariant, string> = {
  default:
    'bg-sky-600 text-white hover:bg-sky-700 focus-visible:ring-sky-400 border border-transparent',
  outline:
    'border border-slate-200 bg-white text-slate-900 hover:bg-slate-50 focus-visible:ring-sky-400',
  destructive:
    'bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-400 border border-transparent',
};

const sizeStyles: Record<ButtonSize, string> = {
  default: 'h-11 px-5 py-2.5 text-sm',
  sm: 'h-9 px-4 text-sm',
  lg: 'h-12 px-6 text-base',
};

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={cn(
        'inline-flex items-center justify-center rounded-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
        buttonStyles[variant],
        sizeStyles[size],
        className
      )}
      {...props}
    />
  )
);

Button.displayName = 'Button';

export { Button };
