import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { RoleRoute } from './routes/RoleRoute';

// 4 Architectural Layouts
import { PublicLayout } from './layouts/PublicLayout';
import { CustomerLayout } from './layouts/CustomerLayout';
import { OwnerLayout } from './layouts/OwnerLayout';
import { AdminLayout } from './layouts/AdminLayout';

// Public Pages
import { HomePage } from './pages/public/HomePage';
import { SearchResultsPage } from './pages/public/SearchResultsPage';
import { AccommodationPage } from './pages/public/AccommodationPage';
import { AccommodationDetailPage } from './pages/public/AccommodationDetailPage';
import { TransportationPage } from './pages/public/TransportationPage';
import { TransportationDetailPage } from './pages/public/TransportationDetailPage';
import { DestinationsPage } from './pages/public/DestinationsPage';
import { OffersPage } from './pages/public/OffersPage';
import { FAQPage } from './pages/public/FAQPage';
import { AboutPage } from './pages/public/AboutPage';
import { ContactPage } from './pages/public/ContactPage';
import { LoginPage } from './pages/public/LoginPage';
import { RegisterPage } from './pages/public/RegisterPage';

// Customer Pages
import { CustomerDashboardPage } from './pages/customer/CustomerDashboardPage';
import { CustomerBookingsPage } from './pages/customer/CustomerBookingsPage';
import { BookingDetailPage } from './pages/customer/BookingDetailPage';
import { CustomerFavoritesPage } from './pages/customer/CustomerFavoritesPage';
import { CustomerPaymentsPage } from './pages/customer/CustomerPaymentsPage';
import { CustomerMessagesPage } from './pages/customer/CustomerMessagesPage';
import { CustomerReviewsPage } from './pages/customer/CustomerReviewsPage';
import { CustomerSupportPage } from './pages/customer/CustomerSupportPage';
import { CustomerNotificationsPage } from './pages/customer/CustomerNotificationsPage';
import { CustomerProfilePage } from './pages/customer/CustomerProfilePage';
import { CustomerSettingsPage } from './pages/customer/CustomerSettingsPage';

// Business Owner Pages
import { OwnerDashboardPage } from './pages/owner/OwnerDashboardPage';
import { OwnerBusinessesPage } from './pages/owner/OwnerBusinessesPage';
import { OwnerBusinessCreatePage } from './pages/owner/OwnerBusinessCreatePage';
import { OwnerAccommodationPage } from './pages/owner/OwnerAccommodationPage';
import { OwnerTransportationPage } from './pages/owner/OwnerTransportationPage';
import { OwnerBookingsPage } from './pages/owner/OwnerBookingsPage';
import { OwnerCustomersPage } from './pages/owner/OwnerCustomersPage';
import { OwnerCalendarPage } from './pages/owner/OwnerCalendarPage';
import { OwnerRevenuePage } from './pages/owner/OwnerRevenuePage';
import { OwnerReviewsPage } from './pages/owner/OwnerReviewsPage';
import { OwnerMessagesPage } from './pages/owner/OwnerMessagesPage';
import { OwnerNotificationsPage } from './pages/owner/OwnerNotificationsPage';
import { OwnerSettingsPage } from './pages/owner/OwnerSettingsPage';

// Super Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminBusinessesPage } from './pages/admin/AdminBusinessesPage';
import { AdminAccommodationPage } from './pages/admin/AdminAccommodationPage';
import { AdminTransportationPage } from './pages/admin/AdminTransportationPage';
import { AdminBookingsPage } from './pages/admin/AdminBookingsPage';
import { AdminPaymentsPage } from './pages/admin/AdminPaymentsPage';
import { AdminReviewsPage } from './pages/admin/AdminReviewsPage';
import { AdminDisputesPage } from './pages/admin/AdminDisputesPage';
import { AdminReportsPage } from './pages/admin/AdminReportsPage';
import { AdminLocationsPage } from './pages/admin/AdminLocationsPage';
import { AdminNotificationsPage } from './pages/admin/AdminNotificationsPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { AdminAuditPage } from './pages/admin/AdminAuditPage';

export function App() {
  return (
    <AppProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* =========================================================
                1. PUBLIC MARKETPLACE ROUTES (PublicLayout)
                ========================================================= */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/accommodation" element={<AccommodationPage />} />
              <Route path="/accommodation/:id" element={<AccommodationDetailPage />} />
              <Route path="/transportation" element={<TransportationPage />} />
              <Route path="/transportation/:id" element={<TransportationDetailPage />} />
              <Route path="/search" element={<SearchResultsPage />} />
              <Route path="/destinations" element={<DestinationsPage />} />
              <Route path="/offers" element={<OffersPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/faq" element={<FAQPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>

            {/* =========================================================
                2. CUSTOMER PORTAL (CustomerLayout) - Protected
                ========================================================= */}
            <Route
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRoles={['CUSTOMER', 'SUPER_ADMIN']}>
                    <CustomerLayout />
                  </RoleRoute>
                </ProtectedRoute>
              }
            >
              <Route path="/customer" element={<Navigate to="/customer/dashboard" replace />} />
              <Route path="/customer/dashboard" element={<CustomerDashboardPage />} />
              <Route path="/customer/bookings" element={<CustomerBookingsPage />} />
              <Route path="/customer/bookings/:id" element={<BookingDetailPage />} />
              <Route path="/customer/favorites" element={<CustomerFavoritesPage />} />
              <Route path="/customer/payments" element={<CustomerPaymentsPage />} />
              <Route path="/customer/messages" element={<CustomerMessagesPage />} />
              <Route path="/customer/support" element={<CustomerSupportPage />} />
              <Route path="/customer/reviews" element={<CustomerReviewsPage />} />
              <Route path="/customer/notifications" element={<CustomerNotificationsPage />} />
              <Route path="/customer/profile" element={<CustomerProfilePage />} />
              <Route path="/customer/settings" element={<CustomerSettingsPage />} />
            </Route>

            {/* =========================================================
                3. BUSINESS OWNER PORTAL (OwnerLayout) - Protected
                ========================================================= */}
            <Route
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRoles={['BUSINESS_OWNER', 'SUPER_ADMIN']}>
                    <OwnerLayout />
                  </RoleRoute>
                </ProtectedRoute>
              }
            >
              <Route path="/owner" element={<Navigate to="/owner/dashboard" replace />} />
              <Route path="/owner/dashboard" element={<OwnerDashboardPage />} />
              <Route path="/owner/businesses" element={<OwnerBusinessesPage />} />
              <Route path="/owner/businesses/create" element={<OwnerBusinessCreatePage />} />
              <Route path="/owner/businesses/:id" element={<OwnerBusinessesPage />} />
              <Route path="/owner/businesses/:id/edit" element={<OwnerBusinessCreatePage />} />

              {/* Accommodation Management */}
              <Route path="/owner/accommodation" element={<OwnerAccommodationPage />} />
              <Route path="/owner/accommodation/properties" element={<OwnerAccommodationPage />} />
              <Route path="/owner/accommodation/rooms" element={<OwnerAccommodationPage />} />
              <Route path="/owner/accommodation/availability" element={<OwnerCalendarPage />} />
              <Route path="/owner/accommodation/pricing" element={<OwnerAccommodationPage />} />

              {/* Transportation Management */}
              <Route path="/owner/transportation" element={<OwnerTransportationPage />} />
              <Route path="/owner/transportation/vehicles" element={<OwnerTransportationPage />} />
              <Route path="/owner/transportation/availability" element={<OwnerCalendarPage />} />
              <Route path="/owner/transportation/pricing" element={<OwnerTransportationPage />} />

              {/* Bookings, Customers, Operations */}
              <Route path="/owner/bookings" element={<OwnerBookingsPage />} />
              <Route path="/owner/bookings/:id" element={<OwnerBookingsPage />} />
              <Route path="/owner/customers" element={<OwnerCustomersPage />} />
              <Route path="/owner/payments" element={<OwnerRevenuePage />} />
              <Route path="/owner/messages" element={<OwnerMessagesPage />} />
              <Route path="/owner/reviews" element={<OwnerReviewsPage />} />
              <Route path="/owner/revenue" element={<OwnerRevenuePage />} />
              <Route path="/owner/calendar" element={<OwnerCalendarPage />} />
              <Route path="/owner/notifications" element={<OwnerNotificationsPage />} />
              <Route path="/owner/settings" element={<OwnerSettingsPage />} />
            </Route>

            {/* =========================================================
                4. SUPER ADMIN GOVERNANCE (AdminLayout) - Protected
                ========================================================= */}
            <Route
              element={
                <ProtectedRoute>
                  <RoleRoute allowedRoles={['SUPER_ADMIN']}>
                    <AdminLayout />
                  </RoleRoute>
                </ProtectedRoute>
              }
            >
              <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
              <Route path="/admin/users" element={<AdminUsersPage />} />
              <Route path="/admin/owners" element={<AdminUsersPage />} />
              <Route path="/admin/businesses" element={<AdminBusinessesPage />} />
              <Route path="/admin/businesses/pending" element={<AdminBusinessesPage />} />
              <Route path="/admin/businesses/approved" element={<AdminBusinessesPage />} />
              <Route path="/admin/businesses/rejected" element={<AdminBusinessesPage />} />
              <Route path="/admin/businesses/suspended" element={<AdminBusinessesPage />} />
              <Route path="/admin/accommodation" element={<AdminAccommodationPage />} />
              <Route path="/admin/transportation" element={<AdminTransportationPage />} />
              <Route path="/admin/bookings" element={<AdminBookingsPage />} />
              <Route path="/admin/payments" element={<AdminPaymentsPage />} />
              <Route path="/admin/reviews" element={<AdminReviewsPage />} />
              <Route path="/admin/support" element={<AdminDisputesPage />} />
              <Route path="/admin/reports" element={<AdminReportsPage />} />
              <Route path="/admin/locations" element={<AdminLocationsPage />} />
              <Route path="/admin/notifications" element={<AdminNotificationsPage />} />
              <Route path="/admin/settings" element={<AdminSettingsPage />} />
              <Route path="/admin/audit" element={<AdminAuditPage />} />
            </Route>

            {/* Fallback Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </AppProvider>
  );
}

export default App;
