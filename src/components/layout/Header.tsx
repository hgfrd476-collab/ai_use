import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Send,
  Bed,
  Car,
  Heart,
  Bell,
  User as UserIcon,
  Menu,
  X,
  MapPin,
  Tag,
  HelpCircle,
  LogOut,
  ChevronDown,
  Building2,
  ShieldCheck,
  CheckCheck,
  Globe,
  Sparkles,
  Compass,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Header: React.FC = () => {
  const {
    currentUser,
    currentRole,
    setCurrentRole,
    favorites,
    notifications,
    markAllNotificationsRead,
    currency,
    setCurrency,
    language,
    setLanguage,
    t,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const unreadNotifs = notifications.filter((n) => !n.read);

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-100 shadow-[0_2px_12px_-4px_rgba(15,23,42,0.03)] sticky top-0 z-40 transition-all w-full">
      <div className="w-full px-4 sm:px-6 lg:px-10 h-18 sm:h-20 flex items-center justify-between gap-4">
        {/* Brand Logo - Styled following the Travel Booking UI concept in the image */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform duration-200">
            {/* Aerodynamic Paper Plane / Travel Wing Emblem */}
            <Send className="w-5 h-5 -rotate-45 translate-x-0.5 fill-white text-white" />
          </div>
          <div className="flex flex-col">
            <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 leading-none">
              Kampuja<span className="text-blue-600">Go</span>
            </span>
            <span className="text-[10px] font-bold text-slate-400 tracking-wider uppercase mt-0.5">
              Cambodia Travel
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links - Centered, spacious, elegant */}
        <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
          <Link
            to="/"
            className={`relative px-3.5 py-2 text-sm font-semibold transition-colors ${
              isActive('/') && location.pathname === '/'
                ? 'text-blue-600 font-bold after:absolute after:bottom-[-22px] after:left-3.5 after:right-3.5 after:h-[2.5px] after:bg-blue-600 after:rounded-full'
                : 'text-slate-600 hover:text-blue-600'
            }`}
          >
            Home
          </Link>

          <Link
            to="/destinations"
            className={`relative px-3.5 py-2 text-sm font-semibold transition-colors ${
              isActive('/destinations')
                ? 'text-blue-600 font-bold after:absolute after:bottom-[-22px] after:left-3.5 after:right-3.5 after:h-[2.5px] after:bg-blue-600 after:rounded-full'
                : 'text-slate-600 hover:text-blue-600'
            }`}
          >
            Destinations
          </Link>

          <Link
            to="/search?category=accommodation"
            className={`relative px-3.5 py-2 text-sm font-semibold transition-colors ${
              location.search.includes('accommodation')
                ? 'text-blue-600 font-bold after:absolute after:bottom-[-22px] after:left-3.5 after:right-3.5 after:h-[2.5px] after:bg-blue-600 after:rounded-full'
                : 'text-slate-600 hover:text-blue-600'
            }`}
          >
            Stays
          </Link>

          <Link
            to="/search?category=transportation"
            className={`relative px-3.5 py-2 text-sm font-semibold transition-colors ${
              location.search.includes('transportation')
                ? 'text-blue-600 font-bold after:absolute after:bottom-[-22px] after:left-3.5 after:right-3.5 after:h-[2.5px] after:bg-blue-600 after:rounded-full'
                : 'text-slate-600 hover:text-blue-600'
            }`}
          >
            Transport
          </Link>

          <Link
            to="/offers"
            className={`relative px-3.5 py-2 text-sm font-semibold transition-colors ${
              isActive('/offers')
                ? 'text-blue-600 font-bold after:absolute after:bottom-[-22px] after:left-3.5 after:right-3.5 after:h-[2.5px] after:bg-blue-600 after:rounded-full'
                : 'text-slate-600 hover:text-blue-600'
            }`}
          >
            Deals
          </Link>

          <Link
            to="/about"
            className={`relative px-3.5 py-2 text-sm font-semibold transition-colors ${
              isActive('/about')
                ? 'text-blue-600 font-bold after:absolute after:bottom-[-22px] after:left-3.5 after:right-3.5 after:h-[2.5px] after:bg-blue-600 after:rounded-full'
                : 'text-slate-600 hover:text-blue-600'
            }`}
          >
            About Us
          </Link>
        </nav>

        {/* Right Actions: Currency/Lang, Favorites, Notifications, User Profile & Blue Action Button */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Currency & Language Selector Pill */}
          <div className="relative hidden sm:block">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-xs font-bold text-slate-700 hover:text-blue-600 hover:bg-slate-50 border border-slate-200/80 transition cursor-pointer"
              title="Currency & Language"
            >
              <Globe className="w-3.5 h-3.5 text-blue-600" />
              <span>{currency}</span>
              <span className="text-slate-300">•</span>
              <span className="uppercase">{language}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>

            {langDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 rounded-2xl bg-white shadow-xl border border-slate-100 p-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Currency
                </div>
                <div className="grid grid-cols-2 gap-1 mb-2">
                  <button
                    onClick={() => {
                      setCurrency('USD');
                      setLangDropdownOpen(false);
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition text-left ${
                      currency === 'USD' ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    $ USD
                  </button>
                  <button
                    onClick={() => {
                      setCurrency('KHR');
                      setLangDropdownOpen(false);
                    }}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition text-left ${
                      currency === 'KHR' ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    ៛ KHR
                  </button>
                </div>
                <div className="border-t border-slate-100 pt-1">
                  <div className="px-2 py-1.5 text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    Language
                  </div>
                  <button
                    onClick={() => {
                      setLanguage('en');
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full px-2.5 py-1.5 rounded-lg text-xs font-bold transition text-left ${
                      language === 'en' ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    English (EN)
                  </button>
                  <button
                    onClick={() => {
                      setLanguage('km');
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full px-2.5 py-1.5 rounded-lg text-xs font-bold transition text-left ${
                      language === 'km' ? 'bg-blue-50 text-blue-600' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    ភាសាខ្មែរ (KM)
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Favorites Heart */}
          <Link
            to="/customer/favorites"
            aria-label="Favorites"
            className="relative p-2 text-slate-600 hover:text-rose-600 hover:bg-slate-50 rounded-full transition"
            title="Saved Favorites"
          >
            <Heart className="w-5 h-5" />
            {favorites.length > 0 && (
              <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white shadow-xs">
                {favorites.length}
              </span>
            )}
          </Link>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              onClick={() => setNotificationsOpen(!notificationsOpen)}
              aria-label="Notifications"
              className="relative p-2 text-slate-600 hover:text-blue-600 hover:bg-slate-50 rounded-full transition cursor-pointer"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifs.length > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shadow-xs animate-pulse">
                  {unreadNotifs.length}
                </span>
              )}
            </button>

            {/* Notifications Dropdown Panel */}
            {notificationsOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 rounded-2xl bg-white shadow-2xl border border-slate-100 p-4 z-50 animate-in fade-in zoom-in-95">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <h4 className="text-sm font-bold text-slate-900">Notifications</h4>
                    {unreadNotifs.length > 0 && (
                      <span className="px-2 py-0.5 rounded-full bg-blue-100 text-[11px] font-bold text-blue-700">
                        {unreadNotifs.length} new
                      </span>
                    )}
                  </div>
                  {unreadNotifs.length > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-xs font-semibold text-blue-600 hover:underline flex items-center gap-1 cursor-pointer"
                    >
                      <CheckCheck className="w-3.5 h-3.5" /> Mark all read
                    </button>
                  )}
                </div>

                <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto mt-2">
                  {notifications.length === 0 ? (
                    <p className="py-6 text-center text-xs text-slate-400">No notifications yet.</p>
                  ) : (
                    notifications.map((notif) => (
                      <Link
                        key={notif.id}
                        to={notif.link}
                        onClick={() => setNotificationsOpen(false)}
                        className={`block py-3 px-2.5 rounded-xl transition ${
                          notif.read ? 'hover:bg-slate-50' : 'bg-blue-50/50 hover:bg-blue-50'
                        }`}
                      >
                        <p className="text-xs font-bold text-slate-900">{notif.title}</p>
                        <p className="text-xs text-slate-600 mt-0.5 leading-snug">{notif.message}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">
                          {new Date(notif.createdAt).toLocaleDateString()}
                        </span>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Profile Avatar Circle (Matching the circular user icon in the image) */}
          <div className="relative">
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-slate-200/90 hover:border-blue-500 overflow-hidden flex items-center justify-center text-slate-700 bg-slate-50 hover:bg-white transition-all shadow-2xs cursor-pointer"
              title="User Account"
            >
              {currentUser.avatar ? (
                <img
                  src={currentUser.avatar}
                  alt={currentUser.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <UserIcon className="w-5 h-5 text-slate-600" />
              )}
            </button>

            {userDropdownOpen && (
              <div className="absolute right-0 mt-2 w-60 rounded-2xl bg-white shadow-2xl border border-slate-100 p-2 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-2.5 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                  <div className="mt-1.5 flex items-center gap-1.5">
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-bold uppercase bg-blue-50 text-blue-700 border border-blue-100">
                      {currentRole.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="py-1 space-y-0.5 text-xs">
                  <Link
                    to="/customer/dashboard"
                    onClick={() => {
                      setCurrentRole('CUSTOMER');
                      setUserDropdownOpen(false);
                    }}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition font-medium"
                  >
                    <UserIcon className="w-4 h-4 text-blue-600" />
                    <span>Customer Portal</span>
                  </Link>

                  <Link
                    to="/owner/dashboard"
                    onClick={() => {
                      setCurrentRole('BUSINESS_OWNER');
                      setUserDropdownOpen(false);
                    }}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-emerald-600 transition font-medium"
                  >
                    <Building2 className="w-4 h-4 text-emerald-600" />
                    <span>Business Owner Portal</span>
                  </Link>

                  <Link
                    to="/admin/dashboard"
                    onClick={() => {
                      setCurrentRole('SUPER_ADMIN');
                      setUserDropdownOpen(false);
                    }}
                    className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-slate-700 hover:bg-slate-50 hover:text-purple-600 transition font-medium"
                  >
                    <ShieldCheck className="w-4 h-4 text-purple-600" />
                    <span>Super Admin Portal</span>
                  </Link>
                </div>

                <div className="pt-1 border-t border-slate-100">
                  <Link
                    to="/login"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 text-xs font-semibold transition"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out / Switch</span>
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Primary Action Button (Matching the prominent bright blue button in the image) */}
          <Link
            to="/customer/dashboard"
            className="hidden sm:inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-xs sm:text-sm px-4 sm:px-5 py-2.5 rounded-xl shadow-sm hover:shadow-md transition-all duration-150"
          >
            Sign In
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-xl transition"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-slate-800" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-b border-slate-200/90 px-4 py-3 space-y-2 animate-in slide-in-from-top duration-150 shadow-lg">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-blue-50 hover:text-blue-600 transition"
          >
            <Compass className="w-5 h-5 text-blue-600" />
            <span>Home</span>
          </Link>

          <Link
            to="/destinations"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-blue-50 hover:text-blue-600 transition"
          >
            <MapPin className="w-5 h-5 text-blue-600" />
            <span>Destinations</span>
          </Link>

          <Link
            to="/search?category=accommodation"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-blue-50 hover:text-blue-600 transition"
          >
            <Bed className="w-5 h-5 text-blue-600" />
            <span>Stays (Hotels & Villas)</span>
          </Link>

          <Link
            to="/search?category=transportation"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-blue-50 hover:text-blue-600 transition"
          >
            <Car className="w-5 h-5 text-emerald-600" />
            <span>Transportation (Rides & Rentals)</span>
          </Link>

          <Link
            to="/offers"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-blue-50 hover:text-blue-600 transition"
          >
            <Tag className="w-5 h-5 text-amber-500" />
            <span>Deals & Offers</span>
          </Link>

          <Link
            to="/about"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold text-slate-800 hover:bg-blue-50 hover:text-blue-600 transition"
          >
            <HelpCircle className="w-5 h-5 text-slate-400" />
            <span>About Us</span>
          </Link>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <Link
              to="/customer/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2.5 rounded-xl bg-blue-600 text-white font-bold text-sm shadow-xs"
            >
              Sign In to Account
            </Link>
            <Link
              to="/owner/businesses/create"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full text-center py-2 rounded-xl bg-slate-100 text-slate-700 font-semibold text-xs"
            >
              List Your Business
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
