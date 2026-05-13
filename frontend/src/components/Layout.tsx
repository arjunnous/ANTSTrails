import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from './Sidebar';
import { Sheet } from './ui/sheet';
import { Button } from './ui/button';

const learnerLinks = [
  { label: 'Roadmap', to: '/roadmap' },
  { label: 'Profile', to: '/select-profile' },
];

const adminLinks = [
  { label: 'Dashboard', to: '/admin' },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const links = user?.role === 'admin' ? [...learnerLinks, ...adminLinks] : learnerLinks;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <div className="lg:flex">
        <aside className="hidden lg:flex lg:w-72 lg:flex-col lg:bg-slate-950 lg:px-6 lg:pt-8 lg:pb-6">
          <div className="mb-10 flex items-center justify-between text-white">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Nous Testree</p>
              <h1 className="mt-1 text-2xl font-semibold leading-tight">ANTS Trail</h1>
              <p className="-mt-0.5 text-xs text-slate-400">Where Trailblazers Are Built.</p>
            </div>
          </div>
          <div className="flex-1">
            <Sidebar items={links} />
          </div>
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
            <p className="mb-3 text-xs text-slate-500">Signed in as</p>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-700 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path fillRule="evenodd" d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm-7 9a7 7 0 0 1 14 0H5z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-white">{user?.full_name || 'User'}</p>
                <p className="text-xs text-slate-400">Learner</p>
              </div>
            </div>
          </div>
        </aside>

        <div className="flex-1">
          <div className="border-b border-slate-200 bg-white px-4 py-4 shadow-sm shadow-slate-900/5 lg:hidden">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Nous Testree</p>
                <h1 className="text-lg font-semibold text-slate-900">ANTS Trail</h1>
              </div>
              <Button variant="outline" size="sm" onClick={() => setMobileOpen(true)}>
                Menu
              </Button>
            </div>
          </div>

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <div className="flex items-center justify-between pb-6">
              <div>
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">Navigation</p>
                <h2 className="mt-2 text-xl font-semibold text-white">Menu</h2>
              </div>
              <Button variant="outline" size="sm" onClick={() => setMobileOpen(false)}>
                Close
              </Button>
            </div>
            <Sidebar items={links} />
          </Sheet>

          <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <div className="mb-6 flex flex-col gap-4 rounded-3xl bg-white px-6 py-5 shadow-sm shadow-slate-900/5 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-slate-500">Welcome back</p>
                <h2 className="mt-2 text-2xl font-semibold text-slate-900">{user?.full_name?.split(' ')[0] ?? 'Learner'}</h2>
              </div>
              <div className="flex items-center gap-3">
                <Button variant="outline" onClick={handleLogout}>
                  Sign out
                </Button>
              </div>
            </div>
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}
