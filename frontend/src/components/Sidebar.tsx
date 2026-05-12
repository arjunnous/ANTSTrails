import { NavLink } from 'react-router-dom';
import { cn } from '../lib/utils';

interface SidebarItem {
  label: string;
  to: string;
}

interface SidebarProps {
  items: SidebarItem[];
}

export function Sidebar({ items }: SidebarProps) {
  return (
    <nav className="space-y-1">
      {items.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          className={({ isActive }) =>
            cn(
              'group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-200 transition',
              isActive
                ? 'bg-slate-800 text-sky-300 shadow-slate-900/20 shadow-inner'
                : 'hover:bg-slate-800 hover:text-white'
            )
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
}
