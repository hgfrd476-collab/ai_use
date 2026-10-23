import React from 'react';
import { Link } from 'react-router-dom';
import { Tag, Sparkles, Bed, Car, ArrowRight, Percent, Calendar } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const OffersPage: React.FC = () => {
  const offers = [
    {
      id: 'angkor-special',
      title: 'Siem Reap Temple Getaway — 15% OFF',
      description: 'Book 3+ nights at boutique villas and resorts in Siem Reap and get an automatic 15% discount applied at checkout.',
      category: 'ACCOMMODATION',
      code: 'ANGKOR15',
      validUntil: 'Valid through 2026',
      badge: 'Bestseller',
      link: '/search?category=accommodation&location=siem-reap',
      bgGradient: 'from-blue-600 to-indigo-700',
    },
    {
      id: 'scooter-week',
      title: 'Kampot & Kep Weekly Scooter Deal',
      description: 'Rent any Honda Click or Yamaha Scoopy for 7 days and only pay for 5. Helmets and emergency roadside assistance included.',
      category: 'TRANSPORTATION',
      code: 'RIDE7FOR5',
      validUntil: 'Seasonal Special',
      badge: 'Top Value',
      link: '/search?category=transportation&location=kampot',
      bgGradient: 'from-emerald-600 to-teal-700',
    },
    {
      id: 'phnom-penh-vip',
      title: 'Phnom Penh Executive Chauffeur & Van',
      description: 'Private airport transfer + 8-hour city executive chauffeur service for groups of up to 10 travelers in luxury VIP vans.',
      category: 'TRANSPORTATION',
      code: 'PPVIP20',
      validUntil: 'Limited Availability',
      badge: 'VIP Service',
      link: '/search?category=transportation&location=phnom-penh',
      bgGradient: 'from-purple-600 to-indigo-800',
    },
  ];

  return (
    <div className="pb-16 w-full">
      {/* Header */}
      <div className="text-center max-w-xl mx-auto mb-10">
        <span className="text-xs font-bold uppercase tracking-wider text-amber-500 flex items-center justify-center gap-1">
          <Tag className="w-3.5 h-3.5" /> Exclusive Partner Discounts
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1">
          Special Travel Deals & Offers
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          Save on verified accommodations and vehicle rentals across Cambodia with direct partner promotions.
        </p>
      </div>

      {/* Offers Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {offers.map((offer) => (
          <div
            key={offer.id}
            className="rounded-3xl bg-white border border-slate-200/80 shadow-xs hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between"
          >
            <div>
              <div className={`p-6 bg-gradient-to-br ${offer.bgGradient} text-white relative`}>
                <span className="inline-flex items-center gap-1 text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white/20 backdrop-blur-xs mb-3">
                  <Sparkles className="w-3 h-3 text-amber-300" /> {offer.badge}
                </span>
                <h3 className="text-lg font-black tracking-tight text-white leading-snug">
                  {offer.title}
                </h3>
              </div>

              <div className="p-5 space-y-3">
                <p className="text-xs text-slate-600 leading-relaxed">
                  {offer.description}
                </p>

                <div className="p-3 bg-slate-50 rounded-2xl border border-slate-150 flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-500">Promo Code:</span>
                  <span className="font-mono font-black text-blue-700 bg-white px-2 py-1 rounded border border-slate-200">
                    {offer.code}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{offer.validUntil}</span>
                </div>
              </div>
            </div>

            <div className="p-5 pt-0">
              <Link
                to={offer.link}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition"
              >
                <span>Browse Eligible Listings</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
