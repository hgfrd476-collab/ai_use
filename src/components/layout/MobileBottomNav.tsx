import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  Home,
  Search,
  CalendarCheck,
  Heart,
  User,
  LayoutDashboard,
  Building2,
  Inbox,
  MessageSquare,
  Settings,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const MobileBottomNav: React.FC = () => {
  const { currentRole, favorites, notifications } = useApp();

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (currentRole === 'BUSINESS_OWNER') {
    return (
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-1.5 px-3 flex items-center justify-around shadow-lg">
        <NavLink
          to="/owner/dashboard"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-bold transition ${
              isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'
            }`
          }
        >
          <LayoutDashboard className="w-5 h-5" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink
          to="/owner/businesses"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-bold transition ${
              isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'
            }`
          }
        >
          <Building2 className="w-5 h-5" />
          <span>Business</span>
        </NavLink>

        <NavLink
          to="/owner/bookings"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-bold transition ${
              isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'
            }`
          }
        >
          <CalendarCheck className="w-5 h-5" />
          <span>Bookings</span>
        </NavLink>

        <NavLink
          to="/owner/messages"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-bold transition relative ${
              isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'
            }`
          }
        >
          <MessageSquare className="w-5 h-5" />
          <span>Messages</span>
        </NavLink>

        <NavLink
          to="/owner/settings"
          className={({ isActive }) =>
            `flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-bold transition ${
              isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'
            }`
          }
        >
          <Settings className="w-5 h-5" />
          <span>Settings</span>
        </NavLink>
      </nav>
    );
  }

  // Customer Bottom Navigation (Default)
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/90 py-1.5 px-3 flex items-center justify-around shadow-lg">
      <NavLink
        to="/"
        end
        className={({ isActive }) =>
          `flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-bold transition ${
            isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'
          }`
        }
      >
        <Home className="w-5 h-5" />
        <span>Home</span>
      </NavLink>

      <NavLink
        to="/search"
        className={({ isActive }) =>
          `flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-bold transition ${
            isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'
          }`
        }
      >
        <Search className="w-5 h-5" />
        <span>Explore</span>
      </NavLink>

      <NavLink
        to="/customer/bookings"
        className={({ isActive }) =>
          `flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-bold transition ${
            isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'
          }`
        }
      >
        <CalendarCheck className="w-5 h-5" />
        <span>Bookings</span>
      </NavLink>

      <NavLink
        to="/customer/favorites"
        className={({ isActive }) =>
          `flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-bold transition relative ${
            isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'
          }`
        }
      >
        <Heart className="w-5 h-5" />
        <span>Saved</span>
        {favorites.length > 0 && (
          <span className="absolute top-0.5 right-1.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-rose-500 text-[9px] font-bold text-white">
            {favorites.length}
          </span>
        )}
      </NavLink>

      <NavLink
        to="/customer/profile"
        className={({ isActive }) =>
          `flex flex-col items-center gap-0.5 py-1 px-2 rounded-lg text-[10px] font-bold transition ${
            isActive ? 'text-blue-600' : 'text-slate-500 hover:text-slate-900'
          }`
        }
      >
        <User className="w-5 h-5" />
        <span>Profile</span>
      </NavLink>
    </nav>
  );
};
