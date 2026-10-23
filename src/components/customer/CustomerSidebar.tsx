import React from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  Heart,
  CreditCard,
  MessageSquare,
  Star,
  LifeBuoy,
  Bell,
  User,
  Settings,
  X,
  Globe,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TemplateSidebarItem } from '../template/TemplateSidebarItem';

interface CustomerSidebarProps {
  onClose?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const CustomerSidebar: React.FC<CustomerSidebarProps> = ({
  onClose,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const { bookings, favorites, notifications } = useApp();
  const unreadCount = notifications.filter((n) => !n.read).length;
  const activeBookingsCount = bookings.filter((b) => b.bookingStatus === 'CONFIRMED' || b.bookingStatus === 'PENDING').length;

  return (
    <div className="h-full bg-[#0B63F6] text-white flex flex-col justify-between py-5 select-none overflow-y-auto">
      {/* Top Brand & Navigation */}
      <div>
        <div className={`mb-5 flex items-center ${isCollapsed ? 'justify-center px-2' : 'justify-between px-6'}`}>
          <Link to="/" title="TravelGo Customer Portal" className="flex items-center gap-2 group">
            {isCollapsed ? (
              <div className="w-10 h-10 rounded-2xl bg-white/20 hover:bg-white/30 flex items-center justify-center font-black text-white text-lg tracking-tight transition">
                TG
              </div>
            ) : (
              <span className="text-2xl font-black tracking-tight text-white">
                Travel<span className="text-sky-300">Go</span>
              </span>
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
            to="/customer/dashboard"
            label="Dashboard"
            icon={LayoutDashboard}
            onClick={onClose}
            isCollapsed={isCollapsed}
            end
          />
          <TemplateSidebarItem
            to="/customer/bookings"
            label="Order / Bookings"
            icon={ShoppingBag}
            badge={activeBookingsCount > 0 ? activeBookingsCount : undefined}
            badgeVariant="amber"
            onClick={onClose}
            isCollapsed={isCollapsed}
          />
          <TemplateSidebarItem
            to="/customer/favorites"
            label="Saved Stays & Rides"
            icon={Heart}
            badge={favorites.length > 0 ? favorites.length : undefined}
            onClick={onClose}
            isCollapsed={isCollapsed}
          />
          <TemplateSidebarItem
            to="/customer/payments"
            label="Receipts"
            icon={CreditCard}
            onClick={onClose}
            isCollapsed={isCollapsed}
          />
          <TemplateSidebarItem
            to="/customer/messages"
            label="Chat with Hosts"
            icon={MessageSquare}
            onClick={onClose}
            isCollapsed={isCollapsed}
          />
          <TemplateSidebarItem
            to="/customer/reviews"
            label="Reviews"
            icon={Star}
            onClick={onClose}
            isCollapsed={isCollapsed}
          />
          <TemplateSidebarItem
            to="/customer/support"
            label="Support"
            icon={LifeBuoy}
            onClick={onClose}
            isCollapsed={isCollapsed}
          />
          <TemplateSidebarItem
            to="/customer/notifications"
            label="Alerts"
            icon={Bell}
            badge={unreadCount > 0 ? unreadCount : undefined}
            badgeVariant="emerald"
            onClick={onClose}
            isCollapsed={isCollapsed}
          />
          <TemplateSidebarItem
            to="/customer/profile"
            label="Profile"
            icon={User}
            onClick={onClose}
            isCollapsed={isCollapsed}
          />
          <TemplateSidebarItem
            to="/customer/settings"
            label="Settings"
            icon={Settings}
            onClick={onClose}
            isCollapsed={isCollapsed}
          />
        </nav>
      </div>

      {/* Bottom Footer */}
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
