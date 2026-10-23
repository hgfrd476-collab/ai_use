import React from 'react';
import { Settings, Globe, DollarSign, Bell, Shield, Moon, Download } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PWAInstallButton } from '../../components/common/PWAInstallButton';

export const CustomerSettingsPage: React.FC = () => {
  const { currency, setCurrency, language, setLanguage, addToast } = useApp();

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Account Preferences & Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Configure default currency, language, notification preferences, and offline app status.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-6 text-xs">
        {/* Currency & Language Settings */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Globe className="w-4 h-4 text-blue-600" /> Regional Preferences
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Display Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as any)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-semibold text-slate-800"
              >
                <option value="USD">USD ($) - US Dollar</option>
                <option value="KHR">KHR (៛) - Cambodian Riel</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Interface Language</label>
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value as any)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-semibold text-slate-800"
              >
                <option value="en">English (US)</option>
                <option value="km">ភាសាខ្មែរ (Khmer)</option>
              </select>
            </div>
          </div>
        </div>

        {/* PWA & Offline Access */}
        <div className="pt-6 border-t border-slate-100 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Download className="w-4 h-4 text-emerald-600" /> Offline Progressive Web App (PWA)
          </h3>
          <p className="text-slate-600 leading-relaxed">
            Install KampujaGo to your mobile home screen or computer to access confirmed bookings and check-in vouchers even without internet in remote Cambodian regions.
          </p>
          <div className="pt-1">
            <PWAInstallButton />
          </div>
        </div>

        {/* Notifications */}
        <div className="pt-6 border-t border-slate-100 space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Bell className="w-4 h-4 text-amber-500" /> Booking Alerts
          </h3>
          <div className="space-y-2 text-slate-700">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="text-blue-600 rounded" />
              <span>SMS & Telegram check-in reminder 24h before trip</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="text-blue-600 rounded" />
              <span>Host instant message notifications</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" defaultChecked className="text-blue-600 rounded" />
              <span>Exclusive partner discounts & temple tour deals</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
