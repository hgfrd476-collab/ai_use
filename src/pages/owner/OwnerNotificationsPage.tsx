import React from 'react';
import { Bell, Check, Trash2, CalendarCheck, ShieldAlert, Star, MessageSquare, CreditCard } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const OwnerNotificationsPage: React.FC = () => {
  const { notifications, markAllNotificationsRead, addToast } = useApp();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Host Notifications</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time updates on customer reservations, payments, and system notifications
          </p>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={() => {
              markAllNotificationsRead();
              addToast('Cleared', 'All notifications marked as read', 'info');
            }}
            className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Mark All as Read</span>
          </button>
        )}
      </div>

      {/* List */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-4 sm:p-6 space-y-3">
        {notifications.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs">
            <Bell className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p>You have no notifications at this time.</p>
          </div>
        ) : (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-2xl border transition flex items-start justify-between gap-4 ${
                n.read ? 'bg-white border-slate-100' : 'bg-emerald-50/40 border-emerald-100 font-medium'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                    n.type === 'BOOKING' || n.type === 'PAYMENT'
                      ? 'bg-emerald-100 text-emerald-700'
                      : n.type === 'REVIEW'
                      ? 'bg-amber-100 text-amber-700'
                      : 'bg-blue-100 text-blue-700'
                  }`}
                >
                  {n.type === 'BOOKING' ? (
                    <CalendarCheck className="w-4 h-4" />
                  ) : n.type === 'PAYMENT' ? (
                    <CreditCard className="w-4 h-4" />
                  ) : n.type === 'REVIEW' ? (
                    <Star className="w-4 h-4" />
                  ) : (
                    <Bell className="w-4 h-4" />
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{n.title}</h4>
                  <p className="text-xs text-slate-600 mt-0.5">{n.message}</p>
                  <span className="text-[10px] text-slate-400 mt-1.5 block">
                    {new Date(n.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>

              {!n.read && (
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0 mt-1" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
