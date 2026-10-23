import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  ShieldCheck,
  CreditCard,
  QrCode,
  FileDown,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  Lock,
  Building2,
  Car,
  Bed,
} from 'lucide-react';
import { Business, Room, Vehicle, Booking, PaymentMethod } from '../../types';
import { useApp } from '../../context/AppContext';
import { formatPrice } from '../../utils/currency';
import { getDaysDiff, formatDate } from '../../utils/dates';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  business: Business;
  room?: Room;
  vehicle?: Vehicle;
  initialStartDate?: string;
  initialEndDate?: string;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  business,
  room,
  vehicle,
  initialStartDate = new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
  initialEndDate = new Date(Date.now() + 86400000 * 4).toISOString().split('T')[0],
}) => {
  const { currentUser, createBooking, currency, addToast } = useApp();
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2 | 3 | 4 | 5>(1);

  // Step 1: Selection
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(initialEndDate);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('18:00');
  const [quantity, setQuantity] = useState(1);
  const [adults, setAdults] = useState(2);
  const [childrenCount, setChildrenCount] = useState(0);
  const [pickupLocation, setPickupLocation] = useState(
    vehicle?.pickupLocations[0] || 'Store / Hotel Meet & Greet'
  );

  // Step 2: Customer details
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [phone, setPhone] = useState(currentUser.phone);
  const [specialRequests, setSpecialRequests] = useState('');

  // Step 4: Payment selection & processing state
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('ABA_PAY');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  if (!isOpen) return null;

  const isAccommodation = business.category === 'ACCOMMODATION';
  const units = Math.max(1, getDaysDiff(startDate, endDate));
  const unitLabel = isAccommodation ? 'night' : 'day';

  const baseRate = isAccommodation
    ? room?.basePrice || 60
    : vehicle?.pricePerDay || 15;

  const discountRate = isAccommodation && room?.discountPercent ? room.discountPercent : 0;
  const rawSubtotal = baseRate * units * quantity;
  const discountAmount = Math.round((rawSubtotal * discountRate) / 100);
  const subtotal = rawSubtotal - discountAmount;
  const taxes = Math.round(subtotal * 0.1 * 100) / 100; // 10% VAT
  const platformFee = Math.round(subtotal * 0.03 * 100) / 100; // 3% platform guarantee
  const total = Math.round((subtotal + taxes + platformFee) * 100) / 100;

  const handleProcessPayment = () => {
    setIsProcessingPayment(true);
    setTimeout(() => {
      setIsProcessingPayment(false);

      const newBk = createBooking({
        customerId: currentUser.id,
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        businessId: business.id,
        businessName: business.name,
        businessCategory: business.category,
        businessLocation: `${business.city}, Cambodia`,
        serviceId: isAccommodation ? room?.id || 'room-default' : vehicle?.id || 'veh-default',
        serviceName: isAccommodation ? room?.name || 'Standard Villa' : vehicle?.name || 'Standard Vehicle',
        serviceImage: isAccommodation ? room?.images[0] || business.images[0] : vehicle?.images[0] || business.images[0],
        serviceType: isAccommodation ? room?.roomType || 'Deluxe' : vehicle?.vehicleType || 'Scooter',
        startDate,
        endDate,
        startTime: !isAccommodation ? startTime : undefined,
        endTime: !isAccommodation ? endTime : undefined,
        quantity,
        guests: isAccommodation ? { adults, children: childrenCount } : undefined,
        pickupLocation: !isAccommodation ? pickupLocation : undefined,
        pricing: {
          basePrice: baseRate,
          units,
          unitType: isAccommodation ? 'NIGHT' : 'DAY',
          subtotal,
          discount: discountAmount,
          taxes,
          platformFee,
          extraFees: [],
          total,
          currency,
        },
        bookingStatus: 'CONFIRMED',
        paymentStatus: 'PAID',
        paymentMethod,
        specialRequests,
      });

      setConfirmedBooking(newBk);
      setStep(5);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-3 sm:p-4 overflow-y-auto animate-in fade-in duration-150">
      <div className="w-full max-w-xl my-auto rounded-3xl bg-white shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 shrink-0 bg-slate-50/70">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-blue-600 text-white text-[10px] font-bold">
                {step}
              </span>
              <h3 className="text-base font-bold text-slate-900">
                {step === 1 && 'Step 1: Select Dates & Details'}
                {step === 2 && 'Step 2: Customer Contact Info'}
                {step === 3 && 'Step 3: Review Price & Policy'}
                {step === 4 && 'Step 4: Secure Checkout'}
                {step === 5 && 'Booking Confirmed!'}
              </h3>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              {business.name} • {isAccommodation ? room?.name : vehicle?.name}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {/* STEP 1: Select Details */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isAccommodation ? 'Check-in Date' : 'Pickup Date'}
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isAccommodation ? 'Check-out Date' : 'Return Date'}
                  </label>
                  <input
                    type="date"
                    value={endDate}
                    min={startDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-600"
                  />
                </div>
              </div>

              {!isAccommodation && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Pickup Time</label>
                    <input
                      type="time"
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold text-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Return Time</label>
                    <input
                      type="time"
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold text-slate-800"
                    />
                  </div>
                </div>
              )}

              {isAccommodation ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Adults</label>
                    <select
                      value={adults}
                      onChange={(e) => setAdults(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold text-slate-800"
                    >
                      {[1, 2, 3, 4, 5, 6].map((n) => (
                        <option key={n} value={n}>{n} Adults</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Children</label>
                    <select
                      value={childrenCount}
                      onChange={(e) => setChildrenCount(Number(e.target.value))}
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold text-slate-800"
                    >
                      {[0, 1, 2, 3].map((n) => (
                        <option key={n} value={n}>{n} Children</option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Pickup / Delivery Point</label>
                  <select
                    value={pickupLocation}
                    onChange={(e) => setPickupLocation(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold text-slate-800"
                  >
                    {vehicle?.pickupLocations.map((loc, idx) => (
                      <option key={idx} value={loc}>{loc}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-blue-900">
                  {units} {unitLabel}{units > 1 ? 's' : ''} × {formatPrice(baseRate, currency)}
                </span>
                <span className="font-bold text-blue-950">{formatPrice(rawSubtotal, currency)}</span>
              </div>
            </div>
          )}

          {/* STEP 2: Customer Details */}
          {step === 2 && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Full Name (as on ID / Passport)</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold text-slate-800"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone / Telegram Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-semibold text-slate-800"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Special Requests (Optional)</label>
                <textarea
                  rows={3}
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  placeholder="e.g., Quiet room, early check-in, dietary restrictions, helmet size..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-xs font-medium text-slate-800"
                />
              </div>
            </div>
          )}

          {/* STEP 3: Review & Price Breakdown */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-150">
                <img
                  src={isAccommodation ? room?.images[0] || business.images[0] : vehicle?.images[0] || business.images[0]}
                  alt="Service"
                  className="w-20 h-20 rounded-xl object-cover shrink-0"
                />
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 truncate">
                    {isAccommodation ? room?.name : vehicle?.name}
                  </h4>
                  <p className="text-xs text-slate-500">{business.name}</p>
                  <p className="text-xs text-slate-600 mt-1 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    {formatDate(startDate)} — {formatDate(endDate)} ({units} {unitLabel}s)
                  </p>
                </div>
              </div>

              {/* Price Breakdown Snapshot Table */}
              <div className="rounded-2xl border border-slate-200 p-4 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Base Rate ({units} {unitLabel}s × {formatPrice(baseRate, currency)})</span>
                  <span className="font-semibold text-slate-900">{formatPrice(rawSubtotal, currency)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-600">
                    <span>Special Discount ({discountRate}%)</span>
                    <span>-{formatPrice(discountAmount, currency)}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>Taxes & Service Charge (10%)</span>
                  <span>{formatPrice(taxes, currency)}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>KampujaGo Booking Protection Fee</span>
                  <span>{formatPrice(platformFee, currency)}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-slate-900">
                  <span>Total Amount Due</span>
                  <span className="text-blue-600 text-base">{formatPrice(total, currency)}</span>
                </div>
              </div>

              {/* Cancellation Policy Banner */}
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-100 text-xs text-emerald-900 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold">Cancellation Policy: {business.policies.cancellationPolicy}</p>
                  <p className="text-[11px] text-emerald-800 mt-0.5 leading-relaxed">
                    Full refund if cancelled up to 24 hours prior to check-in. Booking pricing snapshot is permanently locked upon confirmation.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Payment */}
          {step === 4 && (
            <div className="space-y-4">
              <div className="text-center pb-2">
                <span className="text-xs font-semibold text-slate-500">Payable Amount</span>
                <p className="text-2xl font-black text-blue-600">{formatPrice(total, currency)}</p>
              </div>

              <div className="space-y-2">
                {/* ABA PAY */}
                <label
                  onClick={() => setPaymentMethod('ABA_PAY')}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                    paymentMethod === 'ABA_PAY'
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-600'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#004777] text-white flex items-center justify-center font-bold text-xs">
                      ABA
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900">ABA PAY / KHQR</h5>
                      <p className="text-[11px] text-slate-500">Instant scan with any Cambodian bank app</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'ABA_PAY'}
                    onChange={() => {}}
                    className="text-blue-600"
                  />
                </label>

                {/* BAKONG */}
                <label
                  onClick={() => setPaymentMethod('BAKONG')}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                    paymentMethod === 'BAKONG'
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-600'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-[#DE1D26] text-white flex items-center justify-center font-bold text-xs">
                      Bakong
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900">Bakong KHQR</h5>
                      <p className="text-[11px] text-slate-500">National Bank of Cambodia QR payment</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'BAKONG'}
                    onChange={() => {}}
                    className="text-blue-600"
                  />
                </label>

                {/* Credit Card */}
                <label
                  onClick={() => setPaymentMethod('CARD')}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                    paymentMethod === 'CARD'
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-600'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-800 text-white flex items-center justify-center">
                      <CreditCard className="w-5 h-5" />
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900">Credit / Debit Card</h5>
                      <p className="text-[11px] text-slate-500">Visa, Mastercard, JCB</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'CARD'}
                    onChange={() => {}}
                    className="text-blue-600"
                  />
                </label>

                {/* Cash on Arrival */}
                <label
                  onClick={() => setPaymentMethod('CASH_ON_ARRIVAL')}
                  className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                    paymentMethod === 'CASH_ON_ARRIVAL'
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-600'
                      : 'border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                      Cash
                    </div>
                    <div>
                      <h5 className="text-xs font-bold text-slate-900">Pay at Property / On Arrival</h5>
                      <p className="text-[11px] text-slate-500">Pay directly to business host during check-in</p>
                    </div>
                  </div>
                  <input
                    type="radio"
                    name="paymentMethod"
                    checked={paymentMethod === 'CASH_ON_ARRIVAL'}
                    onChange={() => {}}
                    className="text-blue-600"
                  />
                </label>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 pt-2">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>256-Bit SSL Encrypted & Locked During Payment</span>
              </div>
            </div>
          )}

          {/* STEP 5: Confirmation */}
          {step === 5 && confirmedBooking && (
            <div className="text-center space-y-4 py-2">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner animate-in zoom-in-50 duration-300">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <h4 className="text-xl font-black text-slate-900">Booking Confirmed!</h4>
                <p className="text-xs text-slate-500 mt-1">
                  A confirmation voucher has been sent to <strong>{confirmedBooking.customerEmail}</strong>
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2 text-xs">
                <div className="flex justify-between pb-2 border-b border-slate-200">
                  <span className="text-slate-500">Booking Reference</span>
                  <span className="font-mono font-black text-blue-700 text-sm">
                    {confirmedBooking.bookingReference}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Service</span>
                  <span className="font-bold text-slate-900">{confirmedBooking.serviceName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Host / Business</span>
                  <span className="font-medium text-slate-800">{confirmedBooking.businessName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Dates</span>
                  <span className="font-medium text-slate-800">
                    {formatDate(confirmedBooking.startDate)} — {formatDate(confirmedBooking.endDate)}
                  </span>
                </div>
                <div className="flex justify-between pt-2 border-t border-slate-200 font-bold text-slate-900">
                  <span>Total Paid</span>
                  <span className="text-emerald-700 text-sm">
                    {formatPrice(confirmedBooking.pricing.total, confirmedBooking.pricing.currency)}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => {
                    onClose();
                    navigate(`/customer/bookings/${confirmedBooking.id}`);
                  }}
                  className="w-full py-2.5 px-3 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition"
                >
                  View Booking
                </button>
                <button
                  onClick={() => {
                    addToast('Receipt Generated', 'Downloading PDF receipt voucher...', 'success');
                  }}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-slate-200 text-slate-700 font-bold text-xs hover:bg-slate-50 transition"
                >
                  <FileDown className="w-4 h-4 text-slate-500" />
                  <span>Download Receipt</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        {step < 5 && (
          <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
            {step > 1 ? (
              <button
                onClick={() => setStep((prev) => (prev - 1) as any)}
                className="inline-flex items-center gap-1 text-xs font-bold text-slate-600 hover:text-slate-900 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back
              </button>
            ) : (
              <div />
            )}

            {step < 4 ? (
              <button
                onClick={() => setStep((prev) => (prev + 1) as any)}
                className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-xs transition cursor-pointer"
              >
                <span>Continue</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleProcessPayment}
                disabled={isProcessingPayment}
                className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs px-6 py-2.5 rounded-xl shadow-md transition cursor-pointer disabled:opacity-70"
              >
                {isProcessingPayment ? (
                  <span>Securing Booking...</span>
                ) : (
                  <>
                    <span>Pay {formatPrice(total, currency)} & Confirm</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
