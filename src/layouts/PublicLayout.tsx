import React from 'react';
import { Outlet } from 'react-router-dom';
import { PublicHeader } from '../components/public/PublicHeader';
import { PublicFooter } from '../components/public/PublicFooter';
import { MobileBottomNav } from '../components/layout/MobileBottomNav';
import { ToastContainer } from '../components/common/Toast';

export const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      {/* Public Navbar - TravelGo */}
      <PublicHeader />

      {/* Main Content - Full Width */}
      <main className="flex-1 pb-16 md:pb-0 w-full">
        <div className="w-full px-4 sm:px-6 lg:px-10 py-6 sm:py-8">
          <Outlet />
        </div>
      </main>

      {/* Public Footer */}
      <PublicFooter />

      {/* Mobile Bottom Navigation for quick browsing */}
      <MobileBottomNav />

      {/* Interactive Toast Notifications */}
      <ToastContainer />
    </div>
  );
};
