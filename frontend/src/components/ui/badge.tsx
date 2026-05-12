import * as React from 'react';
import { cn } from '../../lib/utils';

const badgeStyles: Record<'default' | 'secondary' | 'success' | 'warning', string> = {
  default: 'bg-slate-100 text-slate-800',
  secondary: 'bg-sky-100 text-sky-700',
  success: 'bg-emerald-100 text-emerald-700',
  warning: 'bg-amber-100 text-amber-700',
};

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof badgeStyles;
}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, variant = 'default', ...props }, ref) => (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em]',
        badgeStyles[variant],
        className
      )}
      {...props}
    />
  )
);

Badge.displayName = 'Badge';

export { Badge };
