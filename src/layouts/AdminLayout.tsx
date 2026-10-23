import React, { useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import {
  Menu,
  Bell,
  Shield,
  LogOut,
  ArrowLeftRight,
  Maximize,
  Minimize,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react';
import { AdminSidebar } from '../components/admin/AdminSidebar';
import { ToastContainer } from '../components/common/Toast';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

export const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  const { user, logout, switchRole } = useAuth();
  const { notifications, markAllNotificationsRead, businesses, tickets, bookings } = useApp();
  const location = useLocation();

  const unreadNotifications = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch((err) => {
          console.warn('Fullscreen request failed:', err);
        });
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch((err) => {
          console.warn('Exit fullscreen failed:', err);
        });
      }
    }
  };

  const getHeaderInfo = () => {
    const path = location.pathname;
    if (path.includes('/admin/bookings')) return { title: 'Order', subtitle: `${bookings.length} platform transactions` };
    if (path.includes('/admin/businesses')) return { title: 'Businesses', subtitle: `${businesses.length} registered partners` };
    if (path.includes('/admin/users')) return { title: 'Users', subtitle: 'Travelers, hosts & staff accounts' };
    if (path.includes('/admin/accommodation')) return { title: 'Product (Stays)', subtitle: 'Hotels, villas & resorts' };
    if (path.includes('/admin/transportation')) return { title: 'Fleet (Rides)', subtitle: 'Rental vehicles & drivers' };
    if (path.includes('/admin/payments')) return { title: 'Escrow & Payouts', subtitle: 'Platform commissions & transfers' };
    if (path.includes('/admin/reports')) return { title: 'Statistic', subtitle: 'Growth & revenue metrics' };
    if (path.includes('/admin/support')) return { title: 'Disputes', subtitle: `${tickets.length} support requests` };
    if (path.includes('/admin/reviews')) return { title: 'Reviews', subtitle: 'Review moderation & ratings' };
    if (path.includes('/admin/locations')) return { title: 'Locations', subtitle: 'Destination directory' };
    if (path.includes('/admin/notifications')) return { title: 'Broadcasts', subtitle: 'Platform alert dispatches' };
    if (path.includes('/admin/settings')) return { title: 'Settings', subtitle: 'Platform commission & gateways' };
    return { title: 'Dashboard', subtitle: 'Governance & operational control' };
  };

  const headerInfo = getHeaderInfo();

  return (
    <div className="min-h-screen h-screen w-full bg-white flex flex-col lg:flex-row overflow-hidden">
      {/* Desktop Left Sidebar */}
      <aside
        className={`shrink-0 hidden lg:flex flex-col bg-[#0B63F6] h-screen sticky top-0 transition-all duration-300 z-30 ${
          sidebarCollapsed ? 'w-20' : 'w-64 xl:w-72'
        }`}
      >
        <AdminSidebar
          isCollapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
        />
      </aside>

      {/* Mobile Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-[#0B63F6] shadow-2xl overflow-y-auto z-50">
            <AdminSidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}

      {/* Right Main Content Panel */}
      <div className="flex-1 min-w-0 flex flex-col h-screen overflow-y-auto bg-[#F8FAFC]">
        {/* Top Header Bar - Clean White with crisp shadow */}
        <header className="px-6 lg:px-8 py-3.5 flex items-center justify-between border-b border-slate-100 gap-4 sticky top-0 bg-white z-20 shrink-0 shadow-md shadow-slate-900/5">
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 transition cursor-pointer"
              aria-label="Open sidebar"
            >
              <Menu className="w-5 h-5" />
            </button>

            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="hidden lg:flex p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition cursor-pointer"
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
              aria-label="Toggle sidebar collapse"
            >
              {sidebarCollapsed ? <PanelLeft className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
            </button>

            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight">
                {headerInfo.title}
              </h1>
              <p className="text-xs text-slate-400 font-semibold">
                {headerInfo.subtitle}
              </p>
            </div>
          </div>

          {/* Right: Fullscreen Toggle, Notifications & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Fullscreen Toggle Button */}
            <button
              onClick={toggleFullscreen}
              className={`p-2.5 rounded-full transition cursor-pointer relative ${
                isFullscreen
                  ? 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                  : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
              }`}
              title={isFullscreen ? 'Exit Full Screen' : 'Enter Full Screen'}
              aria-label={isFullscreen ? 'Exit full screen' : 'Full screen'}
            >
              {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
            </button>

            {/* Notification Bell */}
            <div className="relative">
              <button
                onClick={() => setNotificationsOpen(!notificationsOpen)}
                className="p-2.5 rounded-full text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition relative cursor-pointer"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotifications > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 rounded-full bg-purple-500 ring-2 ring-white" />
                )}
              </button>

              {notificationsOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setNotificationsOpen(false)} />
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-slate-100 p-4 z-50 text-xs text-slate-800">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-100 mb-2">
                      <span className="font-bold text-slate-900">System Alerts</span>
                      {unreadNotifications > 0 && (
                        <button
                          onClick={markAllNotificationsRead}
                          className="text-[11px] font-bold text-purple-600 hover:underline"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>
                    <div className="max-h-60 overflow-y-auto space-y-2">
                      {notifications.slice(0, 4).map((n) => (
                        <div
                          key={n.id}
                          className={`p-2.5 rounded-xl border ${
                            n.read ? 'bg-white border-slate-100' : 'bg-purple-50/50 border-purple-100'
                          }`}
                        >
                          <p className="font-bold text-slate-800">{n.title}</p>
                          <p className="text-[11px] text-slate-500 mt-0.5">{n.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Profile Avatar */}
            <div className="relative">
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-purple-500/30 transition cursor-pointer"
              >
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-purple-300"
                />
              </button>

              {profileDropdownOpen && (
                <>
                  <div className="fixed inset-0 z-40" onClick={() => setProfileDropdownOpen(false)} />
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 text-xs">
                    <div className="p-3 border-b border-slate-100">
                      <p className="font-bold text-slate-900">{user.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                        Super Admin
                      </span>
                    </div>

                    <div className="p-1 space-y-1">
                      <button
                        onClick={() => switchRole('CUSTOMER')}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 font-medium cursor-pointer"
                      >
                        <ArrowLeftRight className="w-4 h-4 text-blue-600" />
                        <span>Switch to Traveler</span>
                      </button>
                      <button
                        onClick={() => switchRole('BUSINESS_OWNER')}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 font-medium cursor-pointer"
                      >
                        <ArrowLeftRight className="w-4 h-4 text-emerald-600" />
                        <span>Switch to Business Owner</span>
                      </button>
                      <button
                        onClick={logout}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 font-medium cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 sm:p-8 lg:p-10 overflow-x-hidden">
          <Outlet />
        </main>
      </div>

      <ToastContainer />
    </div>
  );
};
