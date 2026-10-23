export type UserRole = 'CUSTOMER' | 'BUSINESS_OWNER' | 'SUPER_ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar: string;
  status: 'ACTIVE' | 'SUSPENDED' | 'PENDING' | 'DELETED';
  createdAt: string;
  bio?: string;
  address?: string;
}

export type BusinessCategory = 'ACCOMMODATION' | 'TRANSPORTATION' | 'TOURS' | 'ACTIVITIES';

export type AccommodationType =
  | 'HOTEL'
  | 'RESORT'
  | 'VILLA'
  | 'APARTMENT'
  | 'HOSTEL'
  | 'GUESTHOUSE'
  | 'HOMESTAY'
  | 'LODGE'
  | 'OTHER';

export type TransportationType =
  | 'MOTORBIKE'
  | 'SCOOTER'
  | 'BICYCLE'
  | 'CAR'
  | 'SUV'
  | 'VAN'
  | 'TAXI'
  | 'TUK_TUK'
  | 'BUS'
  | 'BOAT'
  | 'OTHER';

export type BusinessType = AccommodationType | TransportationType;

export type RoomType = string;
export type VehicleType = TransportationType | string;

export type BusinessStatus =
  | 'DRAFT'
  | 'PENDING'
  | 'APPROVED'
  | 'REJECTED'
  | 'SUSPENDED'
  | 'ARCHIVED';

export interface BusinessPolicy {
  cancellationPolicy: 'FLEXIBLE' | 'MODERATE' | 'STRICT';
  checkInTime?: string;
  checkOutTime?: string;
  rules?: string[];
  depositRequired?: boolean;
  depositAmount?: number;
}

export interface BankAccountInfo {
  bankName: string;
  accountNumber: string;
  accountName?: string;
}

export interface VerificationDocs {
  registrationNumber?: string;
  taxNumber?: string;
  licenseDoc?: string;
}

export interface Business {
  id: string;
  ownerId: string;
  name: string;
  khmerName?: string;
  description: string;
  category: BusinessCategory;
  type: BusinessType;
  businessType?: string;
  phone: string;
  email: string;
  website?: string;
  telegram?: string;
  address: string;
  city: string;
  province: string;
  country: string;
  latitude: number;
  longitude: number;
  mapUrl?: string;
  locationUrl?: string;
  openingHours: string;
  contactPerson: string;
  images: string[];
  logo: string;
  coverImage: string;
  policies: BusinessPolicy;
  status: BusinessStatus;
  rejectionReason?: string;
  rating: number;
  reviewCount: number;
  featured?: boolean;
  createdAt: string;
  amenities: string[];
  bankAccount?: BankAccountInfo;
  verificationDocs?: VerificationDocs;
}

export interface Room {
  id: string;
  businessId: string;
  name: string;
  roomType: string;
  description: string;
  capacity: {
    adults: number;
    children: number;
    total: number;
  };
  beds: string;
  bathrooms: number;
  sizeSqMeters: number;
  amenities: string[];
  images: string[];
  basePrice: number;
  weekendPrice?: number;
  discountPercent?: number;
  totalInventory: number;
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
  cancellationPolicy: 'FLEXIBLE' | 'MODERATE' | 'STRICT';
  // Aliases for UI flexibility
  maxGuests?: number;
  bedType?: string;
  sizeSqm?: number;
  sizeSqM?: number;
  availableUnits?: number;
  totalUnits?: number;
}

export interface Vehicle {
  id: string;
  businessId: string;
  name: string;
  vehicleType: TransportationType;
  brand: string;
  model: string;
  year: number;
  color: string;
  transmission: 'AUTOMATIC' | 'MANUAL';
  fuelType: 'PETROL' | 'DIESEL' | 'ELECTRIC' | 'HYBRID';
  seats: number;
  engine: string;
  plateNumber?: string;
  description: string;
  features: string[];
  images: string[];
  pricePerHour: number;
  pricePerDay: number;
  pricePerWeek?: number;
  deposit: number;
  depositUSD?: number;
  helmetIncluded: boolean;
  insuranceIncluded: boolean;
  pickupLocations: string[];
  locationUrl?: string;
  mapUrl?: string;
  deliveryAvailable: boolean;
  deliveryFee: number;
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
  cancellationPolicy: 'FLEXIBLE' | 'MODERATE' | 'STRICT';
  // Aliases for UI flexibility
  availableVehicles?: number;
  totalVehicles?: number;
}

export interface ExtraFee {
  id: string;
  label: string;
  amount: number;
}

export interface PricingSnapshot {
  basePrice: number;
  units: number;
  unitType: 'NIGHT' | 'DAY' | 'HOUR';
  subtotal: number;
  discount: number;
  taxes: number;
  platformFee: number;
  extraFees: ExtraFee[];
  total: number;
  currency: 'USD' | 'KHR';
}

export type BookingStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'
  | 'REJECTED';

export type PaymentStatus =
  | 'UNPAID'
  | 'PAYMENT_PENDING'
  | 'PAID'
  | 'FAILED'
  | 'REFUNDED'
  | 'PARTIALLY_REFUNDED';

export type PaymentMethod =
  | 'CARD'
  | 'ABA_PAY'
  | 'BAKONG'
  | 'WING'
  | 'BANK_TRANSFER'
  | 'CASH_ON_ARRIVAL';

export interface BookingStatusEvent {
  status: BookingStatus;
  timestamp: string;
  note?: string;
}

export interface Booking {
  id: string;
  bookingReference: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  businessId: string;
  businessName: string;
  businessCategory: BusinessCategory;
  businessLocation: string;
  serviceId: string;
  serviceName: string;
  serviceImage: string;
  serviceType: string;
  startDate: string;
  endDate: string;
  startTime?: string;
  endTime?: string;
  quantity: number;
  guests?: {
    adults: number;
    children: number;
  };
  pickupLocation?: string;
  pricing: PricingSnapshot;
  bookingStatus: BookingStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  specialRequests?: string;
  cancellationReason?: string;
  refundAmount?: number;
  createdAt: string;
  statusHistory: BookingStatusEvent[];
}

export interface ReviewResponse {
  content: string;
  respondedAt: string;
}

export interface Review {
  id: string;
  bookingId: string;
  businessId: string;
  customerId: string;
  customerName: string;
  customerAvatar: string;
  serviceName: string;
  rating: number;
  cleanliness: number;
  service: number;
  value: number;
  comment: string;
  title?: string;
  content?: string;
  images?: string[];
  reply?: {
    comment: string;
    date: string;
  };
  response?: ReviewResponse;
  status: 'PUBLISHED' | 'HIDDEN' | 'FLAGGED';
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: UserRole;
  text: string;
  message?: string;
  timestamp: string;
  createdAt?: string;
  read: boolean;
  type: 'TEXT' | 'SYSTEM' | 'IMAGE';
  imageUrl?: string;
  receiverId?: string;
  receiverName?: string;
}

export interface Conversation {
  id: string;
  businessId: string;
  businessName: string;
  businessImage: string;
  customerId: string;
  customerName: string;
  customerAvatar: string;
  ownerId: string;
  bookingId?: string;
  bookingRef?: string;
  lastMessage: string;
  lastTimestamp: string;
  unreadCountCustomer: number;
  unreadCountOwner: number;
  messages: ChatMessage[];
}

export interface SupportTicketMessage {
  id: string;
  sender: string;
  senderName?: string;
  isStaff: boolean;
  message: string;
  timestamp: string;
  createdAt?: string;
}

export type TicketStatus =
  | 'OPEN'
  | 'IN_PROGRESS'
  | 'WAITING_FOR_CUSTOMER'
  | 'RESOLVED'
  | 'CLOSED';

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  userId: string;
  userName: string;
  userEmail: string;
  userRole?: string;
  category: string;
  subject: string;
  status: TicketStatus;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  messages: SupportTicketMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'BOOKING' | 'PAYMENT' | 'BUSINESS' | 'SYSTEM' | 'REVIEW';
  link: string;
  read: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  actorName: string;
  actorRole: UserRole;
  action: string;
  entity: string;
  entityId: string;
  details: string;
  timestamp: string;
  ipAddress?: string;
}

export interface LocationOption {
  id: string;
  name: string;
  khmerName: string;
  province: string;
  popular: boolean;
  tagline: string;
  description?: string;
  highlights?: string[];
  image: string;
  accommodationCount: number;
  popularStaysCount?: number;
  transportCount: number;
}
