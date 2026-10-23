import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  Business,
  Room,
  Vehicle,
  Booking,
  Review,
  Conversation,
  SupportTicket,
  NotificationItem,
  AuditLog,
  BookingStatus,
  ChatMessage,
} from '../types';
import {
  INITIAL_USERS,
  INITIAL_BUSINESSES,
  INITIAL_ROOMS,
  INITIAL_VEHICLES,
  INITIAL_BOOKINGS,
  INITIAL_REVIEWS,
  INITIAL_CONVERSATIONS,
  INITIAL_TICKETS,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
} from '../data/mockData';
import { CurrencyCode } from '../utils/currency';
import { LanguageCode, TRANSLATIONS } from '../data/translations';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'error' | 'info' | 'warning';
}

interface AppContextType {
  currentUser: User;
  users: User[];
  currentRole: UserRole;
  setCurrentRole: (role: UserRole) => void;
  currency: CurrencyCode;
  setCurrency: (curr: CurrencyCode) => void;
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: typeof TRANSLATIONS['en'];
  
  // Businesses
  businesses: Business[];
  selectedOwnerBusinessId: string | 'ALL';
  setSelectedOwnerBusinessId: (id: string | 'ALL') => void;
  getBusinessById: (id: string) => Business | undefined;
  createBusiness: (biz: Omit<Business, 'id' | 'createdAt' | 'status' | 'rating' | 'reviewCount'>) => Business;
  updateBusiness: (id: string, updates: Partial<Business>) => void;
  updateBusinessStatus: (id: string, status: Business['status']) => void;
  deleteBusiness: (id: string) => void;
  approveBusiness: (id: string) => void;
  rejectBusiness: (id: string, reason: string) => void;
  suspendBusiness: (id: string) => void;

  // Rooms & Vehicles
  rooms: Room[];
  vehicles: Vehicle[];
  getRoomsByBusinessId: (businessId: string) => Room[];
  getVehiclesByBusinessId: (businessId: string) => Vehicle[];
  addRoom: (room: Omit<Room, 'id'>) => Room;
  createRoom: (room: Omit<Room, 'id'>) => Room;
  deleteRoom: (id: string) => void;
  updateRoom: (id: string, updates: Partial<Room>) => void;
  addVehicle: (vehicle: Omit<Vehicle, 'id'>) => Vehicle;
  createVehicle: (vehicle: Omit<Vehicle, 'id'>) => Vehicle;
  deleteVehicle: (id: string) => void;
  updateVehicle: (id: string, updates: Partial<Vehicle>) => void;

  // Bookings
  bookings: Booking[];
  createBooking: (booking: Omit<Booking, 'id' | 'bookingReference' | 'createdAt' | 'statusHistory'>) => Booking;
  updateBookingStatus: (id: string, status: BookingStatus, note?: string) => void;
  cancelBooking: (id: string, reason: string) => void;

  // Favorites
  favorites: string[];
  toggleFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;

  // Reviews
  reviews: Review[];
  addReview: (review: Omit<Review, 'id' | 'createdAt' | 'status'>) => void;
  createReview: (review: Omit<Review, 'id' | 'createdAt' | 'status'>) => void;
  deleteReview: (id: string) => void;
  replyReview: (reviewId: string, replyText: string) => void;
  replyToReview: (reviewId: string, replyText: string) => void;
  moderateReview: (reviewId: string, status: Review['status']) => void;

  // Messages
  conversations: Conversation[];
  messages: ChatMessage[];
  sendMessage: (arg1: any, arg2?: any) => void;
  startConversation: (businessId: string, initialMessage: string, bookingRef?: string) => string;

  // Support
  tickets: SupportTicket[];
  createTicket: (categoryOrTicket: any, subject?: string, description?: string) => void;
  replyTicket: (ticketId: string, message: string) => void;
  replyToTicket: (ticketId: string, senderOrMessage: string, message?: string) => void;
  updateTicketStatus: (ticketId: string, status: SupportTicket['status']) => void;

  // Notifications
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;

  // Users & Admin
  updateUserStatus: (userId: string, status: User['status']) => void;
  updateCurrentUser: (updates: Partial<User>) => void;
  auditLogs: AuditLog[];

  // Toasts
  toasts: ToastMessage[];
  addToast: (title: string, description?: string, type?: ToastMessage['type']) => void;
  removeToast: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('kg_users');
    return saved ? JSON.parse(saved) : INITIAL_USERS;
  });

  const [currentRole, setCurrentRoleState] = useState<UserRole>(() => {
    const savedRole = localStorage.getItem('kg_role') as UserRole;
    return savedRole || 'CUSTOMER';
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    return users.find((u) => u.role === currentRole) || users[0];
  });

  const [currency, setCurrencyState] = useState<CurrencyCode>(() => {
    return (localStorage.getItem('kg_currency') as CurrencyCode) || 'USD';
  });

  const [language, setLanguageState] = useState<LanguageCode>(() => {
    return (localStorage.getItem('kg_lang') as LanguageCode) || 'en';
  });

  const [businesses, setBusinesses] = useState<Business[]>(() => {
    const saved = localStorage.getItem('kg_businesses');
    return saved ? JSON.parse(saved) : INITIAL_BUSINESSES;
  });

  const [selectedOwnerBusinessId, setSelectedOwnerBusinessIdState] = useState<string | 'ALL'>(() => {
    return (localStorage.getItem('kg_owner_selected_biz') as string) || 'ALL';
  });

  const setSelectedOwnerBusinessId = (id: string | 'ALL') => {
    setSelectedOwnerBusinessIdState(id);
    localStorage.setItem('kg_owner_selected_biz', id);
  };

  const [rooms, setRooms] = useState<Room[]>(() => {
    const saved = localStorage.getItem('kg_rooms');
    return saved ? JSON.parse(saved) : INITIAL_ROOMS;
  });

  const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
    const saved = localStorage.getItem('kg_vehicles');
    return saved ? JSON.parse(saved) : INITIAL_VEHICLES;
  });

  const [bookings, setBookings] = useState<Booking[]>(() => {
    const saved = localStorage.getItem('kg_bookings');
    return saved ? JSON.parse(saved) : INITIAL_BOOKINGS;
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('kg_favorites');
    return saved ? JSON.parse(saved) : ['biz-1', 'biz-4'];
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('kg_reviews');
    return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
  });

  const [conversations, setConversations] = useState<Conversation[]>(() => {
    const saved = localStorage.getItem('kg_conversations');
    return saved ? JSON.parse(saved) : INITIAL_CONVERSATIONS;
  });

  const [tickets, setTickets] = useState<SupportTicket[]>(() => {
    const saved = localStorage.getItem('kg_tickets');
    return saved ? JSON.parse(saved) : INITIAL_TICKETS;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem('kg_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(() => {
    const saved = localStorage.getItem('kg_audit_logs');
    return saved ? JSON.parse(saved) : INITIAL_AUDIT_LOGS;
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Sync to local storage
  useEffect(() => {
    localStorage.setItem('kg_businesses', JSON.stringify(businesses));
  }, [businesses]);

  useEffect(() => {
    localStorage.setItem('kg_rooms', JSON.stringify(rooms));
  }, [rooms]);

  useEffect(() => {
    localStorage.setItem('kg_vehicles', JSON.stringify(vehicles));
  }, [vehicles]);

  useEffect(() => {
    localStorage.setItem('kg_bookings', JSON.stringify(bookings));
  }, [bookings]);

  useEffect(() => {
    localStorage.setItem('kg_favorites', JSON.stringify(favorites));
  }, [favorites]);

  useEffect(() => {
    localStorage.setItem('kg_conversations', JSON.stringify(conversations));
  }, [conversations]);

  useEffect(() => {
    localStorage.setItem('kg_tickets', JSON.stringify(tickets));
  }, [tickets]);

  useEffect(() => {
    localStorage.setItem('kg_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('kg_audit_logs', JSON.stringify(auditLogs));
  }, [auditLogs]);

  useEffect(() => {
    localStorage.setItem('kg_users', JSON.stringify(users));
  }, [users]);

  const setRole = (role: UserRole) => {
    setCurrentRoleState(role);
    localStorage.setItem('kg_role', role);
    const targetUser = users.find((u) => u.role === role);
    if (targetUser) {
      setCurrentUser(targetUser);
    }
    addToast(`Role Switched`, `Now viewing as ${role.replace('_', ' ')}`, 'info');
  };

  const setCurrency = (curr: CurrencyCode) => {
    setCurrencyState(curr);
    localStorage.setItem('kg_currency', curr);
    addToast(`Currency Changed`, `Platform prices now formatted in ${curr}`, 'info');
  };

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem('kg_lang', lang);
  };

  const addToast = (title: string, description?: string, type: ToastMessage['type'] = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
    setToasts((prev) => [...prev, { id, title, description, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 4500);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const logAction = (action: string, entity: string, entityId: string, details: string) => {
    const log: AuditLog = {
      id: `audit-${Date.now()}`,
      actorName: currentUser.name,
      actorRole: currentRole,
      action,
      entity,
      entityId,
      details,
      timestamp: new Date().toISOString(),
      ipAddress: '127.0.0.1',
    };
    setAuditLogs((prev) => [log, ...prev]);
  };

  // Business actions
  const getBusinessById = (id: string) => businesses.find((b) => b.id === id);

  const createBusiness = (bizData: Omit<Business, 'id' | 'createdAt' | 'status' | 'rating' | 'reviewCount'>): Business => {
    const newBiz: Business = {
      ...bizData,
      id: `biz-${Date.now()}`,
      status: 'PENDING',
      rating: 5.0,
      reviewCount: 0,
      createdAt: new Date().toISOString(),
    };
    setBusinesses((prev) => [newBiz, ...prev]);
    logAction('BUSINESS_SUBMITTED', 'Business', newBiz.id, `Submitted ${newBiz.name} for verification`);
    addToast('Business Submitted', `${newBiz.name} is now awaiting Super Admin verification.`, 'success');

    // Super Admin notification
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        userId: 'usr-admin-1',
        title: 'New Business Pending Verification',
        message: `${newBiz.name} was submitted by ${currentUser.name}.`,
        type: 'BUSINESS',
        link: '/admin/businesses',
        read: false,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);

    return newBiz;
  };

  const updateBusiness = (id: string, updates: Partial<Business>) => {
    setBusinesses((prev) =>
      prev.map((b) => (b.id === id ? { ...b, ...updates } : b))
    );
    logAction('BUSINESS_UPDATED', 'Business', id, `Updated business details`);
    addToast('Business Updated', 'Changes saved successfully', 'success');
  };

  const approveBusiness = (id: string) => {
    setBusinesses((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'APPROVED' } : b))
    );
    const target = businesses.find((b) => b.id === id);
    logAction('BUSINESS_APPROVED', 'Business', id, `Super Admin approved ${target?.name || id}`);
    addToast('Business Approved', `${target?.name || 'Business'} is now published on KampujaGo!`, 'success');

    // Notify owner
    if (target) {
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          userId: target.ownerId,
          title: '🎉 Business Approved!',
          message: `Your business "${target.name}" is approved and active for bookings.`,
          type: 'BUSINESS',
          link: `/owner/businesses`,
          read: false,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
    }
  };

  const rejectBusiness = (id: string, reason: string) => {
    setBusinesses((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'REJECTED', rejectionReason: reason } : b))
    );
    const target = businesses.find((b) => b.id === id);
    logAction('BUSINESS_REJECTED', 'Business', id, `Super Admin rejected ${target?.name || id}: ${reason}`);
    addToast('Business Rejected', `Feedback sent to business owner.`, 'warning');

    if (target) {
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          userId: target.ownerId,
          title: 'Business Submission Needs Changes',
          message: `Your business "${target.name}" was not approved: ${reason}`,
          type: 'BUSINESS',
          link: `/owner/businesses`,
          read: false,
          createdAt: new Date().toISOString(),
        },
        ...prev,
      ]);
    }
  };

  const suspendBusiness = (id: string) => {
    setBusinesses((prev) =>
      prev.map((b) => (b.id === id ? { ...b, status: 'SUSPENDED' } : b))
    );
    const target = businesses.find((b) => b.id === id);
    logAction('BUSINESS_SUSPENDED', 'Business', id, `Super Admin suspended ${target?.name || id}`);
    addToast('Business Suspended', `Business is hidden from the public marketplace.`, 'warning');
  };

  // Inventory helpers
  const getRoomsByBusinessId = (businessId: string) => rooms.filter((r) => r.businessId === businessId);
  const getVehiclesByBusinessId = (businessId: string) => vehicles.filter((v) => v.businessId === businessId);

  const addRoom = (roomData: Omit<Room, 'id'>): Room => {
    const newRoom: Room = {
      ...roomData,
      id: `room-${Date.now()}`,
    };
    setRooms((prev) => [newRoom, ...prev]);
    logAction('ROOM_CREATED', 'Room', newRoom.id, `Created room "${newRoom.name}"`);
    addToast('Room Added', `${newRoom.name} added to inventory.`, 'success');
    return newRoom;
  };

  const updateRoom = (id: string, updates: Partial<Room>) => {
    setRooms((prev) => prev.map((r) => (r.id === id ? { ...r, ...updates } : r)));
    addToast('Room Updated', 'Inventory and pricing updated.', 'success');
  };

  const addVehicle = (vehData: Omit<Vehicle, 'id'>): Vehicle => {
    const newVeh: Vehicle = {
      ...vehData,
      id: `veh-${Date.now()}`,
    };
    setVehicles((prev) => [newVeh, ...prev]);
    logAction('VEHICLE_CREATED', 'Vehicle', newVeh.id, `Created vehicle "${newVeh.name}"`);
    addToast('Vehicle Added', `${newVeh.name} added to fleet.`, 'success');
    return newVeh;
  };

  const updateVehicle = (id: string, updates: Partial<Vehicle>) => {
    setVehicles((prev) => prev.map((v) => (v.id === id ? { ...v, ...updates } : v)));
    addToast('Vehicle Updated', 'Vehicle specifications and rates updated.', 'success');
  };

  // Bookings
  const createBooking = (bookingData: Omit<Booking, 'id' | 'bookingReference' | 'createdAt' | 'statusHistory'>): Booking => {
    const refCode = `KG-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();
    const newBooking: Booking = {
      ...bookingData,
      id: `bk-${Date.now()}`,
      bookingReference: refCode,
      createdAt: now,
      statusHistory: [
        { status: 'PENDING', timestamp: now, note: 'Booking reserved' },
        { status: 'CONFIRMED', timestamp: now, note: 'Instant confirmation & payment recorded' },
      ],
    };

    setBookings((prev) => [newBooking, ...prev]);
    logAction('BOOKING_CREATED', 'Booking', newBooking.id, `Booked ${newBooking.serviceName} (${refCode}) for $${newBooking.pricing.total}`);
    addToast('Booking Confirmed!', `Reference #${refCode}. Check your email and customer portal.`, 'success');

    // Notify Business Owner
    const biz = businesses.find((b) => b.id === newBooking.businessId);
    if (biz) {
      setNotifications((prev) => [
        {
          id: `notif-${Date.now()}`,
          userId: biz.ownerId,
          title: '🎉 New Booking Received!',
          message: `${newBooking.customerName} booked ${newBooking.serviceName} (${refCode})`,
          type: 'BOOKING',
          link: `/owner/bookings`,
          read: false,
          createdAt: now,
        },
        ...prev,
      ]);
    }

    return newBooking;
  };

  const updateBookingStatus = (id: string, status: BookingStatus, note?: string) => {
    const now = new Date().toISOString();
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          return {
            ...b,
            bookingStatus: status,
            statusHistory: [
              ...b.statusHistory,
              { status, timestamp: now, note: note || `Status updated to ${status}` },
            ],
          };
        }
        return b;
      })
    );
    logAction('BOOKING_STATUS_CHANGED', 'Booking', id, `Booking status changed to ${status}`);
    addToast('Booking Updated', `Status changed to ${status}.`, 'info');
  };

  const cancelBooking = (id: string, reason: string) => {
    const now = new Date().toISOString();
    setBookings((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          return {
            ...b,
            bookingStatus: 'CANCELLED',
            cancellationReason: reason,
            refundAmount: b.pricing.total, // Depending on policy, full or partial refund
            paymentStatus: 'REFUNDED',
            statusHistory: [
              ...b.statusHistory,
              { status: 'CANCELLED', timestamp: now, note: `Cancelled: ${reason}` },
            ],
          };
        }
        return b;
      })
    );
    logAction('BOOKING_CANCELLED', 'Booking', id, `Cancelled: ${reason}`);
    addToast('Booking Cancelled', 'Your cancellation has been processed and refund queued.', 'warning');
  };

  // Favorites
  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(id);
      if (exists) {
        addToast('Removed from Saved', 'Item removed from favorites', 'info');
        return prev.filter((item) => item !== id);
      } else {
        addToast('Saved to Favorites', 'Saved to your profile', 'success');
        return [...prev, id];
      }
    });
  };

  const isFavorite = (id: string) => favorites.includes(id);

  // Reviews
  const addReview = (reviewData: Omit<Review, 'id' | 'createdAt' | 'status'>) => {
    const newRev: Review = {
      ...reviewData,
      id: `rev-${Date.now()}`,
      status: 'PUBLISHED',
      createdAt: new Date().toISOString(),
    };
    setReviews((prev) => [newRev, ...prev]);

    // Recalculate business rating
    setBusinesses((prev) =>
      prev.map((b) => {
        if (b.id === newRev.businessId) {
          const currentCount = b.reviewCount;
          const newCount = currentCount + 1;
          const newRating = Number(((b.rating * currentCount + newRev.rating) / newCount).toFixed(1));
          return { ...b, rating: newRating, reviewCount: newCount };
        }
        return b;
      })
    );

    logAction('REVIEW_CREATED', 'Review', newRev.id, `Rating: ${newRev.rating} stars for ${newRev.serviceName}`);
    addToast('Review Submitted', 'Thank you for sharing your experience!', 'success');
  };

  const replyReview = (reviewId: string, replyText: string) => {
    setReviews((prev) =>
      prev.map((r) =>
        r.id === reviewId
          ? { ...r, reply: { comment: replyText, date: new Date().toISOString() } }
          : r
      )
    );
    addToast('Reply Published', 'Your response to the customer is now visible.', 'success');
  };

  const moderateReview = (reviewId: string, status: Review['status']) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, status } : r))
    );
    addToast('Review Moderated', `Status set to ${status}`, 'info');
  };

  // Messaging
  const sendMessage = (conversationId: string, text: string) => {
    const now = new Date().toISOString();
    const newMsg = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderRole: currentRole,
      text,
      timestamp: now,
      read: true,
      type: 'TEXT' as const,
    };

    setConversations((prev) =>
      prev.map((c) => {
        if (c.id === conversationId) {
          return {
            ...c,
            lastMessage: text,
            lastTimestamp: now,
            messages: [...c.messages, newMsg],
            unreadCountCustomer: currentRole === 'BUSINESS_OWNER' ? c.unreadCountCustomer + 1 : 0,
            unreadCountOwner: currentRole === 'CUSTOMER' ? c.unreadCountOwner + 1 : 0,
          };
        }
        return c;
      })
    );
  };

  const startConversation = (businessId: string, initialMessage: string, bookingRef?: string): string => {
    const existing = conversations.find(
      (c) => c.businessId === businessId && c.customerId === currentUser.id
    );
    if (existing) {
      sendMessage(existing.id, initialMessage);
      return existing.id;
    }

    const biz = businesses.find((b) => b.id === businessId);
    const convId = `conv-${Date.now()}`;
    const now = new Date().toISOString();
    const newConv: Conversation = {
      id: convId,
      businessId,
      businessName: biz?.name || 'Business Partner',
      businessImage: biz?.images[0] || '',
      customerId: currentUser.id,
      customerName: currentUser.name,
      customerAvatar: currentUser.avatar,
      ownerId: biz?.ownerId || 'usr-owner-1',
      bookingRef,
      lastMessage: initialMessage,
      lastTimestamp: now,
      unreadCountCustomer: 0,
      unreadCountOwner: 1,
      messages: [
        {
          id: `msg-${Date.now()}`,
          senderId: currentUser.id,
          senderName: currentUser.name,
          senderRole: currentRole,
          text: initialMessage,
          timestamp: now,
          read: true,
          type: 'TEXT',
        },
      ],
    };

    setConversations((prev) => [newConv, ...prev]);
    return convId;
  };

  const updateBusinessStatus = (id: string, status: Business['status']) => {
    setBusinesses((prev) => prev.map((b) => (b.id === id ? { ...b, status } : b)));
    logAction('BUSINESS_STATUS_UPDATED', 'Business', id, `Status updated to ${status}`);
  };

  const deleteBusiness = (id: string) => {
    setBusinesses((prev) => prev.filter((b) => b.id !== id));
    logAction('BUSINESS_DELETED', 'Business', id, `Business was removed`);
    addToast('Business Deleted', 'Listing has been removed.', 'info');
  };

  const deleteRoom = (id: string) => {
    setRooms((prev) => prev.filter((r) => r.id !== id));
    addToast('Room Removed', 'Room removed from inventory.', 'info');
  };

  const deleteVehicle = (id: string) => {
    setVehicles((prev) => prev.filter((v) => v.id !== id));
    addToast('Vehicle Removed', 'Vehicle removed from fleet.', 'info');
  };

  const deleteReview = (id: string) => {
    setReviews((prev) => prev.filter((r) => r.id !== id));
    addToast('Review Removed', 'Review was removed.', 'info');
  };

  const replyToTicket = (ticketId: string, senderOrMessage: string, message?: string) => {
    const text = message !== undefined ? message : senderOrMessage;
    replyTicket(ticketId, text);
  };

  const updateCurrentUser = (updates: Partial<User>) => {
    setCurrentUser((prev: User) => {
      const updated = { ...prev, ...updates };
      setUsers((uList) => uList.map((u) => (u.id === prev.id ? updated : u)));
      return updated;
    });
    addToast('Profile Updated', 'Your profile details have been saved.', 'success');
  };

  // Messages list flat view
  const messages: ChatMessage[] = conversations.flatMap((c) => c.messages);

  const sendMessageUnified = (arg1: any, arg2?: any) => {
    if (typeof arg1 === 'string' && typeof arg2 === 'string') {
      sendMessage(arg1, arg2);
    } else if (typeof arg1 === 'object' && arg1 !== null) {
      const now = new Date().toISOString();
      const newMsg: ChatMessage = {
        id: `msg-${Date.now()}`,
        senderId: arg1.senderId || currentUser.id,
        senderName: arg1.senderName || currentUser.name,
        senderRole: arg1.senderRole || currentRole,
        text: arg1.message || arg1.text || '',
        message: arg1.message || arg1.text || '',
        timestamp: now,
        createdAt: now,
        read: true,
        type: 'TEXT',
        receiverId: arg1.receiverId,
        receiverName: arg1.receiverName,
      };

      // Find or create conversation
      setConversations((prev) => {
        const found = prev.find(
          (c) =>
            (c.customerId === arg1.receiverId || c.ownerId === arg1.receiverId) ||
            (c.customerId === arg1.senderId || c.ownerId === arg1.senderId)
        );
        if (found) {
          return prev.map((c) =>
            c.id === found.id
              ? {
                  ...c,
                  lastMessage: newMsg.text,
                  lastTimestamp: now,
                  messages: [...c.messages, newMsg],
                }
              : c
          );
        } else {
          const newConv: Conversation = {
            id: `conv-${Date.now()}`,
            businessId: 'biz-1',
            businessName: arg1.receiverName || 'Host',
            businessImage: '',
            customerId: arg1.senderId,
            customerName: arg1.senderName,
            customerAvatar: currentUser.avatar,
            ownerId: arg1.receiverId || 'usr-owner-1',
            lastMessage: newMsg.text,
            lastTimestamp: now,
            unreadCountCustomer: 0,
            unreadCountOwner: 0,
            messages: [newMsg],
          };
          return [...prev, newConv];
        }
      });
    }
  };
  const createTicket = (categoryOrTicket: any, subject?: string, description?: string) => {
    const num = `TKT-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;
    const now = new Date().toISOString();

    let cat = 'General Inquiry';
    let subj = 'Support Request';
    let msgText = '';

    if (typeof categoryOrTicket === 'object' && categoryOrTicket !== null) {
      cat = categoryOrTicket.category || cat;
      subj = categoryOrTicket.subject || subj;
      msgText = categoryOrTicket.description || categoryOrTicket.message || '';
    } else {
      cat = categoryOrTicket || cat;
      subj = subject || subj;
      msgText = description || '';
    }

    const newTicket: SupportTicket = {
      id: `tkt-${Date.now()}`,
      ticketNumber: num,
      userId: currentUser.id,
      userName: currentUser.name,
      userEmail: currentUser.email,
      userRole: currentRole,
      category: cat,
      subject: subj,
      status: 'OPEN',
      priority: 'MEDIUM',
      messages: [
        {
          id: `tm-${Date.now()}`,
          sender: currentUser.name,
          senderName: currentUser.name,
          isStaff: false,
          message: msgText,
          timestamp: now,
          createdAt: now,
        },
      ],
      createdAt: now,
      updatedAt: now,
    };

    setTickets((prev) => [newTicket, ...prev]);
    logAction('TICKET_CREATED', 'SupportTicket', newTicket.id, `Ticket ${num} opened by ${currentUser.name}`);
    addToast('Support Ticket Created', `Ticket #${num} opened. Our team will reply shortly.`, 'success');
  };

  const replyTicket = (ticketId: string, message: string) => {
    const now = new Date().toISOString();
    const isStaff = currentRole === 'SUPER_ADMIN';
    setTickets((prev) =>
      prev.map((t) => {
        if (t.id === ticketId) {
          return {
            ...t,
            status: isStaff ? 'WAITING_FOR_CUSTOMER' : 'IN_PROGRESS',
            updatedAt: now,
            messages: [
              ...t.messages,
              {
                id: `tm-${Date.now()}`,
                sender: isStaff ? `${currentUser.name} (Support Staff)` : currentUser.name,
                isStaff,
                message,
                timestamp: now,
              },
            ],
          };
        }
        return t;
      })
    );
    addToast('Reply Sent', 'Message added to ticket history.', 'success');
  };

  const updateTicketStatus = (ticketId: string, status: SupportTicket['status']) => {
    setTickets((prev) =>
      prev.map((t) => (t.id === ticketId ? { ...t, status, updatedAt: new Date().toISOString() } : t))
    );
    addToast('Ticket Updated', `Status changed to ${status}`, 'info');
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    addToast('Notifications Cleared', 'All marked as read', 'info');
  };

  // Users
  const updateUserStatus = (userId: string, status: User['status']) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, status } : u))
    );
    logAction('USER_STATUS_CHANGED', 'User', userId, `User status set to ${status}`);
    addToast('User Updated', `Status changed to ${status}`, 'info');
  };

  const t = TRANSLATIONS[language];

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        currentRole,
        setCurrentRole: setRole,
        currency,
        setCurrency,
        language,
        setLanguage,
        t,
        businesses,
        selectedOwnerBusinessId,
        setSelectedOwnerBusinessId,
        getBusinessById,
        createBusiness,
        updateBusiness,
        updateBusinessStatus,
        deleteBusiness,
        approveBusiness,
        rejectBusiness,
        suspendBusiness,
        rooms,
        vehicles,
        getRoomsByBusinessId,
        getVehiclesByBusinessId,
        addRoom,
        createRoom: addRoom,
        deleteRoom,
        updateRoom,
        addVehicle,
        createVehicle: addVehicle,
        deleteVehicle,
        updateVehicle,
        bookings,
        createBooking,
        updateBookingStatus,
        cancelBooking,
        favorites,
        toggleFavorite,
        isFavorite,
        reviews,
        addReview,
        createReview: addReview,
        deleteReview,
        replyReview,
        replyToReview: replyReview,
        moderateReview,
        conversations,
        messages,
        sendMessage: sendMessageUnified,
        startConversation,
        tickets,
        createTicket,
        replyTicket,
        replyToTicket,
        updateTicketStatus,
        notifications,
        markNotificationRead,
        markAllNotificationsRead,
        updateUserStatus,
        updateCurrentUser,
        auditLogs,
        toasts,
        addToast,
        removeToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
