import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Send,
  Bed,
  Car,
  Compass,
  Tag,
  Info,
  HelpCircle,
  PhoneCall,
  User,
  ChevronDown,
  Menu,
  X,
  LogOut,
  LayoutDashboard,
  Shield,
  Store,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { CurrencyCode } from '../../utils/currency';
import { LanguageCode } from '../../data/translations';

export const PublicHeader: React.FC = () => {
  const { currency, setCurrency, language, setLanguage, t } = useApp();
  const { user, role, switchRole, logout, getRoleDashboardPath } = useAuth();
  const navigate = useNavigate();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [currencyMenuOpen, setCurrencyMenuOpen] = useState(false);

  const handleRoleSelect = (newRole: any) => {
    const dest = switchRole(newRole);
    setUserMenuOpen(false);
    navigate(dest);
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: null },
    { to: '/search?category=accommodation', label: 'Stays', icon: Bed },
    { to: '/search?category=transportation', label: 'Transport', icon: Car },
    { to: '/destinations', label: 'Destinations', icon: Compass },
    { to: '/offers', label: 'Deals', icon: Tag },
    { to: '/about', label: 'About', icon: Info },
    { to: '/contact', label: 'Contact', icon: PhoneCall },
    { to: '/faq', label: 'FAQ', icon: HelpCircle },
  ];

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-40 shadow-xs w-full">
      <div className="w-full px-4 sm:px-6 lg:px-10 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo - TravelGo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-500 flex items-center justify-center text-white shadow-md shadow-blue-500/25 group-hover:scale-105 transition-transform duration-200">
            <Send className="w-5 h-5 -rotate-45 translate-x-0.5 fill-white text-white" />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center tracking-tight leading-none font-black text-2xl text-slate-900">
              <span>Travel</span>
              <span className="text-blue-600">Go</span>
            </div>
            <span className="text-[10px] font-semibold tracking-wider text-slate-400 uppercase mt-0.5">
              Stays & Rides
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden xl:flex items-center gap-1 text-xs font-semibold text-slate-600">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `flex items-center gap-1.5 px-3 py-2 rounded-xl transition cursor-pointer ${
                    isActive
                      ? 'bg-blue-50 text-blue-600 font-bold'
                      : 'hover:text-blue-600 hover:bg-slate-50'
                  }`
                }
              >
                {Icon && <Icon className="w-3.5 h-3.5" />}
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Right Action Items */}
        <div className="flex items-center gap-2.5">
          {/* Currency & Language Popover */}
          <div className="relative">
            <button
              onClick={() => setCurrencyMenuOpen(!currencyMenuOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer shadow-2xs"
            >
              <span className="font-bold text-blue-600">{currency === 'USD' ? '$ USD' : '៛ KHR'}</span>
              <span className="text-slate-300">|</span>
              <span>{language.toUpperCase()}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {currencyMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setCurrencyMenuOpen(false)}
                />
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="p-1.5 font-bold text-slate-400 uppercase text-[10px] tracking-wider">
                    Currency
                  </div>
                  <div className="grid grid-cols-2 gap-1 mb-2">
                    <button
                      onClick={() => {
                        setCurrency('USD');
                        setCurrencyMenuOpen(false);
                      }}
                      className={`py-1.5 px-2 rounded-lg font-bold text-center transition cursor-pointer ${
                        currency === 'USD'
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      $ USD
                    </button>
                    <button
                      onClick={() => {
                        setCurrency('KHR');
                        setCurrencyMenuOpen(false);
                      }}
                      className={`py-1.5 px-2 rounded-lg font-bold text-center transition cursor-pointer ${
                        currency === 'KHR'
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      ៛ KHR
                    </button>
                  </div>
                  <div className="p-1.5 font-bold text-slate-400 uppercase text-[10px] tracking-wider border-t border-slate-100">
                    Language
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    <button
                      onClick={() => {
                        setLanguage('en');
                        setCurrencyMenuOpen(false);
                      }}
                      className={`py-1.5 px-2 rounded-lg font-bold text-center transition cursor-pointer ${
                        language === 'en'
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      English
                    </button>
                    <button
                      onClick={() => {
                        setLanguage('km');
                        setCurrencyMenuOpen(false);
                      }}
                      className={`py-1.5 px-2 rounded-lg font-bold text-center transition cursor-pointer ${
                        language === 'km'
                          ? 'bg-blue-600 text-white shadow-2xs'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      ខ្មែរ
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* User Profile / Portal Access Dropdown */}
          <div className="relative">
            <button
              onClick={() => setUserMenuOpen(!userMenuOpen)}
              className="flex items-center gap-2 p-1.5 pl-2 pr-3 rounded-2xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 transition cursor-pointer shadow-2xs"
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

            {userMenuOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setUserMenuOpen(false)} />
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="p-2 border-b border-slate-100 flex items-center gap-3">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="w-10 h-10 rounded-xl object-cover"
                    />
                    <div className="min-w-0">
                      <p className="font-bold text-slate-900 truncate">{user.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
                      <span className="inline-block mt-0.5 text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                        {role.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Direct Link to Role Dashboard */}
                  <div className="p-1.5">
                    <button
                      onClick={() => {
                        setUserMenuOpen(false);
                        navigate(getRoleDashboardPath(role));
                      }}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow-xs cursor-pointer mb-1"
                    >
                      <span className="flex items-center gap-2">
                        <LayoutDashboard className="w-4 h-4" />
                        <span>Go to {role === 'SUPER_ADMIN' ? 'Admin Desk' : role === 'BUSINESS_OWNER' ? 'Owner Portal' : 'My Travel Portal'}</span>
                      </span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Switch Persona Shortcuts */}
                  <div className="p-1.5 border-t border-slate-100">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-1 mb-1">
                      Switch Role Persona
                    </span>
                    <button
                      onClick={() => handleRoleSelect('CUSTOMER')}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left transition ${
                        role === 'CUSTOMER' ? 'bg-blue-50 text-blue-700 font-bold' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <User className="w-3.5 h-3.5 text-blue-600" />
                        <span>Traveler (Customer)</span>
                      </span>
                      {role === 'CUSTOMER' && <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />}
                    </button>

                    <button
                      onClick={() => handleRoleSelect('BUSINESS_OWNER')}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left transition ${
                        role === 'BUSINESS_OWNER' ? 'bg-emerald-50 text-emerald-700 font-bold' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Store className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Business Owner</span>
                      </span>
                      {role === 'BUSINESS_OWNER' && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />}
                    </button>

                    <button
                      onClick={() => handleRoleSelect('SUPER_ADMIN')}
                      className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left transition ${
                        role === 'SUPER_ADMIN' ? 'bg-purple-50 text-purple-700 font-bold' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <Shield className="w-3.5 h-3.5 text-purple-600" />
                        <span>Super Admin</span>
                      </span>
                      {role === 'SUPER_ADMIN' && <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />}
                    </button>
                  </div>

                  <div className="p-1 border-t border-slate-100">
                    <Link
                      to="/login"
                      onClick={() => setUserMenuOpen(false)}
                      className="w-full flex items-center gap-2 px-2.5 py-2 rounded-xl text-slate-600 hover:bg-slate-50 transition"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Log Out / Change Account</span>
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Quick Login / Register Links */}
          <Link
            to="/login"
            className="hidden sm:inline-flex items-center justify-center px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
          >
            Sign In
          </Link>

          {/* Mobile Menu Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="xl:hidden p-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition cursor-pointer"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-100 bg-white px-6 py-4 space-y-2 text-xs font-semibold animate-in slide-in-from-top-4 duration-200">
          {navLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition ${
                    isActive ? 'bg-blue-50 text-blue-600 font-bold' : 'text-slate-700 hover:bg-slate-50'
                  }`
                }
              >
                {Icon && <Icon className="w-4 h-4 text-blue-600" />}
                <span>{item.label}</span>
              </NavLink>
            );
          })}
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-3">
            <Link
              to="/login"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-center"
            >
              Sign In
            </Link>
            <Link
              to="/register"
              onClick={() => setMobileMenuOpen(false)}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-800 font-bold text-center hover:bg-slate-50"
            >
              Register
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};
