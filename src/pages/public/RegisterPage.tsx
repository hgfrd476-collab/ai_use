import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Send, UserCheck, Store, ArrowRight, ShieldCheck, Check } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

export const RegisterPage: React.FC = () => {
  const { addToast } = useApp();
  const { login, getRoleDashboardPath } = useAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<UserRole>('CUSTOMER');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    businessName: '',
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      addToast('Missing Info', 'Please enter your name and email address.', 'warning');
      return;
    }

    const dest = login(selectedRole, formData.email);
    addToast(
      'Account Created',
      `Welcome to TravelGo! You are now logged in as ${selectedRole === 'CUSTOMER' ? 'Traveler' : 'Business Owner'}.`,
      'success'
    );
    navigate(dest);
  };

  return (
    <div className="pb-16 max-w-lg mx-auto py-8">
      {/* Brand Header */}
      <div className="text-center mb-8">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-500 flex items-center justify-center text-white font-black text-2xl mx-auto mb-3 shadow-md shadow-blue-500/20">
          <Send className="w-6 h-6 -rotate-45 translate-x-0.5" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">
          Create Your TravelGo Account
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Join thousands of travelers and verified business owners across Cambodia
        </p>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
        {/* Account Role Selector */}
        <div className="mb-6">
          <label className="block text-xs font-bold text-slate-700 mb-2">
            Select Your Account Type:
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSelectedRole('CUSTOMER')}
              className={`p-3.5 rounded-2xl border-2 text-left transition cursor-pointer flex flex-col justify-between ${
                selectedRole === 'CUSTOMER'
                  ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <UserCheck className={`w-5 h-5 ${selectedRole === 'CUSTOMER' ? 'text-blue-600' : 'text-slate-400'}`} />
                {selectedRole === 'CUSTOMER' && <Check className="w-4 h-4 text-blue-600" />}
              </div>
              <div>
                <p className={`text-xs font-bold ${selectedRole === 'CUSTOMER' ? 'text-blue-700' : 'text-slate-800'}`}>
                  Traveler
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">Book stays & rides</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedRole('BUSINESS_OWNER')}
              className={`p-3.5 rounded-2xl border-2 text-left transition cursor-pointer flex flex-col justify-between ${
                selectedRole === 'BUSINESS_OWNER'
                  ? 'border-emerald-600 bg-emerald-50/50 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Store className={`w-5 h-5 ${selectedRole === 'BUSINESS_OWNER' ? 'text-emerald-600' : 'text-slate-400'}`} />
                {selectedRole === 'BUSINESS_OWNER' && <Check className="w-4 h-4 text-emerald-600" />}
              </div>
              <div>
                <p className={`text-xs font-bold ${selectedRole === 'BUSINESS_OWNER' ? 'text-emerald-700' : 'text-slate-800'}`}>
                  Business Owner
                </p>
                <p className="text-[10px] text-slate-500 mt-0.5">List hotels & vehicles</p>
              </div>
            </button>
          </div>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Sok Dara"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address *</label>
            <input
              type="email"
              required
              placeholder="e.g. sok.dara@example.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {selectedRole === 'BUSINESS_OWNER' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Primary Business Name</label>
              <input
                type="text"
                placeholder="e.g. Siem Reap Villa Retreat or Phnom Penh Scooters"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
            <input
              type="tel"
              placeholder="e.g. +855 12 345 678"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Create Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <button
            type="submit"
            className={`w-full py-3 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition cursor-pointer ${
              selectedRole === 'BUSINESS_OWNER'
                ? 'bg-emerald-600 hover:bg-emerald-700'
                : 'bg-blue-600 hover:bg-blue-700'
            }`}
          >
            <span>Register & Enter {selectedRole === 'BUSINESS_OWNER' ? 'Partner Portal' : 'Traveler Portal'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 font-bold hover:underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};
