import * as React from 'react';
import { cn } from '../../lib/utils';

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
}

export function Sheet({ open, onOpenChange, children, className }: SheetProps) {
  return (
    <div
      className={cn(
        'fixed inset-0 z-50 transition-all duration-300',
        open ? 'pointer-events-auto' : 'pointer-events-none'
      )}
    >
      <div
        className={cn(
          'absolute inset-0 bg-slate-950/60 transition-opacity',
          open ? 'opacity-100' : 'opacity-0'
        )}
        onClick={() => onOpenChange(false)}
      />
      <div
        className={cn(
          'absolute left-0 top-0 h-full w-80 bg-slate-950 p-6 shadow-2xl transition-transform duration-300',
          open ? 'translate-x-0' : '-translate-x-full',
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
