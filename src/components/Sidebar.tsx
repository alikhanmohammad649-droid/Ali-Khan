import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useApp } from '../lib/AppContext';
import { 
  LayoutDashboard, 
  BriefcaseBusiness, 
  Network, 
  Wallet, 
  Bookmark, 
  Trophy, 
  UserCog, 
  ShieldAlert, 
  LogOut,
  X,
  Sparkles,
  Award
} from 'lucide-react';

interface SidebarProps {
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ mobileOpen, setMobileOpen }) => {
  const { user, logoutUser } = useApp();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Marketplace', path: '/projects', icon: BriefcaseBusiness },
    { name: 'My Leads', path: '/leads', icon: Network },
    { name: 'Earnings & Payouts', path: '/earnings', icon: Wallet },
    { name: 'Saved Projects', path: '/saved', icon: Bookmark },
    { name: 'Leaderboard', path: '/leaderboard', icon: Trophy },
    { name: 'Profile Settings', path: '/profile', icon: UserCog },
  ];

  const sidebarContent = (
    <div className="h-full bg-slate-900 border-r border-slate-800 flex flex-col justify-between text-slate-300 font-sans select-none">
      
      {/* Header Brand */}
      <div>
        <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
          <NavLink to="/dashboard" className="flex items-center gap-2.5">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-base shadow-md shadow-blue-500/20">
              L
            </div>
            <div>
              <span className="text-md font-bold tracking-tight text-white block">
                Lead<span className="text-blue-500 font-semibold">Bridge</span>
              </span>
              <span className="text-[9px] uppercase tracking-widest text-slate-500 font-bold block mt-[-2px]">
                Marketplace Tier
              </span>
            </div>
          </NavLink>
          <button 
            onClick={() => setMobileOpen(false)}
            className="md:hidden p-1 bg-slate-800/40 border border-slate-800 rounded text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* User Badge Info */}
        {user && (
          <div className="px-6 py-4 border-b border-slate-800/50 bg-slate-950/20">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 border border-slate-800 flex items-center justify-center text-white font-bold font-sans">
                {user.full_name ? user.full_name[0].toUpperCase() : 'C'}
              </div>
              <div className="min-w-0">
                <span className="font-semibold text-xs text-white block truncate">{user.full_name}</span>
                <span className="text-[10px] text-slate-400 block truncate">{user.email}</span>
                <span className="mt-1 inline-flex items-center gap-0.5 text-[9px] uppercase tracking-wider font-bold text-emerald-400">
                  {user.is_verified ? (
                    <span className="flex items-center gap-0.5 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                      <Award className="w-2.5 h-2.5" /> Verified Broker
                    </span>
                  ) : (
                    <span className="bg-slate-800 px-1.5 py-0.5 rounded text-slate-400 text-[8px]">
                      Partner Broker
                    </span>
                  )}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Links Navigation */}
        <nav className="p-4 space-y-1 mt-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) => 
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    isActive 
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-600/15' 
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                  }`
                }
              >
                <Icon className="w-4.5 h-4.5" />
                {item.name}
              </NavLink>
            );
          })}

          {/* Admin Section Gateway Divider */}
          {user?.role === 'admin' && (
            <div className="pt-4 mt-4 border-t border-slate-850">
              <span className="px-3 text-[9px] font-bold text-slate-500 uppercase tracking-widest block mb-2">
                Administrative Control Panel
              </span>
              <NavLink
                to="/admin"
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) => 
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-semibold tracking-wide transition-all ${
                    isActive 
                      ? 'bg-red-600 text-white shadow-md shadow-red-600/10' 
                      : 'text-red-400 hover:text-red-300 hover:bg-slate-800/40'
                  }`
                }
              >
                <ShieldAlert className="w-4.5 h-4.5 animate-pulse" />
                Admin Panel
              </NavLink>
            </div>
          )}
        </nav>
      </div>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-800/80 bg-slate-950/10">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800/40 font-semibold cursor-pointer transition-all"
        >
          <LogOut className="w-4.5 h-4.5 text-slate-500" />
          End Session
        </button>
      </div>

    </div>
  );

  return (
    <>
      {/* Desktop Sidebar Fixed */}
      <aside className="hidden md:block w-64 h-screen fixed top-0 left-0 z-20">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Slide-in Overlay */}
      {mobileOpen && (
        <div className="md:hidden fixed inset-0 z-30">
          {/* Backdrop blur clickoff */}
          <div 
            onClick={() => setMobileOpen(false)}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-sm transition-opacity"
          ></div>
          {/* Slide panel */}
          <div className="fixed inset-y-0 left-0 w-64 max-w-sm flex-1 flex flex-col focus:outline-none">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};
