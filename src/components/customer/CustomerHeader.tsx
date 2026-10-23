import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Send,
  Bell,
  User,
  ChevronDown,
  Globe,
  LogOut,
  Shield,
  Store,
  Menu,
  X,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

interface CustomerHeaderProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const CustomerHeader: React.FC<CustomerHeaderProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const { notifications, markAllNotificationsRead } = useApp();
  const { user, role, switchRole, logout, getRoleDashboardPath } = useAuth();
  const navigate = useNavigate();

  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleRoleSwitch = (newRole: any) => {
    const dest = switchRole(newRole);
    setUserDropdownOpen(false);
    navigate(dest);
  };

  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-30 shadow-md shadow-slate-900/5 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between gap-4">
        {/* Left: Hamburger (Mobile) + TravelGo Brand + Customer Badge */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
              aria-label="Toggle navigation menu"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-700 to-sky-500 flex items-center justify-center text-white shadow-2xs group-hover:scale-105 transition">
              <Send className="w-4 h-4 -rotate-45 translate-x-0.5 fill-white text-white" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-lg text-slate-900 tracking-tight">
                Travel<span className="text-blue-600">Go</span>
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-blue-50 text-blue-700 border border-blue-100">
                Customer Portal
              </span>
            </div>
          </Link>
        </div>

        {/* Right: Browse Marketplace Link, Notifications, Profile Dropdown */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Back to Public Marketplace */}
          <Link
            to="/"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-blue-300 text-slate-600 hover:text-blue-600 text-xs font-semibold bg-white hover:bg-blue-50/40 transition"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Marketplace</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </Link>

          {/* Notifications Popover */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-600 transition cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-600 text-white text-[9px] font-bold flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-3 z-50 text-xs animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                    <span className="font-bold text-slate-900 text-sm">Notifications</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-[11px] font-semibold text-blue-600 hover:underline cursor-pointer"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {notifications.length === 0 ? (
                      <p className="text-center py-4 text-slate-400">No notifications yet</p>
                    ) : (
                      notifications.slice(0, 5).map((n) => (
                        <div
                          key={n.id}
                          className={`p-2.5 rounded-xl border text-left transition ${
                            n.read ? 'bg-white border-slate-100' : 'bg-blue-50/60 border-blue-100 font-medium'
                          }`}
                        >
                          <p className="font-bold text-slate-900 text-xs">{n.title}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">{n.message}</p>
                          <span className="text-[9px] text-slate-400 block mt-1">
                            {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Profile Dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="flex items-center gap-2 p-1.5 pl-2 pr-2.5 rounded-2xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition cursor-pointer"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-7 h-7 rounded-xl object-cover ring-2 ring-blue-100"
              />
              <span className="hidden sm:inline font-bold text-slate-800 max-w-[100px] truncate">
                {user.name.split(' ')[0]}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {userDropdownOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setUserDropdownOpen(false)} />
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 text-xs animate-in fade-in slide-in-from-top-2">
                  <div className="p-2 border-b border-slate-100 flex items-center gap-2.5">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-9 h-9 rounded-xl object-cover"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 truncate">{user.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
                      <span className="inline-block mt-0.5 text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-blue-100 text-blue-700">
                        Customer
                      </span>
                    </div>
                  </div>

                  <div className="p-1.5 border-b border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-1 mb-1">
                      Switch Role Persona
                    </span>
                    <button
                      onClick={() => handleRoleSwitch('BUSINESS_OWNER')}
                      className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl hover:bg-emerald-50 text-slate-700 hover:text-emerald-700 transition cursor-pointer"
                    >
                      <span className="flex items-center gap-2 font-semibold">
                        <Store className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Business Owner</span>
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                    <button
                      onClick={() => handleRoleSwitch('SUPER_ADMIN')}
                      className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl hover:bg-purple-50 text-slate-700 hover:text-purple-700 transition cursor-pointer"
                    >
                      <span className="flex items-center gap-2 font-semibold">
                        <Shield className="w-3.5 h-3.5 text-purple-600" />
                        <span>Super Admin</span>
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                    </button>
                  </div>

                  <div className="p-1">
                    <Link
                      to="/"
                      onClick={() => setUserDropdownOpen(false)}
                      className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-slate-600 hover:bg-slate-50 transition"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Back to TravelGo Marketplace</span>
                    </Link>
                    <Link
                      to="/login"
                      onClick={() => {
                        logout();
                        setUserDropdownOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-red-600 hover:bg-red-50 transition"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Sign Out</span>
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
