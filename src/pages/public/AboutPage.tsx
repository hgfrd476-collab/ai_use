import React from 'react';
import { ShieldCheck, Heart, Sparkles, Building2, MapPin, Users, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export const AboutPage: React.FC = () => {
  return (
    <div className="pb-16 max-w-4xl mx-auto space-y-12">
      {/* Hero */}
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
          Our Story & Mission
        </span>
        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
          Empowering Local Cambodian Tourism
        </h1>
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed max-w-2xl mx-auto">
          KampujaGo was founded with a single mission: to provide a modern, unified booking platform where international and local travelers can directly discover, reserve, and support genuine Cambodian boutique hotels, homestays, and family-owned transportation fleets.
        </p>
      </div>

      {/* 3 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Direct Local Impact</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            By eliminating aggressive foreign OTA commissions, more revenue stays directly in the hands of Cambodian hospitality families and staff.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Verified Quality & Safety</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Every room, villa, motorbike, and chauffeur is verified for safety, cleanliness, and fair transparent pricing.
          </p>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Modern Digital Tech</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Instant KHQR payments, real-time availability sync, and offline PWA support tailored specifically for traveling in Southeast Asia.
          </p>
        </div>
      </div>

      {/* Call to action */}
      <div className="p-8 rounded-3xl bg-slate-900 text-white text-center space-y-4">
        <h3 className="text-2xl font-black">Ready to Explore Cambodia?</h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
          Start your adventure with verified local stays and reliable transport across Siem Reap, Phnom Penh, Kampot, and beyond.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-2">
          <Link
            to="/search?category=accommodation"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs"
          >
            Find Stays
          </Link>
          <Link
            to="/search?category=transportation"
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs"
          >
            Rent Transportation
          </Link>
        </div>
      </div>
    </div>
  );
};
