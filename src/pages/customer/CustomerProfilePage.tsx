import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, ShieldCheck, Camera, Save } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const CustomerProfilePage: React.FC = () => {
  const { currentUser, updateCurrentUser, addToast } = useApp();

  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);
  const [avatar, setAvatar] = useState(currentUser.avatar);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUser({ name, email, phone, avatar });
    addToast('Profile Updated', 'Your customer details were successfully saved.', 'success');
  };

  return (
    <div className="space-y-6 w-full">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Customer Profile
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Manage your personal details used for reservations and communication with local hosts.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          {/* Avatar Section */}
          <div className="flex items-center gap-4">
            <img
              src={avatar}
              alt={name}
              className="w-20 h-20 rounded-2xl object-cover border border-slate-200"
            />
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-slate-900">{name}</h3>
              <p className="text-[11px] text-slate-500">Customer Account</p>
              <button
                type="button"
                onClick={() => {
                  const newImg = prompt('Enter new avatar image URL:', avatar);
                  if (newImg) setAvatar(newImg);
                }}
                className="text-blue-600 font-bold hover:underline inline-block mt-1"
              >
                Change Avatar Photo
              </button>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Full Legal Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-semibold text-slate-800"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-semibold text-slate-800"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Phone / Telegram Number</label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 font-semibold text-slate-800"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-xs transition cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
