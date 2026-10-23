import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Lock, Unlock, DollarSign } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { PriceDisplay } from '../../components/common/PriceDisplay';

export const OwnerCalendarPage: React.FC = () => {
  const { currentUser, businesses, rooms, addToast } = useApp();

  const myRooms = rooms;
  const [selectedRoomId, setSelectedRoomId] = useState(myRooms[0]?.id || '');
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  // State of blocked days for demo
  const [blockedDays, setBlockedDays] = useState<number[]>([12, 13, 14]);
  const [customPriceDays, setCustomPriceDays] = useState<{ [day: number]: number }>({
    20: 75,
    21: 75,
  });

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();

  const selectedRoom = myRooms.find((r) => r.id === selectedRoomId) || myRooms[0];

  const handleToggleBlock = (day: number) => {
    if (blockedDays.includes(day)) {
      setBlockedDays(blockedDays.filter((d) => d !== day));
      addToast('Date Unblocked', `Day ${day} opened for reservations`, 'success');
    } else {
      setBlockedDays([...blockedDays, day]);
      addToast('Date Blocked', `Day ${day} marked closed / maintenance`, 'info');
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
            Availability & Pricing Calendar
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Click any date cell to toggle availability lock or manage holiday rate surges.
          </p>
        </div>

        {/* Room Selector */}
        <select
          value={selectedRoomId}
          onChange={(e) => setSelectedRoomId(e.target.value)}
          className="px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800"
        >
          {myRooms.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name} (${r.basePrice}/night)
            </option>
          ))}
        </select>
      </div>

      {/* Calendar Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs">
        {/* Month Navigation */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-bold text-slate-900">
              {monthNames[currentMonth]} {currentYear}
            </h2>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handlePrevMonth}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextMonth}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days of Week */}
        <div className="grid grid-cols-7 gap-2 text-center text-xs font-bold text-slate-400 py-3 uppercase tracking-wider text-[10px]">
          <div>Sun</div>
          <div>Mon</div>
          <div>Tue</div>
          <div>Wed</div>
          <div>Thu</div>
          <div>Fri</div>
          <div>Sat</div>
        </div>

        {/* Grid Cells */}
        <div className="grid grid-cols-7 gap-2">
          {/* Empty prefix slots */}
          {Array.from({ length: firstDayIndex }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-20 rounded-2xl bg-slate-50/50" />
          ))}

          {/* Days */}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const isBlocked = blockedDays.includes(day);
            const rate = customPriceDays[day] || selectedRoom?.basePrice || 45;

            return (
              <button
                key={`day-${day}`}
                onClick={() => handleToggleBlock(day)}
                className={`min-h-20 p-2.5 rounded-2xl border text-left transition flex flex-col justify-between cursor-pointer ${
                  isBlocked
                    ? 'bg-slate-100 border-slate-200 text-slate-400 opacity-60'
                    : 'bg-white hover:border-emerald-500 hover:shadow-xs border-slate-150'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`text-xs font-bold ${isBlocked ? 'text-slate-400' : 'text-slate-800'}`}>
                    {day}
                  </span>
                  {isBlocked ? (
                    <Lock className="w-3 h-3 text-slate-400" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  )}
                </div>

                <div className="text-[11px] font-bold">
                  {isBlocked ? (
                    <span className="text-slate-400 text-[9px] uppercase">Blocked</span>
                  ) : (
                    <span className="text-emerald-700 font-mono">${rate}</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
