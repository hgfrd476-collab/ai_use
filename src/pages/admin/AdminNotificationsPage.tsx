import React, { useState } from 'react';
import { Bell, Send, Check, AlertTriangle, ShieldCheck, Info } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminNotificationsPage: React.FC = () => {
  const { notifications, markAllNotificationsRead, addToast } = useApp();
  const [broadcastTitle, setBroadcastTitle] = useState('');
  const [broadcastMessage, setBroadcastMessage] = useState('');
  const [targetAudience, setTargetAudience] = useState<'ALL' | 'CUSTOMERS' | 'BUSINESS_OWNERS'>('ALL');

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastTitle || !broadcastMessage) {
      addToast('Missing Fields', 'Please specify a title and message body', 'warning');
      return;
    }
    addToast('Broadcast Sent', `Platform announcement pushed to ${targetAudience.replace('_', ' ')}.`, 'success');
    setBroadcastTitle('');
    setBroadcastMessage('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">System & Broadcast Alerts</h1>
          <p className="text-xs text-slate-500 mt-1">
            Dispatch announcements to travelers and hosts, and monitor audit event triggers
          </p>
        </div>

        {notifications.length > 0 && (
          <button
            onClick={() => {
              markAllNotificationsRead();
              addToast('Cleaned', 'All admin notifications marked as read', 'info');
            }}
            className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
          >
            <Check className="w-4 h-4" />
            <span>Mark All Read</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Broadcast Sender Form */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Send className="w-4 h-4 text-purple-600" />
            <span>Send System Announcement</span>
          </h3>

          <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Target Audience</label>
              <select
                value={targetAudience}
                onChange={(e: any) => setTargetAudience(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 bg-white"
              >
                <option value="ALL">All Users (Travelers & Partners)</option>
                <option value="CUSTOMERS">Customers Only</option>
                <option value="BUSINESS_OWNERS">Business Owners Only</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Alert Title</label>
              <input
                type="text"
                placeholder="e.g. Water Festival Holiday Booking Advisory"
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Message Body</label>
              <textarea
                rows={4}
                placeholder="Important advisory details..."
                value={broadcastMessage}
                onChange={(e) => setBroadcastMessage(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold transition cursor-pointer shadow-xs"
            >
              Push Notification
            </button>
          </form>
        </div>

        {/* Notifications Feed */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900 mb-2">Audit & Event Logs</h3>

          {notifications.map((n) => (
            <div
              key={n.id}
              className={`p-3.5 rounded-2xl border transition flex items-start gap-3 text-xs ${
                n.read ? 'bg-white border-slate-100' : 'bg-purple-50/50 border-purple-100 font-medium'
              }`}
            >
              <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                <Bell className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-slate-900">{n.title}</p>
                <p className="text-slate-600 mt-0.5">{n.message}</p>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  {new Date(n.createdAt).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
