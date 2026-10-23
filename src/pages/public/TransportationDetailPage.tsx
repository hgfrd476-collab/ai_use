import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Heart,
  Share2,
  Users,
  Fuel,
  Gauge,
  ShieldCheck,
  Check,
  Calendar,
  Clock,
  Car,
  ChevronRight,
  Sparkles,
  HelpCircle,
  MessageSquare,
  ExternalLink,
  Globe,
  Navigation,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RatingStars } from '../../components/common/RatingStars';
import { PriceDisplay } from '../../components/common/PriceDisplay';
import { Badge } from '../../components/common/Badge';
import { BookingModal } from '../../components/marketplace/BookingModal';

export const TransportationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { vehicles, businesses, isFavorite, toggleFavorite, addToast, t } = useApp();

  const vehicle = vehicles.find((v) => v.id === id);
  const business = vehicle ? businesses.find((b) => b.id === vehicle.businessId) : null;

  const [bookingOpen, setBookingOpen] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!vehicle || !business) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-slate-800">Vehicle Not Found</h2>
        <p className="text-sm text-slate-500 mt-1">This vehicle listing is no longer available.</p>
        <Link to="/search?category=transportation" className="mt-4 inline-block px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold">
          Browse Transportation
        </Link>
      </div>
    );
  }

  const favorited = isFavorite(vehicle.id);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    addToast('Link Copied', 'Vehicle URL copied to clipboard!', 'success');
  };

  return (
    <div className="pb-16 w-full">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
        <Link to="/" className="hover:text-slate-800">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link to="/search?category=transportation" className="hover:text-slate-800">Transportation</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-900 font-semibold truncate max-w-xs">{vehicle.name}</span>
      </nav>

      {/* Title Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="success">{vehicle.vehicleType}</Badge>
            <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
              ✓ Ready for Dispatch
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {vehicle.name}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1.5">
            <span className="flex items-center gap-1 font-medium text-slate-700">
              <MapPin className="w-3.5 h-3.5 text-emerald-600" /> Provided by {business.name} ({business.city})
            </span>
            {(vehicle.locationUrl || vehicle.mapUrl || business.locationUrl || business.mapUrl) && (
              <a
                href={
                  (vehicle.locationUrl || vehicle.mapUrl || business.locationUrl || business.mapUrl)!.startsWith('http')
                    ? (vehicle.locationUrl || vehicle.mapUrl || business.locationUrl || business.mapUrl)!
                    : `https://${vehicle.locationUrl || vehicle.mapUrl || business.locationUrl || business.mapUrl}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-[11px] transition"
              >
                <Navigation className="w-3 h-3 text-emerald-600" />
                <span>Open in Maps</span>
                <ExternalLink className="w-2.5 h-2.5" />
              </a>
            )}
            <span>•</span>
            <RatingStars rating={business.rating} reviewCount={business.reviewCount} />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition cursor-pointer"
          >
            <Share2 className="w-4 h-4 text-slate-500" />
            <span>Share</span>
          </button>
          <button
            onClick={() => toggleFavorite(vehicle.id)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold transition cursor-pointer ${
              favorited
                ? 'border-rose-200 bg-rose-50 text-rose-600'
                : 'border-slate-200 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <Heart className={`w-4 h-4 ${favorited ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>{favorited ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>

      {/* High-res Image Display */}
      <div className="rounded-3xl overflow-hidden aspect-16/9 md:aspect-21/9 bg-slate-100 mb-8 border border-slate-200/80 shadow-xs">
        <img
          src={vehicle.images[activeImageIndex] || vehicle.images[0]}
          alt={vehicle.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Specs & Terms */}
        <div className="lg:col-span-2 space-y-8">
          {/* Key Specifications Grid */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Vehicle Technical Specifications</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-150 text-center">
                <Users className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Seating</span>
                <span className="text-xs font-bold text-slate-800">{vehicle.seats} Passengers</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-150 text-center">
                <Gauge className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Transmission</span>
                <span className="text-xs font-bold text-slate-800">{vehicle.transmission}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-150 text-center">
                <Fuel className="w-4 h-4 text-amber-600 mx-auto mb-1" />
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Fuel Type</span>
                <span className="text-xs font-bold text-slate-800">{vehicle.fuelType}</span>
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-150 text-center">
                <ShieldCheck className="w-4 h-4 text-purple-600 mx-auto mb-1" />
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Helmets</span>
                <span className="text-xs font-bold text-emerald-700">
                  {vehicle.helmetIncluded ? '2 Included Free' : 'Available'}
                </span>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">Description & Condition</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                {vehicle.description}
              </p>
            </div>
          </div>

          {/* Pickup & Delivery Points */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Pickup & Delivery Points</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Select your preferred handoff spot during booking checkout:
                </p>
              </div>
              <a
                href={
                  (vehicle.locationUrl || vehicle.mapUrl || business.locationUrl || business.mapUrl)
                    ? ((vehicle.locationUrl || vehicle.mapUrl || business.locationUrl || business.mapUrl)!.startsWith('http')
                        ? (vehicle.locationUrl || vehicle.mapUrl || business.locationUrl || business.mapUrl)!
                        : `https://${vehicle.locationUrl || vehicle.mapUrl || business.locationUrl || business.mapUrl}`)
                    : `https://maps.google.com/?q=${encodeURIComponent(`${business.name}, ${business.city}, Cambodia`)}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs transition self-start sm:self-auto cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Shop Location (Google Maps)</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="space-y-2">
              {vehicle.pickupLocations.map((loc, idx) => (
                <div key={idx} className="flex items-center gap-2.5 p-3 rounded-xl bg-slate-50 text-xs font-semibold text-slate-800 border border-slate-150">
                  <MapPin className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{loc}</span>
                </div>
              ))}
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-center justify-between text-xs text-emerald-900">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                <span>Dispatch Headquarters: <strong>{business.address}, {business.city}</strong></span>
              </span>
              <a
                href={
                  (vehicle.locationUrl || vehicle.mapUrl || business.locationUrl || business.mapUrl)
                    ? ((vehicle.locationUrl || vehicle.mapUrl || business.locationUrl || business.mapUrl)!.startsWith('http')
                        ? (vehicle.locationUrl || vehicle.mapUrl || business.locationUrl || business.mapUrl)!
                        : `https://${vehicle.locationUrl || vehicle.mapUrl || business.locationUrl || business.mapUrl}`)
                    : `https://maps.google.com/?q=${encodeURIComponent(`${business.name}, ${business.city}, Cambodia`)}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-700 hover:text-emerald-800 font-bold inline-flex items-center gap-1 underline shrink-0 cursor-pointer ml-2"
              >
                <span>Open Pin</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>

          {/* Rental Requirements & Documents */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Rental Requirements & Policies</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-1">
                <h4 className="font-bold text-slate-900">Driver License & Passport</h4>
                <p className="text-slate-600 leading-relaxed">
                  Valid original passport or national ID plus valid driver license. International driver permits are accepted throughout Cambodia.
                </p>
              </div>
              <div className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50/50 space-y-1">
                <h4 className="font-bold text-slate-900">Refundable Security Deposit</h4>
                <p className="text-slate-600 leading-relaxed">
                  A standard ${vehicle.depositUSD} cash/card deposit is held and immediately returned upon vehicle check-in in original condition.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sticky Column: Rate & Booking Action */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xl sticky top-28 space-y-5">
            <div>
              <span className="text-xs text-slate-400 font-medium block">Daily rental rate</span>
              <PriceDisplay
                amountUSD={vehicle.pricePerDay}
                period="day"
                size="lg"
              />
            </div>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span>Free Cancellation</span>
                <span className="font-bold text-emerald-600">Up to 24h prior</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span>Clean & Sanitized</span>
                <span className="font-bold text-slate-900">Guaranteed</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span>Helmets / Lock</span>
                <span className="font-bold text-slate-900">Included</span>
              </div>
            </div>

            <button
              onClick={() => setBookingOpen(true)}
              id={`btn-book-page-${vehicle.id}`}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition cursor-pointer"
            >
              Book This Vehicle
            </button>

            {/* Business Card */}
            <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-800 flex items-center justify-center font-black text-sm">
                {business.name.charAt(0)}
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-slate-900 truncate">{business.name}</h4>
                <p className="text-[11px] text-slate-500">Verified Rental Operator</p>
              </div>
              <button
                onClick={() => navigate('/customer/messages')}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition"
                title="Message Business"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Unified 5-step Booking Modal */}
      {bookingOpen && (
        <BookingModal
          isOpen={bookingOpen}
          onClose={() => setBookingOpen(false)}
          business={business}
          vehicle={vehicle}
        />
      )}
    </div>
  );
};
