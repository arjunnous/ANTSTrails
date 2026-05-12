import * as React from 'react';
import { cn } from '../../lib/utils';

interface DropdownMenuProps {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

export function DropdownMenu({ label, value, options, onChange }: DropdownMenuProps) {
  return (
    <label className="flex flex-col gap-2 text-sm text-slate-700">
      <span className="font-medium text-slate-900">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'h-12 rounded-xl border border-slate-200 bg-white px-4 text-slate-900 outline-none transition focus-visible:ring-2 focus-visible:ring-sky-400 focus-visible:ring-offset-2'
        )}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}
