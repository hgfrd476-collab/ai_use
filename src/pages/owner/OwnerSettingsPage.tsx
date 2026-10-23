import React, { useState } from 'react';
import { Settings, Clock, ShieldCheck, DollarSign, Save } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const OwnerSettingsPage: React.FC = () => {
  const { addToast } = useApp();

  const [checkIn, setCheckIn] = useState('14:00');
  const [checkOut, setCheckOut] = useState('12:00');
  const [autoConfirm, setAutoConfirm] = useState(true);
  const [bankName, setBankName] = useState('ABA Bank');
  const [accNumber, setAccNumber] = useState('001 882 994');

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    addToast('Settings Saved', 'Host policies and payout configuration updated.', 'success');
  };

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Host Policies & Account Settings
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Control operational check-in rules, automatic booking confirmation, and ABA payout credentials.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        <form onSubmit={handleSave} className="space-y-6 text-xs">
          {/* Times */}
          <div className="space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-emerald-600" /> Operational Check-In / Check-Out Hours
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Standard Check-In Time</label>
                <input
                  type="time"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-semibold text-slate-800"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Standard Check-Out Time</label>
                <input
                  type="time"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-semibold text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Booking Confirmation Toggle */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" /> Instant Reservation Confirmation
            </h3>
            <label className="flex items-start gap-3 p-3.5 rounded-2xl bg-slate-50 border border-slate-150 cursor-pointer">
              <input
                type="checkbox"
                checked={autoConfirm}
                onChange={(e) => setAutoConfirm(e.target.checked)}
                className="mt-0.5 text-emerald-600 rounded"
              />
              <div>
                <span className="font-bold text-slate-800 block">Instant Booking On</span>
                <span className="text-[11px] text-slate-500">
                  Guest reservations are automatically confirmed upon online payment without manual host pre-approval.
                </span>
              </div>
            </label>
          </div>

          {/* Linked Payout Bank */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-emerald-600" /> Default Payout Bank Account
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Bank</label>
                <input
                  type="text"
                  value={bankName}
                  onChange={(e) => setBankName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-semibold text-slate-800"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Account Number</label>
                <input
                  type="text"
                  value={accNumber}
                  onChange={(e) => setAccNumber(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-semibold text-slate-800"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold shadow-xs transition cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Host Policies</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
