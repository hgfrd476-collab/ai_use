import React from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  ShoppingBag,
  BarChart3,
  Building2,
  Car,
  CalendarDays,
  Users,
  Star,
  Settings,
  X,
  Globe,
  PlusCircle,
  MessageSquare,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TemplateSidebarItem } from '../template/TemplateSidebarItem';

interface OwnerSidebarProps {
  onClose?: () => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const OwnerSidebar: React.FC<OwnerSidebarProps> = ({
  onClose,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const { currentUser, businesses, bookings, selectedOwnerBusinessId, setSelectedOwnerBusinessId } = useApp();

  const ownerBusinesses = businesses.filter((b) => b.ownerId === currentUser.id);

  const relevantBookings = bookings.filter((b) => {
    if (selectedOwnerBusinessId === 'ALL') {
      return ownerBusinesses.some((ob) => ob.id === b.businessId);
    }
    return b.businessId === selectedOwnerBusinessId;
  });

  const pendingCount = relevantBookings.filter((b) => b.bookingStatus === 'PENDING').length;

  return (
    <div className="h-full bg-[#0B63F6] text-white flex flex-col justify-between py-5 select-none overflow-y-auto">
      {/* Top section: Brand Logo & Navigation */}
      <div>
        {/* Brand header */}
        <div className={`mb-5 flex items-center ${isCollapsed ? 'justify-center px-2' : 'justify-between px-6'}`}>
          <Link
            to="/"
            title="TravelGo Marketplace"
            className="flex items-center gap-2 group"
          >
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

        {/* Business Selector Pill inside sidebar */}
        {!isCollapsed ? (
          <div className="px-5 mb-5">
            <label className="block text-[10px] font-bold text-blue-200 uppercase tracking-wider mb-1.5 px-2">
              Active Business
            </label>
            <select
              value={selectedOwnerBusinessId}
              onChange={(e) => setSelectedOwnerBusinessId(e.target.value)}
              className="w-full bg-blue-700/80 hover:bg-blue-700 border border-blue-400/30 text-white font-bold text-xs rounded-xl px-3 py-2 outline-none focus:ring-2 focus:ring-white/40 transition cursor-pointer"
            >
              <option value="ALL" className="text-slate-900 bg-white">
                All Businesses ({ownerBusinesses.length})
              </option>
              {ownerBusinesses.map((b) => (
                <option key={b.id} value={b.id} className="text-slate-900 bg-white">
                  {b.name}
                </option>
              ))}
            </select>
          </div>
        ) : (
          <div className="flex justify-center mb-4">
            <div
              className="w-9 h-9 rounded-xl bg-blue-700/80 flex items-center justify-center text-xs font-black text-blue-200 border border-blue-400/30 cursor-pointer"
              title={`Active: ${
                selectedOwnerBusinessId === 'ALL'
                  ? 'All Businesses'
                  : ownerBusinesses.find((b) => b.id === selectedOwnerBusinessId)?.name || 'Business'
              }`}
            >
              <Building2 className="w-4 h-4" />
            </div>
          </div>
        )}

        {/* Navigation items matching template */}
        <nav className="space-y-1">
          <TemplateSidebarItem
            to="/owner/dashboard"
            label="Dashboard"
            icon={LayoutDashboard}
            onClick={onClose}
            isCollapsed={isCollapsed}
            end
          />
          <TemplateSidebarItem
            to="/owner/bookings"
            label="Order"
            icon={ShoppingBag}
            badge={pendingCount > 0 ? pendingCount : undefined}
            badgeVariant="amber"
            onClick={onClose}
            isCollapsed={isCollapsed}
          />
          <TemplateSidebarItem
            to="/owner/revenue"
            label="Statistic"
            icon={BarChart3}
            onClick={onClose}
            isCollapsed={isCollapsed}
          />
          <TemplateSidebarItem
            to="/owner/accommodation"
            label="Product (Stays)"
            icon={Building2}
            onClick={onClose}
            isCollapsed={isCollapsed}
          />
          <TemplateSidebarItem
            to="/owner/transportation"
            label="Fleet (Rides)"
            icon={Car}
            onClick={onClose}
            isCollapsed={isCollapsed}
          />
          <TemplateSidebarItem
            to="/owner/calendar"
            label="Calendar"
            icon={CalendarDays}
            onClick={onClose}
            isCollapsed={isCollapsed}
          />
          <TemplateSidebarItem
            to="/owner/customers"
            label="Customers"
            icon={Users}
            onClick={onClose}
            isCollapsed={isCollapsed}
          />
          <TemplateSidebarItem
            to="/owner/messages"
            label="Messages"
            icon={MessageSquare}
            onClick={onClose}
            isCollapsed={isCollapsed}
          />
          <TemplateSidebarItem
            to="/owner/reviews"
            label="Reviews"
            icon={Star}
            onClick={onClose}
            isCollapsed={isCollapsed}
          />
          <TemplateSidebarItem
            to="/owner/settings"
            label="Settings"
            icon={Settings}
            onClick={onClose}
            isCollapsed={isCollapsed}
          />
        </nav>
      </div>

      {/* Bottom section: Quick marketplace link & Socials */}
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
