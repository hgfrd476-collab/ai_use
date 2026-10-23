import React, { useState } from 'react';
import { Download, Share, PlusSquare, X } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';

export const PWAInstallButton: React.FC<{ variant?: 'header' | 'button' | 'compact' }> = ({ variant = 'header' }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  if (isInstalled) {
    return null;
  }

  if (isInstallable) {
    if (variant === 'compact') {
      return (
        <button
          onClick={install}
          id="btn-pwa-install-compact"
          aria-label="Install App"
          className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Install</span>
        </button>
      );
    }

    return (
      <button
        onClick={install}
        id="btn-pwa-install"
        className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-blue-700 to-indigo-700 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:shadow hover:from-blue-800 hover:to-indigo-800 transition"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Install App</span>
      </button>
    );
  }

  if (isIOS) {
    return (
      <>
        <button
          onClick={() => setShowIOSGuide(true)}
          id="btn-pwa-install-ios"
          className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition"
        >
          <Download className="w-3.5 h-3.5 text-blue-600" />
          <span>Install iOS</span>
        </button>

        {showIOSGuide && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
            <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl border border-slate-100">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-900">Install KampujaGo on iPhone / iPad</h3>
                <button
                  onClick={() => setShowIOSGuide(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 rounded-full"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div className="flex items-start gap-3 p-2 rounded-xl bg-slate-50">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">1</span>
                  <p>Tap the <strong>Share</strong> button <Share className="inline w-4 h-4 text-blue-600 mx-1" /> at the bottom of Safari.</p>
                </div>
                <div className="flex items-start gap-3 p-2 rounded-xl bg-slate-50">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">2</span>
                  <p>Scroll down and tap <strong>Add to Home Screen</strong> <PlusSquare className="inline w-4 h-4 text-slate-700 mx-1" />.</p>
                </div>
                <div className="flex items-start gap-3 p-2 rounded-xl bg-slate-50">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">3</span>
                  <p>Tap <strong>Add</strong> in the top-right corner to launch anytime with 1-tap!</p>
                </div>
              </div>
              <button
                onClick={() => setShowIOSGuide(false)}
                className="mt-5 w-full rounded-xl bg-blue-600 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition"
              >
                Got It
              </button>
            </div>
          </div>
        )}
      </>
    );
  }

  return null;
};
