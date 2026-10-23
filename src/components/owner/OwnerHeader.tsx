import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Send,
  Building2,
  ChevronDown,
  Bell,
  PlusCircle,
  Check,
  Store,
  Shield,
  User,
  LogOut,
  Globe,
  ExternalLink,
  Menu,
  X,
  Bed,
  Car,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';

interface OwnerHeaderProps {
  onToggleSidebar?: () => void;
  isSidebarOpen?: boolean;
}

export const OwnerHeader: React.FC<OwnerHeaderProps> = ({ onToggleSidebar, isSidebarOpen }) => {
  const {
    currentUser,
    businesses,
    selectedOwnerBusinessId,
    setSelectedOwnerBusinessId,
    notifications,
    markAllNotificationsRead,
    addToast,
  } = useApp();
  const { role, switchRole, logout } = useAuth();
  const navigate = useNavigate();

  const [businessSelectorOpen, setBusinessSelectorOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Filter businesses belonging to this owner
  const myBusinesses = businesses.filter((b) => b.ownerId === currentUser.id);

  const selectedBusiness =
    selectedOwnerBusinessId === 'ALL'
      ? null
      : myBusinesses.find((b) => b.id === selectedOwnerBusinessId);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleSelectBusiness = (id: string | 'ALL') => {
    setSelectedOwnerBusinessId(id);
    setBusinessSelectorOpen(false);
    if (id === 'ALL') {
      addToast('Filter Updated', 'Now viewing aggregated data across all your businesses.', 'info');
    } else {
      const biz = myBusinesses.find((b) => b.id === id);
      addToast('Business Selected', `Dashboard scoped to: ${biz?.name || 'Selected Business'}`, 'success');
    }
  };

  const handleRoleSwitch = (newRole: any) => {
    const dest = switchRole(newRole);
    setUserMenuOpen(false);
    navigate(dest);
  };

  return (
    <header className="bg-white border-b border-slate-100 sticky top-0 z-30 shadow-md shadow-slate-900/5 w-full">
      <div className="w-full px-4 sm:px-6 lg:px-10 h-16 flex items-center justify-between gap-4">
        {/* Left: Mobile Toggle, TravelGo Logo & Owner Portal Badge */}
        <div className="flex items-center gap-3">
          {onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="lg:hidden p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition"
              aria-label="Toggle navigation"
            >
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          <Link to="/owner/dashboard" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-2xs group-hover:scale-105 transition">
              <Store className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-lg text-slate-900 tracking-tight">
                Travel<span className="text-emerald-600">Go</span>
              </span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                Partner Hub
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Business Selector Dropdown [ All Businesses ▼ ] */}
        <div className="relative">
          <button
            onClick={() => setBusinessSelectorOpen(!businessSelectorOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl border-2 border-emerald-200 hover:border-emerald-500 bg-emerald-50/40 text-slate-800 text-xs font-bold transition cursor-pointer shadow-2xs"
          >
            {selectedBusiness ? (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                <span className="max-w-[140px] sm:max-w-[200px] truncate">
                  {selectedBusiness.name}
                </span>
                <span className="text-[10px] uppercase font-semibold text-emerald-700 bg-emerald-100/80 px-1.5 py-0.2 rounded hidden md:inline">
                  {selectedBusiness.category === 'ACCOMMODATION' ? 'Stay' : 'Ride'}
                </span>
              </>
            ) : (
              <>
                <Building2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span className="max-w-[140px] sm:max-w-[200px] truncate">
                  All Businesses ({myBusinesses.length})
                </span>
              </>
            )}
            <ChevronDown className="w-3.5 h-3.5 text-emerald-700 ml-0.5 shrink-0" />
          </button>

          {businessSelectorOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setBusinessSelectorOpen(false)}
              />
              <div className="absolute left-1/2 -translate-x-1/2 sm:left-0 sm:translate-x-0 mt-2 w-72 sm:w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 text-xs animate-in fade-in slide-in-from-top-2">
                <div className="px-2 py-1.5 font-bold text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-100">
                  Switch Active Business Context
                </div>

                {/* All Businesses Option */}
                <button
                  onClick={() => handleSelectBusiness('ALL')}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition my-1 cursor-pointer ${
                    selectedOwnerBusinessId === 'ALL'
                      ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">All Businesses</p>
                      <p className="text-[10px] text-slate-500">
                        Consolidated metrics across all {myBusinesses.length} entities
                      </p>
                    </div>
                  </div>
                  {selectedOwnerBusinessId === 'ALL' && (
                    <Check className="w-4 h-4 text-emerald-600" />
                  )}
                </button>

                {/* Individual Businesses List */}
                <div className="space-y-1 max-h-56 overflow-y-auto">
                  {myBusinesses.map((biz) => {
                    const isStay = biz.category === 'ACCOMMODATION';
                    const isSelected = selectedOwnerBusinessId === biz.id;
                    return (
                      <button
                        key={biz.id}
                        onClick={() => handleSelectBusiness(biz.id)}
                        className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-200'
                            : 'hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <img
                            src={biz.coverImage || biz.images[0]}
                            alt={biz.name}
                            className="w-8 h-8 rounded-lg object-cover shrink-0"
                          />
                          <div className="min-w-0">
                            <p className="font-bold text-slate-900 text-xs truncate">
                              {biz.name}
                            </p>
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                              <span className="flex items-center gap-0.5">
                                {isStay ? <Bed className="w-3 h-3 text-blue-500" /> : <Car className="w-3 h-3 text-emerald-500" />}
                                {biz.type}
                              </span>
                              <span>•</span>
                              <span>{biz.city}</span>
                            </div>
                          </div>
                        </div>
                        {isSelected && <Check className="w-4 h-4 text-emerald-600 shrink-0" />}
                      </button>
                    );
                  })}
                </div>

                {/* Add New Business Link */}
                <div className="pt-2 mt-1 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setBusinessSelectorOpen(false);
                      navigate('/owner/businesses/create');
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs transition cursor-pointer"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>List Another Business</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Right: Public Marketplace link, Notifications, Owner Profile */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Marketplace Browse */}
          <Link
            to="/"
            className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-emerald-400 text-slate-600 hover:text-emerald-700 text-xs font-semibold bg-white hover:bg-emerald-50/40 transition"
          >
            <Globe className="w-3.5 h-3.5" />
            <span>Public Marketplace</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </Link>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              className="relative p-2 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-600 transition cursor-pointer"
              aria-label="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-600 text-white text-[9px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {notificationsOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-3 z-50 text-xs animate-in fade-in slide-in-from-top-2">
                  <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                    <span className="font-bold text-slate-900 text-sm">Host Notifications</span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllNotificationsRead}
                        className="text-[11px] font-semibold text-emerald-600 hover:underline cursor-pointer"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto space-y-2">
                    {notifications.length === 0 ? (
                      <p className="text-center py-4 text-slate-400">No new notifications</p>
                    ) : (
                      notifications.slice(0, 5).map((n) => (
                        <div
                          key={n.id}
                          className={`p-2.5 rounded-xl border text-left transition ${
                            n.read ? 'bg-white border-slate-100' : 'bg-emerald-50/60 border-emerald-100 font-medium'
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
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 p-1.5 pl-2 pr-2.5 rounded-2xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition cursor-pointer"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-xl object-cover ring-2 ring-emerald-200"
              />
              <span className="hidden sm:inline font-bold text-slate-800 max-w-[110px] truncate">
                {currentUser.name.split(' ')[0]}
              </span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {userMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 text-xs animate-in fade-in slide-in-from-top-2">
                  <div className="p-2 border-b border-slate-100 flex items-center gap-2.5">
                    <img
                      src={currentUser.avatar}
                      alt={currentUser.name}
                      className="w-9 h-9 rounded-xl object-cover"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 truncate">{currentUser.name}</p>
                      <p className="text-[10px] text-slate-400 truncate">{currentUser.email}</p>
                      <span className="inline-block mt-0.5 text-[9px] font-bold uppercase px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800">
                        Business Owner
                      </span>
                    </div>
                  </div>

                  <div className="p-1.5 border-b border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-1 mb-1">
                      Switch Role Persona
                    </span>
                    <button
                      onClick={() => handleRoleSwitch('CUSTOMER')}
                      className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl hover:bg-blue-50 text-slate-700 hover:text-blue-700 transition cursor-pointer"
                    >
                      <span className="flex items-center gap-2 font-semibold">
                        <User className="w-3.5 h-3.5 text-blue-600" />
                        <span>Traveler (Customer)</span>
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-slate-400" />
                    </button>
                    <button
                      onClick={() => handleRoleSwitch('SUPER_ADMIN')}
                      className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl hover:bg-purple-50 text-slate-700 hover:text-purple-700 transition cursor-pointer"
                    >
                      <span className="flex items-center gap-2 font-semibold">
                        <Shield className="w-3.5 h-3.5 text-purple-600" />
                        <span>Super Admin</span>
                      </span>
                      <ChevronDown className="w-3.5 h-3.5 -rotate-90 text-slate-400" />
                    </button>
                  </div>

                  <div className="p-1">
                    <Link
                      to="/"
                      onClick={() => setUserMenuOpen(false)}
                      className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-slate-600 hover:bg-slate-50 transition"
                    >
                      <Globe className="w-3.5 h-3.5" />
                      <span>Back to TravelGo Marketplace</span>
                    </Link>
                    <Link
                      to="/login"
                      onClick={() => {
                        logout();
                        setUserMenuOpen(false);
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
