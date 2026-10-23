import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ShieldCheck,
  Building2,
  Users,
  CalendarCheck,
  CreditCard,
  Star,
  LifeBuoy,
  BarChart3,
  Settings,
  FileText,
  Clock,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminSidebar: React.FC = () => {
  const { currentUser, businesses, tickets } = useApp();
  const pendingApprovals = businesses.filter((b) => b.status === 'PENDING').length;
  const openTickets = tickets.filter((t) => t.status === 'OPEN' || t.status === 'IN_PROGRESS').length;

  const links = [
    { to: '/admin/dashboard', label: 'Platform Dashboard', icon: LayoutDashboard },
    { to: '/admin/businesses', label: 'Business Approvals', icon: Building2, badge: pendingApprovals },
    { to: '/admin/users', label: 'User Directory', icon: Users },
    { to: '/admin/bookings', label: 'All Bookings', icon: CalendarCheck },
    { to: '/admin/payments', label: 'Payments & Refunds', icon: CreditCard },
    { to: '/admin/reviews', label: 'Review Moderation', icon: Star },
    { to: '/admin/support', label: 'Support Desk', icon: LifeBuoy, badge: openTickets },
    { to: '/admin/reports', label: 'Analytics & Reports', icon: BarChart3 },
    { to: '/admin/settings', label: 'System Settings', icon: Settings },
    { to: '/admin/audit-logs', label: 'Security Audit Logs', icon: Clock },
  ];

  return (
    <aside className="w-64 shrink-0 hidden lg:block">
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs sticky top-28">
        {/* Admin Header Card */}
        <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-50 border border-purple-100 mb-4">
          <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center text-white font-black text-lg">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <h4 className="text-xs font-bold text-slate-900 truncate">Super Admin</h4>
            <p className="text-[11px] text-slate-500 truncate">Governance & Ops</p>
            <span className="text-[9px] font-bold text-purple-700 uppercase bg-purple-100 px-1.5 py-0.5 rounded">
              Full Privileges
            </span>
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
                      ? 'bg-purple-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`
                }
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </div>
                {link.badge !== undefined && link.badge > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800">
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
