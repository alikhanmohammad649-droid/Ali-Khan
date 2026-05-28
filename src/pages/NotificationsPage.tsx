import React from 'react';
import { useApp } from '../lib/AppContext';
import { formatINR } from '../lib/dbState';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Bell, 
  CheckCheck, 
  Clock, 
  Trash2, 
  Sparkles, 
  CheckCircle, 
  AlertTriangle, 
  Info,
  ArrowRight
} from 'lucide-react';

export const NotificationsPage: React.FC = () => {
  const { notifications, clearUnreadNotifications, user } = useApp();
  const navigate = useNavigate();

  const handleMarkAllRead = () => {
    clearUnreadNotifications();
  };

  const handleRowClick = (actionUrl?: string) => {
    if (actionUrl) {
      navigate(actionUrl);
    }
  };

  // Helper for notification type icons and badges
  const getNotificationDetails = (type: string) => {
    switch (type) {
      case 'success':
        return {
          icon: <CheckCircle className="w-5 h-5 text-commission shrink-0" />,
          bgColor: 'bg-emerald-50/70 border-emerald-100',
          textColor: 'text-commission font-bold'
        };
      case 'warning':
        return {
          icon: <AlertTriangle className="w-5 h-5 text-alert shrink-0" />,
          bgColor: 'bg-red-50/70 border-red-100',
          textColor: 'text-alert font-bold'
        };
      default:
        return {
          icon: <Info className="w-5 h-5 text-blue-500 shrink-0" />,
          bgColor: 'bg-blue-50/60 border-blue-100',
          textColor: 'text-primary font-bold'
        };
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div className="font-sans space-y-6">
      
      {/* Page Header */}
      <div className="pb-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold font-sans tracking-tight text-slate-900">Alert Center</h1>
          <p className="text-xs text-slate-500 mt-1">Audit active system announcements, status updates, and payout clearances.</p>
        </div>

        {unreadCount > 0 && (
          <button 
            onClick={handleMarkAllRead}
            className="px-4 py-2 bg-slate-900 hover:bg-black text-white font-bold text-xs rounded-xl transition-all cursor-pointer flex items-center gap-1.5"
          >
            <CheckCheck className="w-4 h-4" /> Mark all as read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-xl border border-slate-100 p-16 text-center max-w-sm mx-auto space-y-4">
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-full w-fit mx-auto">
            <Bell className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="font-bold text-slate-900 text-sm">No active alerts logged</h3>
          <p className="text-xs text-slate-500 leading-relaxed font-sans font-normal">
            Your notifications feed is entirely empty. You will receive updates about client acquisitions and balance approvals in real-time here.
          </p>
          <Link 
            to="/projects" 
            className="inline-flex items-center justify-center gap-1 bg-slate-900 hover:bg-black font-semibold text-xs px-4 py-2 rounded-lg text-white"
          >
            Explore marketplace listings
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="space-y-3 max-w-3xl">
          {notifications.map((n) => {
            const details = getNotificationDetails(n.type);
            return (
              <div 
                key={n.id}
                onClick={() => handleRowClick(n.action_url)}
                className={`p-4 border rounded-xl shadow-xs transition-all flex gap-4 text-xs select-none ${
                  details.bgColor
                } ${n.action_url ? 'cursor-pointer hover:shadow-sm hover:translate-x-0.5' : ''} ${
                  !n.is_read ? 'ring-1 ring-blue-400/50' : 'opacity-85'
                }`}
              >
                {details.icon}
                <div className="space-y-1 flex-1">
                  <div className="flex justify-between items-center gap-2">
                    <span className={details.textColor}>{n.title}</span>
                    <span className="text-[10px] text-slate-450 font-normal flex items-center gap-0.5 font-sans">
                      <Clock className="w-3 h-3 text-slate-400" /> Just now
                    </span>
                  </div>
                  <p className="text-slate-650 leading-relaxed font-normal">{n.message}</p>
                  
                  {n.action_url && (
                    <span className="text-[10px] text-blue-600 font-bold hover:underline block pt-1">
                      Interact action trace →
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
