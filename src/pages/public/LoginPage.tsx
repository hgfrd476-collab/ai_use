import React, { useState } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { UserCheck, Store, Shield, ArrowRight, Lock, Send, Mail } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

export const LoginPage: React.FC = () => {
  const { addToast } = useApp();
  const { login, getRoleDashboardPath } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectUrl = searchParams.get('redirect');

  const [activeTab, setActiveTab] = useState<'quick' | 'credentials'>('quick');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSelectRole = (role: UserRole) => {
    const dest = login(role);
    navigate(redirectUrl || dest);
  };

  const handleCredentialsLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      addToast('Error', 'Please enter your email address', 'warning');
      return;
    }
    // Determine persona based on email or default to customer
    let role: UserRole = 'CUSTOMER';
    if (email.includes('admin')) role = 'SUPER_ADMIN';
    else if (email.includes('owner') || email.includes('host') || email.includes('resort')) role = 'BUSINESS_OWNER';

    const dest = login(role, email, password);
    navigate(redirectUrl || dest);
  };

  return (
    <div className="pb-16 max-w-md mx-auto py-8">
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-500 flex items-center justify-center text-white font-black text-2xl mx-auto mb-3 shadow-lg shadow-blue-500/20">
          <Send className="w-6 h-6 -rotate-45 translate-x-0.5" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Welcome to TravelGo
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Accommodation & Transportation Booking Platform
        </p>
      </div>

      {/* Tabs: 1-Click Role Login vs Standard Credentials */}
      <div className="flex bg-slate-200/80 p-1 rounded-2xl mb-6 text-xs font-bold">
        <button
          type="button"
          onClick={() => setActiveTab('quick')}
          className={`flex-1 py-2 rounded-xl transition cursor-pointer ${
            activeTab === 'quick' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          1-Click Role Access
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('credentials')}
          className={`flex-1 py-2 rounded-xl transition cursor-pointer ${
            activeTab === 'credentials' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          Email & Password
        </button>
      </div>

      {activeTab === 'quick' ? (
        <div className="space-y-3">
          {/* Customer Login */}
          <button
            onClick={() => handleSelectRole('CUSTOMER')}
            className="w-full p-4 rounded-2xl border-2 border-blue-200 hover:border-blue-600 bg-white hover:bg-blue-50/50 text-left transition flex items-center justify-between group shadow-xs cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-700">
                    Traveler Persona
                  </h4>
                  <span className="text-[10px] font-bold bg-blue-100 text-blue-700 px-1.5 py-0.2 rounded">
                    Sophea Chan
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Browse stays & rides, manage bookings, vouchers, write reviews
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition" />
          </button>

          {/* Business Owner Login */}
          <button
            onClick={() => handleSelectRole('BUSINESS_OWNER')}
            className="w-full p-4 rounded-2xl border-2 border-emerald-200 hover:border-emerald-600 bg-white hover:bg-emerald-50/50 text-left transition flex items-center justify-between group shadow-xs cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <Store className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-emerald-700">
                    Business Owner Persona
                  </h4>
                  <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                    Vannak Sok
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage multiple businesses (Resort, Motorbikes, Car Rentals), inventory & revenue
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition" />
          </button>

          {/* Super Admin Login */}
          <button
            onClick={() => handleSelectRole('SUPER_ADMIN')}
            className="w-full p-4 rounded-2xl border-2 border-purple-200 hover:border-purple-600 bg-white hover:bg-purple-50/50 text-left transition flex items-center justify-between group shadow-xs cursor-pointer"
          >
            <div className="flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center shrink-0">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-purple-700">
                    Super Admin Persona
                  </h4>
                  <span className="text-[10px] font-bold bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded">
                    Dara Kim
                  </span>
                </div>
                <p className="text-xs text-slate-500 mt-0.5">
                  Approve businesses, platform oversight, reviews, disputes & audit logs
                </p>
              </div>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 group-hover:translate-x-0.5 transition" />
          </button>
        </div>
      ) : (
        <form onSubmit={handleCredentialsLogin} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-xs space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. sophea.chan@gmail.com"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition cursor-pointer"
          >
            Sign In with Email
          </button>
        </form>
      )}

      <div className="mt-6 text-center text-xs text-slate-500">
        Don't have an account?{' '}
        <Link to="/register" className="text-blue-600 font-bold hover:underline">
          Create Account / Register
        </Link>
      </div>

      <div className="mt-6 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
        <Lock className="w-3.5 h-3.5 text-emerald-600" />
        <span>Secure authentication with automated role redirection</span>
      </div>
    </div>
  );
};
