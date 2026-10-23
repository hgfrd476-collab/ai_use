import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Heart,
  Share2,
  Bed,
  Users,
  Check,
  ShieldCheck,
  Sparkles,
  Calendar,
  Clock,
  MessageSquare,
  ChevronRight,
  Wifi,
  Coffee,
  Waves,
  Maximize2,
  AlertCircle,
  Star,
  ExternalLink,
  Globe,
  Navigation,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { RatingStars } from '../../components/common/RatingStars';
import { PriceDisplay } from '../../components/common/PriceDisplay';
import { Badge } from '../../components/common/Badge';
import { BookingModal } from '../../components/marketplace/BookingModal';
import { Room } from '../../types';

export const AccommodationDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { businesses, rooms, reviews, isFavorite, toggleFavorite, addToast, t } = useApp();

  const business = businesses.find((b) => b.id === id);
  const propertyRooms = rooms.filter((r) => r.businessId === id);
  const propertyReviews = reviews.filter((r) => r.businessId === id);

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!business) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-slate-800">Property Not Found</h2>
        <p className="text-sm text-slate-500 mt-1">This accommodation listing does not exist or has been removed.</p>
        <Link to="/search" className="mt-4 inline-block px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold">
          Back to Listings
        </Link>
      </div>
    );
  }

  const favorited = isFavorite(business.id);

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    addToast('Link Copied', 'Property URL copied to clipboard!', 'success');
  };

  return (
    <div className="pb-16 w-full">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 mb-4">
        <Link to="/" className="hover:text-slate-800">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <Link to="/search?category=accommodation" className="hover:text-slate-800">Accommodations</Link>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-slate-900 font-semibold truncate max-w-xs">{business.name}</span>
      </nav>

      {/* Header Info */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="primary">{business.type}</Badge>
            <span className="text-xs text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-bold">
              ✓ Verified Local Partner
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {business.name}
          </h1>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1.5">
            <span className="flex items-center gap-1 font-medium text-slate-700">
              <MapPin className="w-3.5 h-3.5 text-blue-600" /> {business.address}, {business.city}, {business.province}
            </span>
            {(business.locationUrl || business.mapUrl) && (
              <a
                href={(business.locationUrl || business.mapUrl)!.startsWith('http') ? (business.locationUrl || business.mapUrl)! : `https://${business.locationUrl || business.mapUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[11px] transition"
              >
                <Navigation className="w-3 h-3 text-blue-600" />
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
            onClick={() => toggleFavorite(business.id)}
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

      {/* High-res Image Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-8 rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs">
        <div className="md:col-span-2 aspect-16/10 relative overflow-hidden bg-slate-100">
          <img
            src={business.images[activeImageIndex] || business.coverImage}
            alt={business.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
          {business.images.slice(0, 2).map((img, idx) => (
            <div
              key={idx}
              onClick={() => setActiveImageIndex(idx)}
              className={`aspect-16/10 overflow-hidden cursor-pointer relative ${
                activeImageIndex === idx ? 'ring-2 ring-blue-600' : 'opacity-80 hover:opacity-100'
              }`}
            >
              <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
            </div>
          ))}
        </div>
      </div>

      {/* Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Details & Available Rooms */}
        <div className="lg:col-span-2 space-y-8">
          {/* Overview */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 mb-3">About This Property</h2>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {business.description}
            </p>

            {/* Quick Feature Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-slate-100">
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-150 text-center">
                <Clock className="w-4 h-4 text-blue-600 mx-auto mb-1" />
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Check-In</span>
                <span className="text-xs font-bold text-slate-800">{business.policies.checkInTime}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-150 text-center">
                <Clock className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Check-Out</span>
                <span className="text-xs font-bold text-slate-800">{business.policies.checkOutTime}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-150 text-center">
                <ShieldCheck className="w-4 h-4 text-amber-600 mx-auto mb-1" />
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Cancellation</span>
                <span className="text-xs font-bold text-slate-800">{business.policies.cancellationPolicy}</span>
              </div>
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-150 text-center">
                <Sparkles className="w-4 h-4 text-purple-600 mx-auto mb-1" />
                <span className="text-[10px] text-slate-400 block font-bold uppercase">Instant Confirmation</span>
                <span className="text-xs font-bold text-emerald-700">Guaranteed</span>
              </div>
            </div>
          </div>

          {/* Available Rooms Section */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Available Rooms & Suites</h2>
                <p className="text-xs text-slate-500">Instant reservation with price lock guarantee</p>
              </div>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-lg">
                {propertyRooms.length} room type{propertyRooms.length > 1 ? 's' : ''}
              </span>
            </div>

            <div className="space-y-4">
              {propertyRooms.map((room) => (
                <div
                  key={room.id}
                  className="rounded-2xl border border-slate-200/90 hover:border-blue-300 p-4 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div className="flex gap-4">
                    <img
                      src={room.images[0]}
                      alt={room.name}
                      className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                        {room.roomType}
                      </span>
                      <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-1">
                        {room.name}
                      </h3>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Bed className="w-3.5 h-3.5 text-slate-400" /> {room.bedType}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-slate-400" /> Max {room.maxGuests} guests
                        </span>
                        <span className="flex items-center gap-1">
                          <Maximize2 className="w-3.5 h-3.5 text-slate-400" /> {room.sizeSqM} m²
                        </span>
                      </div>
                      <div className="mt-2 flex flex-wrap gap-1">
                        {room.amenities.slice(0, 3).map((a, idx) => (
                          <span key={idx} className="text-[10px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                            {a}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                    <PriceDisplay
                      amountUSD={room.basePrice}
                      period="night"
                      size="md"
                    />
                    <button
                      onClick={() => setSelectedRoom(room)}
                      id={`btn-reserve-room-${room.id}`}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer"
                    >
                      Reserve Room
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Property Amenities */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Property Facilities & Amenities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-slate-700">
              {business.amenities.map((amenity, idx) => (
                <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span className="font-semibold">{amenity}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Location & Map Direction Section */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Location & Surroundings</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Conveniently situated in {business.city}, {business.province}
                </p>
              </div>
              <a
                href={
                  (business.locationUrl || business.mapUrl)
                    ? ((business.locationUrl || business.mapUrl)!.startsWith('http')
                        ? (business.locationUrl || business.mapUrl)!
                        : `https://${business.locationUrl || business.mapUrl}`)
                    : `https://maps.google.com/?q=${encodeURIComponent(`${business.name}, ${business.address}, ${business.city}, Cambodia`)}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition self-start sm:self-auto cursor-pointer"
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>Get Directions (Google Maps)</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
                  <MapPin className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{business.address}</span>
                </div>
                <p className="text-xs text-slate-500 pl-6">
                  {business.city}, {business.province}, Cambodia
                </p>
                {business.openingHours && (
                  <p className="text-[11px] text-slate-400 pl-6">
                    Reception Hours: {business.openingHours}
                  </p>
                )}
              </div>

              {(business.locationUrl || business.mapUrl) && (
                <div className="shrink-0 flex items-center gap-2">
                  <a
                    href={(business.locationUrl || business.mapUrl)!.startsWith('http') ? (business.locationUrl || business.mapUrl)! : `https://${business.locationUrl || business.mapUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition"
                  >
                    <Globe className="w-3.5 h-3.5 text-blue-600" />
                    <span>View Map Pin</span>
                  </a>
                </div>
              )}
            </div>
          </div>

          {/* Guest Reviews Breakdown */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-slate-900">Guest Reviews</h2>
              <RatingStars rating={business.rating} reviewCount={business.reviewCount} size="md" />
            </div>

            <div className="space-y-4">
              {propertyReviews.length === 0 ? (
                <p className="text-xs text-slate-400">No written reviews yet. Be the first to leave one after your stay!</p>
              ) : (
                propertyReviews.map((rev) => (
                  <div key={rev.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-150 space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900">{rev.customerName}</span>
                      <RatingStars rating={rev.rating} />
                    </div>
                    <h4 className="text-xs font-bold text-slate-800">{rev.title}</h4>
                    <p className="text-xs text-slate-600 leading-relaxed">{rev.content}</p>
                    <span className="text-[10px] text-slate-400 block pt-1">
                      Stayed on {new Date(rev.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Sticky Column: Host Bio & Quick Reserve Card */}
        <div className="space-y-6">
          {/* Quick Reserve Sticky Card */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xl sticky top-28 space-y-5">
            <div>
              <span className="text-xs text-slate-400 font-medium block">Starting rate</span>
              <PriceDisplay
                amountUSD={propertyRooms[0]?.basePrice || 65}
                period="night"
                size="lg"
              />
            </div>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span>Free High-Speed Wi-Fi</span>
                <span className="font-bold text-slate-900">Included</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span>Breakfast Options</span>
                <span className="font-bold text-slate-900">Available</span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span>Cancellation</span>
                <span className="font-bold text-emerald-600">Flexible</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedRoom(propertyRooms[0] || null)}
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/20 transition cursor-pointer"
            >
              Select Room & Reserve
            </button>

            {/* Host Contact Box */}
            <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-sm">
                V
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-bold text-slate-900 truncate">Vannak Sok</h4>
                <p className="text-[11px] text-slate-500">Verified Local Host • 100% response rate</p>
              </div>
              <button
                onClick={() => {
                  navigate('/customer/messages');
                }}
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition"
                title="Message Host"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Unified 5-step Booking Modal */}
      {selectedRoom && (
        <BookingModal
          isOpen={!!selectedRoom}
          onClose={() => setSelectedRoom(null)}
          business={business}
          room={selectedRoom}
        />
      )}
    </div>
  );
};
