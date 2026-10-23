import React from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  Building2,
  Bed,
  Car,
  ShoppingBag,
  CreditCard,
  Star,
  LifeBuoy,
  BarChart3,
  MapPin,
  Bell,
  Settings,
  Shield,
  X,
  Globe,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TemplateSidebarItem } from '../template/TemplateSidebarItem';

interface AdminSidebarProps {
  onClose?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  onClose,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const { businesses, tickets, notifications } = useApp();

  const pendingBusinesses = businesses.filter((b) => b.status === 'PENDING').length;
  const openTickets = tickets.filter((t) => t.status === 'OPEN').length;
  const unreadNotifications = notifications.filter((n) => !n.read).length;

  return (
    <div className="h-full bg-[#0B63F6] text-white flex flex-col justify-between py-5 select-none overflow-y-auto">
      {/* Brand & Admin Navigation */}
      <div>
        <div className={`mb-5 flex items-center ${isCollapsed ? 'justify-center px-2' : 'justify-between px-6'}`}>
          <Link to="/" title="TravelGo Super Admin" className="flex items-center gap-2 group">
            <div className="w-9 h-9 rounded-xl bg-white text-[#0B63F6] flex items-center justify-center font-black shadow-xs shrink-0">
              <Shield className="w-5 h-5" />
            </div>
            {!isCollapsed && (
              <div>
                <span className="text-xl font-black tracking-tight text-white block leading-none">
                  Travel<span className="text-sky-300">Go</span>
                </span>
                <span className="text-[9px] font-extrabold uppercase text-blue-200 tracking-wider">
                  Super Admin
                </span>
              </div>
            )}
          </Link>

          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition cursor-pointer"
              aria-label="Close navigation"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <nav className="space-y-1">
          <TemplateSidebarItem
            to="/admin/dashboard"
            label="Dashboard"
            icon={LayoutDashboard}
            onClick={onClose}
            isCollapsed={isCollapsed}
            end
          />
          <TemplateSidebarItem
            to="/admin/businesses"
            label="Businesses"
            icon={Building2}
            badge={pendingBusinesses > 0 ? pendingBusinesses : undefined}
            badgeVariant="amber"
            onClick={onClose}
            isCollapsed={isCollapsed}
          />
          <TemplateSidebarItem
            to="/admin/bookings"
            label="Platform Orders"
            icon={ShoppingBag}
            onClick={onClose}
            isCollapsed={isCollapsed}
          />
          <TemplateSidebarItem
            to="/admin/users"
            label="Users & Hosts"
            icon={Users}
            onClick={onClose}
            isCollapsed={isCollapsed}
          />
          <TemplateSidebarItem
            to="/admin/accommodation"
            label="Stays / Hotels"
            icon={Bed}
            onClick={onClose}
            isCollapsed={isCollapsed}
          />
          <TemplateSidebarItem
            to="/admin/transportation"
            label="Vehicles / Fleets"
            icon={Car}
            onClick={onClose}
            isCollapsed={isCollapsed}
          />
          <TemplateSidebarItem
            to="/admin/payments"
            label="Escrow & Payouts"
            icon={CreditCard}
            onClick={onClose}
            isCollapsed={isCollapsed}
          />
          <TemplateSidebarItem
            to="/admin/reports"
            label="Analytics"
            icon={BarChart3}
            onClick={onClose}
            isCollapsed={isCollapsed}
          />
          <TemplateSidebarItem
            to="/admin/support"
            label="Disputes"
            icon={LifeBuoy}
            badge={openTickets > 0 ? openTickets : undefined}
            badgeVariant="amber"
            onClick={onClose}
            isCollapsed={isCollapsed}
          />
          <TemplateSidebarItem
            to="/admin/reviews"
            label="Reviews"
            icon={Star}
            onClick={onClose}
            isCollapsed={isCollapsed}
          />
          <TemplateSidebarItem
            to="/admin/locations"
            label="Locations"
            icon={MapPin}
            onClick={onClose}
            isCollapsed={isCollapsed}
          />
          <TemplateSidebarItem
            to="/admin/notifications"
            label="Broadcasts"
            icon={Bell}
            badge={unreadNotifications > 0 ? unreadNotifications : undefined}
            badgeVariant="emerald"
            onClick={onClose}
            isCollapsed={isCollapsed}
          />
          <TemplateSidebarItem
            to="/admin/settings"
            label="Platform Config"
            icon={Settings}
            onClick={onClose}
            isCollapsed={isCollapsed}
          />
        </nav>
      </div>

      {/* Bottom section */}
      <div className={`pt-4 border-t border-blue-500/40 ${isCollapsed ? 'px-2' : 'px-6'}`}>
        <Link
          to="/"
          title="Public Marketplace"
          className={`flex items-center gap-2 text-xs font-bold text-blue-100 hover:text-white transition mb-3 ${
            isCollapsed ? 'justify-center p-2 rounded-xl hover:bg-white/10' : 'px-2'
          }`}
        >
          <Globe className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Public Marketplace</span>}
        </Link>

        {!isCollapsed && (
          <div className="flex items-center gap-3 text-[11px] font-semibold text-blue-200/70 px-2">
            <a href="#facebook" className="hover:text-white transition">
              Facebook
            </a>
            <span>·</span>
            <a href="#twitter" className="hover:text-white transition">
              Twitter
            </a>
            <span>·</span>
            <a href="#google" className="hover:text-white transition">
              Google
            </a>
          </div>
        )}
      </div>
    </div>
  );
};
