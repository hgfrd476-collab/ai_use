import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Building2,
  Bed,
  Car,
  CalendarCheck,
  CalendarDays,
  Users,
  DollarSign,
  Star,
  MessageSquare,
  Settings,
  PlusCircle,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const OwnerSidebar: React.FC = () => {
  const { currentUser, businesses, bookings } = useApp();
  const ownerBusinesses = businesses.filter((b) => b.ownerId === currentUser.id);
  const pendingBookings = bookings.filter(
    (b) => b.bookingStatus === 'PENDING' && ownerBusinesses.some((ob) => ob.id === b.businessId)
  ).length;

  const links = [
    { to: '/owner/dashboard', label: 'Overview', icon: LayoutDashboard },
    { to: '/owner/businesses', label: 'My Businesses', icon: Building2, badge: ownerBusinesses.length },
    { to: '/owner/accommodation', label: 'Accommodations', icon: Bed },
    { to: '/owner/transportation', label: 'Transportation Fleet', icon: Car },
    { to: '/owner/bookings', label: 'Bookings & Orders', icon: CalendarCheck, badge: pendingBookings },
    { to: '/owner/calendar', label: 'Availability Calendar', icon: CalendarDays },
    { to: '/owner/customers', label: 'Customer Directory', icon: Users },
    { to: '/owner/revenue', label: 'Revenue & Payouts', icon: DollarSign },
    { to: '/owner/reviews', label: 'Customer Reviews', icon: Star },
    { to: '/owner/messages', label: 'Direct Messages', icon: MessageSquare },
    { to: '/owner/settings', label: 'Business Settings', icon: Settings },
  ];

  return (
    <aside className="w-64 shrink-0 hidden lg:block">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs sticky top-28">
        {/* Owner Profile Banner */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-emerald-50 border border-emerald-100 mb-4">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-10 h-10 rounded-xl object-cover"
          />
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-slate-900 truncate">{currentUser.name}</h4>
            <p className="text-[11px] text-slate-500 truncate">Hospitality Partner</p>
            <span className="text-[9px] font-bold text-emerald-700 uppercase bg-emerald-100 px-1.5 py-0.5 rounded">
              Verified Host
            </span>
          </div>
        </div>

        {/* Quick New Business Button */}
        <NavLink
          to="/owner/businesses/create"
          className="w-full flex items-center justify-center gap-2 mb-3 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Business Listing</span>
        </NavLink>

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
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </div>
                {link.badge !== undefined && link.badge > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
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
