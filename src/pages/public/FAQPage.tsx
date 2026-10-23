import React, { useState } from 'react';
import { HelpCircle, ChevronDown, ChevronUp, ShieldCheck, CreditCard, Car, Bed, WifiOff } from 'lucide-react';

export const FAQPage: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How do payments work on KampujaGo?',
      a: 'KampujaGo supports both local Cambodian payment methods (ABA PAY, Bakong KHQR, Wing) and international credit/debit cards (Visa, Mastercard). You can also choose Cash on Arrival at select properties. When you pay online, your booking is confirmed instantly, and your payment is held securely in escrow until check-in.',
      category: 'PAYMENTS',
    },
    {
      q: 'What is the cancellation and refund policy?',
      a: 'Every property and rental has clear cancellation terms displayed on its listing. Most accommodations offer "Flexible" cancellation, giving you a full 100% refund if cancelled at least 24 hours before your scheduled arrival time. Refunds are processed back to your original payment method or KHQR account within 1-2 business days.',
      category: 'BOOKINGS',
    },
    {
      q: 'Do I need a Cambodian driver license to rent a motorbike or car?',
      a: 'For scooters and motorbikes under 125cc, visitors are permitted to drive with a valid international driving permit (IDP) or home country license. For larger cars, SUVs, and vans, an IDP is recommended. Always carry your passport or digital copy and wear helmets at all times.',
      category: 'TRANSPORTATION',
    },
    {
      q: 'How does KampujaGo work offline (PWA)?',
      a: 'KampujaGo is built as a Progressive Web App (PWA). You can install it directly to your home screen from your browser. Once loaded, all your confirmed bookings, vouchers, host phone numbers, and cached listings remain accessible even when you lose cellular data while exploring temples or rural roads.',
      category: 'APP_FEATURES',
    },
    {
      q: 'How do local business owners get paid?',
      a: 'Business hosts receive automated weekly payouts via direct ABA Bank or Bakong KHQR transfer with detailed transaction breakdowns and transparent platform fees. Hosts can track revenue, occupancy, and upcoming payouts in the Owner Portal.',
      category: 'BUSINESS',
    },
    {
      q: 'Are the local businesses verified?',
      a: 'Yes! Every accommodation and transport fleet on KampujaGo undergoes our verification process, including business registration review, license checks, vehicle safety inspection standards, and authentic guest review moderation.',
      category: 'TRUST',
    },
  ];

  return (
    <div className="pb-16 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 uppercase tracking-wider mb-1">
          <HelpCircle className="w-4 h-4" /> Got Questions?
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
          Frequently Asked Questions
        </h1>
        <p className="text-sm text-slate-500 mt-2">
          Everything you need to know about booking stays, renting vehicles, and traveling across Cambodia.
        </p>
      </div>

      {/* FAQ Accordions */}
      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl bg-white border border-slate-200/80 shadow-xs overflow-hidden transition"
            >
              <button
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition cursor-pointer"
              >
                <h3 className="text-sm sm:text-base font-bold text-slate-900">{faq.q}</h3>
                <div className="p-1 rounded-full bg-slate-100 text-slate-500 shrink-0">
                  {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {isOpen && (
                <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
