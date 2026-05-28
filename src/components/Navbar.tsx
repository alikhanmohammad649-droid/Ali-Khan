import React, { useState } from 'react';
import { useApp } from '../lib/AppContext';
import { Link, useNavigate } from 'react-router-dom';
import { Bell, Menu, User, Settings, Shield, ChevronDown, CheckCheck, Volume2, Award, Clock } from 'lucide-react';

interface NavbarProps {
  setMobileOpen: (open: boolean) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ setMobileOpen }) => {
  const { user, notifications, clearUnreadNotifications } = useApp();
  const [bellOpen, setBellOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const handleNotificationClick = (actionUrl?: string) => {
    setBellOpen(false);
    if (actionUrl) {
      navigate(actionUrl);
    } else {
      navigate('/notifications');
    }
  };

  const handleMarkAllRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    clearUnreadNotifications();
  };

  return (
    <header className="fixed top-0 right-0 left-0 md:left-64 h-16 bg-white border-b border-slate-100 flex items-center justify-between px-6 z-20 font-sans">
      
      {/* Mobile Toggle & Left Header Title */}
      <div className="flex items-center gap-3">
        <button 
          onClick={() => setMobileOpen(true)}
          className="md:hidden p-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-600 hover:text-slate-800 focus:outline-none"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div className="hidden sm:block text-slate-800 text-sm font-semibold tracking-tight">
          Enterprise Services Referral Desk
        </div>
      </div>

      {/* Action triggers */}
      <div className="flex items-center gap-4 relative">
        
        {/* Unread Alerts Dropdown */}
        <div className="relative">
          <button 
            onClick={() => {
              setBellOpen(!bellOpen);
              setProfileDropdownOpen(false);
            }}
            className={`p-2 rounded-full cursor-pointer transition-all ${bellOpen ? 'bg-slate-100 text-blue-600' : 'bg-slate-50 border border-slate-100 text-slate-600 hover:bg-slate-100 hover:text-slate-850'}`}
          >
            <Bell className="w-4.5 h-4.5" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 border-2 border-white rounded-full flex items-center justify-center text-[9px] text-white font-bold animate-pulse">
                {unreadCount}
              </span>
            )}
          </button>

          {bellOpen && (
            <div className="absolute right-0 mt-3.5 w-80 bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden z-30 font-sans">
              <div className="px-4 py-3 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Alert Center</span>
                {unreadCount > 0 && (
                  <button 
                    onClick={handleMarkAllRead}
                    className="text-[10px] text-blue-600 hover:text-blue-700 font-bold hover:underline flex items-center gap-0.5 cursor-pointer"
                  >
                    <CheckCheck className="w-3 h-3" /> Mark Read
                  </button>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                {notifications.length === 0 ? (
                  <div className="p-6 text-center text-xs text-slate-400">
                    No active platform notifications log.
                  </div>
                ) : (
                  notifications.map((n) => (
                    <div 
                      key={n.id}
                      onClick={() => handleNotificationClick(n.action_url)}
                      className={`p-4 text-left hover:bg-slate-50 cursor-pointer transition-all ${!n.is_read ? 'bg-blue-50/20 font-medium' : ''}`}
                    >
                      <div className="flex justify-between items-start gap-1">
                        <span className={`text-[11px] font-bold ${
                          n.type === 'success' ? 'text-commission' : (n.type === 'warning' ? 'text-alert' : 'text-primary')
                        }`}>
                          {n.title}
                        </span>
                        <span className="text-[9px] text-slate-400 flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5" /> Just now
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-snug line-clamp-2">{n.message}</p>
                    </div>
                  ))
                )}
              </div>

              <div className="p-2 border-t border-slate-100 bg-slate-50/50 text-center">
                <Link 
                  to="/notifications" 
                  onClick={() => setBellOpen(false)}
                  className="block py-1.5 text-xs text-slate-500 hover:text-slate-800 font-semibold"
                >
                  View all system logs
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Quick Bar */}
        {user && (
          <div className="relative">
            <button 
              onClick={() => {
                setProfileDropdownOpen(!profileDropdownOpen);
                setBellOpen(false);
              }}
              className="flex items-center gap-2 px-2.5 py-1.5 bg-slate-50 hover:bg-slate-100 rounded-full border border-slate-200/50 cursor-pointer transition-all"
            >
              <div className="h-7 w-7 rounded-full bg-gradient-to-tr from-slate-800 to-slate-950 flex items-center justify-center text-white text-xs font-semibold">
                {user.full_name ? user.full_name[0].toUpperCase() : 'C'}
              </div>
              <span className="hidden sm:block text-xs font-semibold text-slate-800 max-w-24 truncate">{user.full_name}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {profileDropdownOpen && (
              <div className="absolute right-0 mt-3 w-52 bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden z-35 font-sans">
                <div className="px-4 py-3 bg-slate-50 border-b border-slate-100">
                  <span className="text-xs font-semibold text-slate-800 block truncate">{user.full_name}</span>
                  <span className="text-[10px] text-slate-400 block truncate font-mono uppercase mt-0.5">{user.role} workspace</span>
                </div>
                <div className="p-1 space-y-0.5">
                  <Link 
                    to="/profile" 
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-50 font-semibold"
                  >
                    <Settings className="w-4 h-4 text-slate-400" />
                    Broker Profile
                  </Link>
                  {user.role === 'admin' && (
                    <Link 
                      to="/admin" 
                      onClick={() => setProfileDropdownOpen(false)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg font-semibold"
                    >
                      <Shield className="w-4 h-4 text-red-400" />
                      Admin Dashboard
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </header>
  );
};
