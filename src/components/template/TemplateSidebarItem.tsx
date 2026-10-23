import React from 'react';
import { NavLink } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

interface TemplateSidebarItemProps {
  to: string;
  label: string;
  icon: LucideIcon;
  badge?: number | string;
  badgeVariant?: 'blue' | 'amber' | 'emerald';
  onClick?: () => void;
  end?: boolean;
  isCollapsed?: boolean;
}

export const TemplateSidebarItem: React.FC<TemplateSidebarItemProps> = ({
  to,
  label,
  icon: Icon,
  badge,
  badgeVariant = 'blue',
  onClick,
  end = false,
  isCollapsed = false,
}) => {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      title={isCollapsed ? label : undefined}
      className={({ isActive }) =>
        `group relative flex items-center transition-all ${
          isCollapsed
            ? `justify-center p-3.5 mx-2.5 rounded-2xl ${
                isActive
                  ? 'bg-white text-[#0B63F6] shadow-md z-10'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`
            : `gap-3.5 py-3.5 px-5 text-sm font-bold ${
                isActive
                  ? 'bg-white text-[#0B63F6] rounded-l-[28px] ml-4 mr-0 shadow-xs z-10'
                  : 'text-white/80 hover:text-white hover:bg-white/10 rounded-2xl mx-4'
              }`
        }`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && !isCollapsed && (
            <>
              {/* Concave fillet top right */}
              <svg
                className="absolute -top-5 right-0 w-5 h-5 text-white fill-current pointer-events-none"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M20,0 L20,20 L0,20 C11.0457,20 20,11.0457 20,0 Z" />
              </svg>
              {/* Concave fillet bottom right */}
              <svg
                className="absolute -bottom-5 right-0 w-5 h-5 text-white fill-current pointer-events-none"
                viewBox="0 0 20 20"
                aria-hidden="true"
              >
                <path d="M20,20 L20,0 L0,0 C11.0457,0 20,8.9543 20,20 Z" />
              </svg>
            </>
          )}

          <Icon
            className={`w-5 h-5 shrink-0 transition-colors ${
              isActive ? 'text-[#0B63F6]' : 'text-white/80 group-hover:text-white'
            }`}
          />
          {!isCollapsed && <span className="truncate">{label}</span>}

          {!isCollapsed && badge !== undefined && badge !== 0 && (
            <span
              className={`ml-auto text-[10px] font-black px-2 py-0.5 rounded-full ${
                isActive
                  ? 'bg-blue-100 text-[#0B63F6]'
                  : badgeVariant === 'amber'
                  ? 'bg-amber-400 text-slate-900'
                  : 'bg-white/20 text-white'
              }`}
            >
              {badge}
            </span>
          )}

          {isCollapsed && badge !== undefined && badge !== 0 && (
            <span className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-amber-400 ring-2 ring-[#0B63F6]" />
          )}
        </>
      )}
    </NavLink>
  );
};
