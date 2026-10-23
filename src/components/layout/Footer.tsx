import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Send,
  Bed,
  Car,
  MapPin,
  ShieldCheck,
  Headphones,
  Lock,
  Mail,
  Phone,
  Gift,
  Building2,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const Footer: React.FC = () => {
  const { setCurrentRole, addToast } = useApp();
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes('@')) {
      addToast('Invalid Email', 'Please enter a valid email address to receive discounts.', 'warning');
      return;
    }
    setSubscribed(true);
    addToast(
      'Exclusive Deals Unlocked!',
      'Check your inbox! We sent your 20% discount code for your first Cambodia booking.',
      'success'
    );
    setEmailInput('');
  };

  return (
    <footer className="bg-white border-t border-slate-200/90 text-slate-600 text-xs pb-20 sm:pb-8 pt-0 transition-colors">
      {/* 1. Value Proposition Guarantees Bar */}
      <div className="border-b border-slate-100 py-8 bg-slate-50/70">
        <div className="w-full px-4 sm:px-6 lg:px-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {/* Guarantee 1: Best Price Guarantee */}
            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white border border-slate-100 shadow-2xs">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-100">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 leading-tight">Best Price Guarantee</h4>
                <p className="text-xs text-slate-500 mt-0.5">We ensure you get the best deals across Cambodia</p>
              </div>
            </div>

            {/* Guarantee 2: 24/7 Customer Support */}
            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white border border-slate-100 shadow-2xs">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-100">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 leading-tight">24/7 Customer Support</h4>
                <p className="text-xs text-slate-500 mt-0.5">We're here to help anytime in Khmer and English</p>
              </div>
            </div>

            {/* Guarantee 3: Easy & Secure Booking */}
            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white border border-slate-100 shadow-2xs">
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-100">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 leading-tight">Easy & Secure Booking</h4>
                <p className="text-xs text-slate-500 mt-0.5">Direct, instant booking confirmation & verified stays</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Unlock Exclusive Deals Newsletter Banner */}
      <div className="w-full px-4 sm:px-6 lg:px-10 pt-10 pb-12">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-blue-600 via-blue-600 to-indigo-600 p-6 sm:p-10 shadow-lg shadow-blue-500/10">
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-16 -left-16 w-64 h-64 rounded-full bg-sky-400/15 blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <div className="hidden sm:flex w-13 h-13 rounded-2xl bg-white/20 backdrop-blur-md items-center justify-center text-white shrink-0 shadow-inner">
                <Gift className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                  Unlock Exclusive Deals
                </h3>
                <p className="text-xs sm:text-sm text-blue-100 mt-1">
                  Sign up now and get up to 20% off on your first booking in Cambodia!
                </p>
              </div>
            </div>

            <form onSubmit={handleSubscribe} className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-2.5">
              <div className="relative w-full sm:w-72 md:w-80">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white text-slate-900 placeholder:text-slate-400 rounded-xl text-xs sm:text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white shadow-xs"
                />
              </div>
              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-3 bg-white hover:bg-blue-50 active:bg-slate-100 text-blue-600 font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-all shrink-0 cursor-pointer"
              >
                {subscribed ? 'Subscribed!' : 'Subscribe'}
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* 3. Main Footer Directory */}
      <div className="w-full px-4 sm:px-6 lg:px-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-slate-200/80">
          {/* Col 1: Brand & Contact Info */}
          <div className="col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-700 via-blue-600 to-sky-500 flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition">
                <Send className="w-4 h-4 -rotate-45 translate-x-0.5 fill-white text-white" />
              </div>
              <span className="text-xl font-black text-slate-900 tracking-tight">
                Kampuja<span className="text-blue-600">Go</span>
              </span>
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              Cambodia's premier unified travel platform for boutique stays, private villas, motorbikes, chauffeurs, and cultural excursions.
            </p>
            <div className="pt-1 flex flex-col gap-2.5 text-xs text-slate-600">
              <span className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" /> Preah Monivong Blvd, Phnom Penh & Wat Bo, Siem Reap
              </span>
              <span className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> +855 23 999 000 (24/7 Support)
              </span>
              <span className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-600 shrink-0" /> contact@kampujago.com
              </span>
            </div>
          </div>

          {/* Col 2: Accommodations */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3.5 flex items-center gap-1.5">
              <Bed className="w-3.5 h-3.5 text-blue-600" /> Stays & Lodging
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/search?category=accommodation&type=HOTEL" className="text-slate-600 hover:text-blue-600 transition font-medium">
                  Luxury Hotels
                </Link>
              </li>
              <li>
                <Link to="/search?category=accommodation&type=RESORT" className="text-slate-600 hover:text-blue-600 transition font-medium">
                  Tropical Resorts
                </Link>
              </li>
              <li>
                <Link to="/search?category=accommodation&type=VILLA" className="text-slate-600 hover:text-blue-600 transition font-medium">
                  Private Boutique Villas
                </Link>
              </li>
              <li>
                <Link to="/search?category=accommodation&type=HOMESTAY" className="text-slate-600 hover:text-blue-600 transition font-medium">
                  Eco-Bungalows & Homestays
                </Link>
              </li>
              <li>
                <Link to="/search?category=accommodation&type=APARTMENT" className="text-slate-600 hover:text-blue-600 transition font-medium">
                  Serviced City Suites
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Transportation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3.5 flex items-center gap-1.5">
              <Car className="w-3.5 h-3.5 text-emerald-600" /> Transportation
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/search?category=transportation&type=MOTORBIKE" className="text-slate-600 hover:text-blue-600 transition font-medium">
                  Motorbikes & Scooters
                </Link>
              </li>
              <li>
                <Link to="/search?category=transportation&type=TUK_TUK" className="text-slate-600 hover:text-blue-600 transition font-medium">
                  Traditional Khmer Tuk Tuks
                </Link>
              </li>
              <li>
                <Link to="/search?category=transportation&type=CAR" className="text-slate-600 hover:text-blue-600 transition font-medium">
                  SUVs & Chauffeur Cars
                </Link>
              </li>
              <li>
                <Link to="/search?category=transportation&type=VAN" className="text-slate-600 hover:text-blue-600 transition font-medium">
                  VIP 15-Seat Travel Vans
                </Link>
              </li>
              <li>
                <Link to="/search?category=transportation&type=BOAT" className="text-slate-600 hover:text-blue-600 transition font-medium">
                  Island Speedboats & Ferries
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Business Partners & Portals */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3.5 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-amber-600" /> For Businesses
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/owner/businesses/create" className="text-blue-600 hover:text-blue-700 font-bold transition flex items-center gap-1">
                  <span>+ List Your Business</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/owner/dashboard"
                  onClick={() => setCurrentRole('BUSINESS_OWNER')}
                  className="text-slate-600 hover:text-blue-600 transition font-medium"
                >
                  Owner Portal
                </Link>
              </li>
              <li>
                <Link
                  to="/admin/dashboard"
                  onClick={() => setCurrentRole('SUPER_ADMIN')}
                  className="text-slate-600 hover:text-blue-600 transition font-medium"
                >
                  Super Admin Desk
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-slate-600 hover:text-blue-600 transition font-medium">
                  About KampujaGo
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-slate-600 hover:text-blue-600 transition font-medium">
                  Help Center & FAQs
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright, Legal & Offline Badge */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-500 text-[11px]">
          <p>© {new Date().getFullYear()} KampujaGo Technologies Co., Ltd. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4 font-medium">
            <Link to="/faq" className="hover:text-slate-800 transition">Privacy Policy</Link>
            <Link to="/faq" className="hover:text-slate-800 transition">Terms of Service</Link>
            <Link to="/faq" className="hover:text-slate-800 transition">Cancellation Guarantee</Link>
            <span className="text-slate-300 hidden sm:inline">|</span>
            <span className="text-slate-500 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              PWA Offline Enabled
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
