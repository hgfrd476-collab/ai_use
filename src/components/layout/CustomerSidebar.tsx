import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  CalendarCheck,
  Heart,
  CreditCard,
  MessageSquare,
  Star,
  LifeBuoy,
  Bell,
  User,
  Settings,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CustomerSidebar: React.FC = () => {
  const { currentUser, favorites, notifications } = useApp();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const links = [
    { to: '/customer/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/customer/bookings', label: 'My Bookings', icon: CalendarCheck },
    { to: '/customer/favorites', label: 'Saved Favorites', icon: Heart, badge: favorites.length },
    { to: '/customer/payments', label: 'Payments & Receipts', icon: CreditCard },
    { to: '/customer/messages', label: 'Messages with Hosts', icon: MessageSquare },
    { to: '/customer/reviews', label: 'My Reviews', icon: Star },
    { to: '/customer/support', label: 'Platform Support', icon: LifeBuoy },
    { to: '/customer/notifications', label: 'Notifications', icon: Bell, badge: unreadCount },
    { to: '/customer/profile', label: 'Profile', icon: User },
    { to: '/customer/settings', label: 'Account Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 shrink-0 hidden lg:block">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs sticky top-28">
        {/* User Card */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-150 mb-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-10 h-10 rounded-xl object-cover"
          />
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</h4>
            <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
            <span className="text-[9px] font-bold text-blue-700 uppercase bg-blue-50 px-1.5 py-0.5 rounded">Customer</span>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </div>
                {link.badge !== undefined && link.badge > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-blue-100 text-blue-700">
                    {link.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};
