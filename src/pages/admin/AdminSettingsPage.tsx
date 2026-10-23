import React, { useState } from 'react';
import { Settings, Save, Shield, Percent, CreditCard, Bell, Globe, CheckCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminSettingsPage: React.FC = () => {
  const { addToast } = useApp();
  const [platformCommission, setPlatformCommission] = useState(10);
  const [currencyCode, setCurrencyCode] = useState('USD');
  const [autoApproveVerified, setAutoApproveVerified] = useState(false);
  const [allowInstantBook, setAllowInstantBook] = useState(true);
  const [supportEmail, setSupportEmail] = useState('support@travelgo.com');
  const [supportPhone, setSupportPhone] = useState('+855 23 999 000');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('Configuration Saved', 'Platform parameters updated successfully.', 'success');
  };

  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-black text-slate-900 tracking-tight">Platform Settings & Governance</h1>
        <p className="text-xs text-slate-500 mt-1">
          Global marketplace economics, payment gateway flags, and platform-wide configurations
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Economics Section */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Percent className="w-5 h-5 text-purple-600" />
            <h3 className="text-sm font-bold text-slate-900">Commission & Economics</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Platform Take Rate / Commission (%)
              </label>
              <input
                type="number"
                min="0"
                max="30"
                value={platformCommission}
                onChange={(e) => setPlatformCommission(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500"
              />
              <p className="text-[10px] text-slate-400 mt-1">
                Current standard: 10% platform fee retained on completed check-outs
              </p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Primary Settlement Currency
              </label>
              <select
                value={currencyCode}
                onChange={(e) => setCurrencyCode(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500 bg-white"
              >
                <option value="USD">USD ($) - United States Dollar</option>
                <option value="KHR">KHR (៛) - Cambodian Riel</option>
              </select>
              <p className="text-[10px] text-slate-400 mt-1">
                Dual pricing supported via Bakong National KHQR
              </p>
            </div>
          </div>
        </div>

        {/* Listing Policy Section */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Shield className="w-5 h-5 text-purple-600" />
            <h3 className="text-sm font-bold text-slate-900">Partner & Booking Policy</h3>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
              <input
                type="checkbox"
                checked={allowInstantBook}
                onChange={(e) => setAllowInstantBook(e.target.checked)}
                className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 h-4 w-4"
              />
              <div>
                <p className="font-bold text-slate-800">Enable Instant Direct Booking</p>
                <p className="text-[11px] text-slate-500">Allow travelers to pay and confirm without waiting for host manual approval</p>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 rounded-2xl border border-slate-200 hover:bg-slate-50 cursor-pointer transition">
              <input
                type="checkbox"
                checked={autoApproveVerified}
                onChange={(e) => setAutoApproveVerified(e.target.checked)}
                className="rounded border-slate-300 text-purple-600 focus:ring-purple-500 h-4 w-4"
              />
              <div>
                <p className="font-bold text-slate-800">Auto-Approve Certified Ministry Partners</p>
                <p className="text-[11px] text-slate-500">Skip pending review for pre-vetted Ministry of Tourism certified hosts</p>
              </div>
            </label>
          </div>
        </div>

        {/* Support Channels */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Globe className="w-5 h-5 text-purple-600" />
            <h3 className="text-sm font-bold text-slate-900">Platform Support Dispatch</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Official Support Email</label>
              <input
                type="email"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Hotline Phone</label>
              <input
                type="text"
                value={supportPhone}
                onChange={(e) => setSupportPhone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-xl outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs transition flex items-center gap-2 cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </form>
    </div>
  );
};
