import React from 'react';
import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

export const OfflineIndicator: React.FC = () => {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div
      id="offline-banner"
      className="fixed bottom-16 sm:bottom-4 left-4 right-4 sm:right-auto sm:max-w-md z-50 flex items-center gap-2.5 rounded-xl bg-slate-900/95 backdrop-blur-md px-4 py-2.5 text-xs font-semibold text-white shadow-xl border border-slate-800 animate-in slide-in-from-bottom duration-200"
    >
      <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-amber-400">
        <WifiOff className="w-3.5 h-3.5" />
      </div>
      <div>
        <p className="font-bold text-amber-300">Offline Mode Active</p>
        <p className="text-slate-300 text-[11px]">You are viewing cached data. Bookings will sync when connection returns.</p>
      </div>
    </div>
  );
};
