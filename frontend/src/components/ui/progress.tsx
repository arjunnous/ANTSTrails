import * as React from 'react';
import { cn } from '../../lib/utils';

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(({ className, value, ...props }, ref) => (
  <div className={cn('h-3 rounded-full bg-slate-200 overflow-hidden', className)} ref={ref} {...props}>
    <div
      className="h-full rounded-full bg-gradient-to-r from-sky-500 to-indigo-500 transition-all"
      style={{ width: `${value}%` }}
    />
  </div>
));

Progress.displayName = 'Progress';

export { Progress };
