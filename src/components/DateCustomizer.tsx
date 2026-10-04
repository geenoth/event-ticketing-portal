import React, { useState, useMemo, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  StoryConfig,
  UserSelections,
} from '../types/dateStory';
import { soundEngine } from '../utils/soundEngine';
import {
  Heart,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  HeartHandshake,
  ShoppingCart,
  Plus,
  Check,
  Calendar as CalendarIcon,
  Sun,
  Briefcase,
  MessageCircle,
  Clock,
  Hotel,
  MapPin,
} from 'lucide-react';

interface DateCustomizerProps {
  recipientName: string;
  senderName: string;
  config: StoryConfig;
  initialSelections: UserSelections;
  onConfirmSelections: (selections: UserSelections) => void;
  onBackToQuestion?: () => void;
}

interface CalendarDayOption {
  id: string;
  fullDateStr: string;
  dayName: string;
  dayNumber: number;
  monthName: string;
  isWeekend: boolean;
  typeLabel: string;
}

const TIME_OPTIONS = [
  {
    id: 'afternoon',
    name: 'Afternoon',
    icon: '☀️',
    time: '3:00 PM - 5:00 PM',
    label: '3:00 PM - 5:00 PM (Afternoon)',
  },
  {
    id: 'lunch',
    name: 'Lunch / Noon',
    icon: '🥪',
    time: '12:00 PM - 2:30 PM',
    label: '12:00 PM - 2:30 PM (Lunch)',
  },
  {
    id: 'brunch',
    name: 'Morning Brunch',
    icon: '☕',
    time: '10:30 AM - 1:00 PM',
    label: '10:30 AM - 1:00 PM (Brunch)',
  },
  {
    id: 'wholeday',
    name: 'Whole Day',
    icon: '🌟',
    time: '11:00 AM - 5:30 PM',
    label: '11:00 AM - 5:30 PM (Whole Day)',
  },
];

export const DateCustomizer: React.FC<DateCustomizerProps> = ({
  recipientName,
  senderName,
  config,
  initialSelections,
  onConfirmSelections,
  onBackToQuestion,
}) => {
  const [selections, setSelections] = useState<UserSelections>({
    ...initialSelections,
    timeSlot: initialSelections.timeSlot || '3:00 PM - 5:00 PM (Afternoon)',
  });
  const [activeTab, setActiveTab] = useState<'schedule' | 'cart' | 'note'>('schedule');
  const [showCustomTimeInput, setShowCustomTimeInput] = useState(false);
  const [customTimeVal, setCustomTimeVal] = useState('');

  // Automatically scroll to top whenever tab changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [activeTab]);

  // Generate the next 14 days dynamically from today
  const next14Days = useMemo<CalendarDayOption[]>(() => {
    const days: CalendarDayOption[] = [];
    const today = new Date();

    for (let i = 0; i < 14; i++) {
      const d = new Date();
      d.setDate(today.getDate() + i);

      const dayOfWeek = d.getDay(); // 0 is Sunday, 6 is Saturday
      const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const monthName = d.toLocaleDateString('en-US', { month: 'short' });
      const dayNumber = d.getDate();

      const weekdayLong = d.toLocaleDateString('en-US', { weekday: 'long' });
      const fullDateStr = `${weekdayLong}, ${monthName} ${dayNumber}`;
      const id = `day_${d.getFullYear()}_${d.getMonth()}_${dayNumber}`;

      days.push({
        id,
        fullDateStr,
        dayName,
        dayNumber,
        monthName,
        isWeekend,
        typeLabel: isWeekend ? 'Weekend (Free Day)' : 'Weekday (Half-Day)',
      });
    }
    return days;
  }, []);

  const handleSelectFlexible = (
    typeId: string,
    label: string,
    dayType: 'weekend' | 'weekday_half' | 'flexible'
  ) => {
    soundEngine.playCelestialChime();
    setSelections((prev) => ({
      ...prev,
      daySelection: typeId,
      daySelectionLabel: label,
      dayType,
    }));
  };

  const handleSelectCalendarDay = (day: CalendarDayOption) => {
    soundEngine.playCelestialChime();
    setSelections((prev) => ({
      ...prev,
      daySelection: day.id,
      daySelectionLabel: `${day.fullDateStr} (${day.typeLabel})`,
      dayType: day.isWeekend ? 'weekend' : 'weekday_half',
    }));
  };

  const handleSelectTime = (slotLabel: string) => {
    soundEngine.playClick();
    setShowCustomTimeInput(false);
    setSelections((prev) => ({
      ...prev,
      timeSlot: slotLabel,
    }));
  };

  const handleToggleCartActivity = (activityId: string) => {
    soundEngine.playDodgingPop();
    setSelections((prev) => {
      const exists = prev.cartActivities.includes(activityId);
      const updated = exists
        ? prev.cartActivities.filter((id) => id !== activityId)
        : [...prev.cartActivities, activityId];
      return { ...prev, cartActivities: updated };
    });
  };

  const handleConfirm = () => {
    soundEngine.playYesCelebration();
    onConfirmSelections({
      ...selections,
      acceptedAt: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    });
  };

  const currentDayLabel =
    selections.daySelectionLabel ||
    'Any Weekend Afternoon (Saturday or Sunday)';

  const currentTimeLabel =
    selections.timeSlot || '3:00 PM - 5:00 PM (Afternoon)';

  return (
    <div className="min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-4rem)] py-4 sm:py-6 px-3 sm:px-6">
      <div className="max-w-2xl mx-auto flex flex-col items-center">
        {/* Simple & Clean Header */}
        <div className="text-center mb-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[11px] font-mono mb-1.5">
            <Heart className="w-3 h-3 text-rose-400 fill-rose-400/40" />
            <span>Step 4 · Our Date Plans</span>
          </div>
          <h2 className="font-serif-romantic text-2xl sm:text-3xl text-stone-100 font-medium">
            Plan Our Date 🌅
          </h2>
          <div className="inline-flex items-center justify-center gap-2 mt-1 px-3 py-1 rounded-full bg-stone-900/90 border border-rose-500/20 text-xs text-stone-300">
            <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span className="font-medium text-stone-100">Marino Beach Hotel – Colombo</span>
            <span className="text-stone-500">·</span>
            <span className="text-stone-400">Rooftop Sea View</span>
          </div>
        </div>

        {/* Streamlined Category Tabs */}
        <div className="w-full flex items-center justify-between p-1 bg-stone-900/90 border border-stone-800 rounded-xl mb-4">
          <button
            onClick={() => setActiveTab('schedule')}
            className={`flex-1 py-2 px-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[38px] ${
              activeTab === 'schedule'
                ? 'bg-rose-500 text-stone-950 font-semibold shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5 shrink-0" />
            <span>1. When & Time</span>
          </button>

          <button
            onClick={() => setActiveTab('cart')}
            className={`flex-1 py-2 px-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[38px] ${
              activeTab === 'cart'
                ? 'bg-rose-500 text-stone-950 font-semibold shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5 shrink-0" />
            <span>2. Extra Plans ({selections.cartActivities.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('note')}
            className={`flex-1 py-2 px-2 rounded-lg text-xs font-medium transition-all flex items-center justify-center gap-1.5 cursor-pointer min-h-[38px] ${
              activeTab === 'note'
                ? 'bg-rose-500 text-stone-950 font-semibold shadow-sm'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5 shrink-0" />
            <span>3. Note</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="w-full">
          {/* TAB 1: WHEN & TIME */}
          {activeTab === 'schedule' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              {/* Quick Choice Buttons for Days */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() =>
                    handleSelectFlexible(
                      'flexible_weekend',
                      'Any Weekend (Saturday or Sunday)',
                      'weekend'
                    )
                  }
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer active:scale-98 ${
                    selections.daySelection === 'flexible_weekend'
                      ? 'bg-rose-950/70 border-rose-400 ring-1 ring-rose-400 text-stone-100'
                      : 'bg-stone-900/80 hover:bg-stone-850 border-stone-800 text-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono text-amber-300 bg-amber-950/70 px-1.5 py-0.5 rounded flex items-center gap-1 font-semibold">
                      <Sun className="w-2.5 h-2.5" />
                      <span>Weekend</span>
                    </span>
                    {selections.daySelection === 'flexible_weekend' && (
                      <CheckCircle2 className="w-4 h-4 text-rose-400" />
                    )}
                  </div>
                  <div className="font-medium text-xs text-stone-100">Any Weekend</div>
                  <div className="text-[11px] text-stone-400 font-light">Saturday or Sunday</div>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleSelectFlexible(
                      'flexible_halfday',
                      'Weekday (Half-Day Leave)',
                      'weekday_half'
                    )
                  }
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer active:scale-98 ${
                    selections.daySelection === 'flexible_halfday'
                      ? 'bg-rose-950/70 border-rose-400 ring-1 ring-rose-400 text-stone-100'
                      : 'bg-stone-900/80 hover:bg-stone-850 border-stone-800 text-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono text-rose-300 bg-rose-950/70 px-1.5 py-0.5 rounded flex items-center gap-1 font-semibold">
                      <Briefcase className="w-2.5 h-2.5" />
                      <span>Weekday</span>
                    </span>
                    {selections.daySelection === 'flexible_halfday' && (
                      <CheckCircle2 className="w-4 h-4 text-rose-400" />
                    )}
                  </div>
                  <div className="font-medium text-xs text-stone-100">Weekday Half-Day</div>
                  <div className="text-[11px] text-stone-400 font-light">Take a half-day off</div>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleSelectFlexible(
                      'flexible_chat',
                      'Flexible Date (Deciding on Chat)',
                      'flexible'
                    )
                  }
                  className={`p-3 rounded-xl border text-left transition-all cursor-pointer active:scale-98 ${
                    selections.daySelection === 'flexible_chat'
                      ? 'bg-rose-950/70 border-rose-400 ring-1 ring-rose-400 text-stone-100'
                      : 'bg-stone-900/80 hover:bg-stone-850 border-stone-800 text-stone-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono text-emerald-300 bg-emerald-950/70 px-1.5 py-0.5 rounded flex items-center gap-1 font-semibold">
                      <MessageCircle className="w-2.5 h-2.5" />
                      <span>Chat</span>
                    </span>
                    {selections.daySelection === 'flexible_chat' && (
                      <CheckCircle2 className="w-4 h-4 text-rose-400" />
                    )}
                  </div>
                  <div className="font-medium text-xs text-stone-100">Decide Together</div>
                  <div className="text-[11px] text-stone-400 font-light">Pick day over chat later</div>
                </button>
              </div>

              {/* 14-Day Calendar (Clean horizontal pill rail) */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono text-stone-400 uppercase tracking-wider">
                    Or pick an exact date:
                  </span>
                  <span className="text-[10px] text-amber-300 font-mono">
                    Gold = Weekend
                  </span>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2 pt-0.5 snap-x scrollbar-none">
                  {next14Days.map((day) => {
                    const isSelected = selections.daySelection === day.id;
                    return (
                      <button
                        key={day.id}
                        type="button"
                        onClick={() => handleSelectCalendarDay(day)}
                        className={`min-w-[72px] sm:min-w-[76px] p-2 rounded-xl border transition-all flex flex-col items-center justify-between snap-center cursor-pointer active:scale-95 ${
                          isSelected
                            ? 'bg-rose-950/90 border-rose-400 shadow-md ring-2 ring-rose-400 text-rose-100'
                            : day.isWeekend
                            ? 'bg-stone-900/90 border-amber-500/30 text-stone-200'
                            : 'bg-stone-900/80 border-stone-800 text-stone-400'
                        }`}
                      >
                        <span className="text-[10px] font-mono uppercase font-semibold">
                          {day.dayName}
                        </span>
                        <span
                          className={`text-xl font-serif-romantic font-bold my-0.5 ${
                            isSelected ? 'text-rose-200' : 'text-stone-100'
                          }`}
                        >
                          {day.dayNumber}
                        </span>
                        <span className="text-[9px] font-mono uppercase text-stone-500">
                          {day.monthName}
                        </span>
                        <div className="mt-1 pt-1 border-t border-stone-800 w-full text-center">
                          {day.isWeekend ? (
                            <span className="text-[8px] font-mono text-amber-300 font-medium">
                              Weekend
                            </span>
                          ) : (
                            <span className="text-[8px] font-mono text-rose-300/80">
                              Half-Day
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* TIMING PREFERENCE (Customized Time UI) */}
              <div className="p-3 rounded-2xl bg-stone-900/80 border border-stone-800/90">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-rose-300 flex items-center gap-1.5 font-semibold">
                    <Clock className="w-3.5 h-3.5 text-rose-400" />
                    <span>Time Preference</span>
                  </span>
                  <span className="text-[10px] text-stone-400 font-mono">
                    Tap to change
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {TIME_OPTIONS.map((opt) => {
                    const isSelected = currentTimeLabel === opt.label;
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleSelectTime(opt.label)}
                        className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between active:scale-95 ${
                          isSelected
                            ? 'bg-rose-950/80 border-rose-400 ring-1 ring-rose-400 text-rose-100 shadow-sm'
                            : 'bg-stone-900/90 hover:bg-stone-850 border-stone-800 text-stone-300'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[11px] font-medium text-stone-100 flex items-center gap-1">
                            <span>{opt.icon}</span>
                            <span>{opt.name}</span>
                          </span>
                          {isSelected && <Check className="w-3.5 h-3.5 text-rose-400" />}
                        </div>
                        <span className="text-[10px] font-mono text-stone-400">
                          {opt.time}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* Other / Custom Time Option */}
                <div className="mt-2 pt-2 border-t border-stone-800/70 flex flex-col gap-1.5">
                  <button
                    type="button"
                    onClick={() => setShowCustomTimeInput(!showCustomTimeInput)}
                    className="text-[11px] text-stone-400 hover:text-rose-300 font-mono flex items-center gap-1 cursor-pointer transition-colors text-left"
                  >
                    <span>✏️ Need different hours? Tap to type custom time</span>
                  </button>

                  {showCustomTimeInput && (
                    <div className="flex items-center gap-2 mt-1">
                      <input
                        type="text"
                        placeholder="e.g. 2:00 PM - 4:30 PM, or Anytime after 1 PM"
                        value={customTimeVal}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCustomTimeVal(val);
                          setSelections((prev) => ({
                            ...prev,
                            timeSlot: val ? `${val} (Custom Time)` : '3:00 PM - 5:00 PM (Afternoon)',
                          }));
                        }}
                        className="flex-1 px-3 py-1.5 rounded-xl bg-stone-950 border border-rose-500/30 text-xs text-stone-200 focus:outline-none focus:border-rose-400 placeholder:text-stone-600"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Clean Active Selection Pill */}
              <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-300 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-rose-400 block">
                    Your Date Schedule:
                  </span>
                  <span className="font-medium text-stone-100 block">
                    {currentDayLabel}
                  </span>
                </div>
                <div className="text-right shrink-0 ml-2">
                  <span className="text-[10px] font-mono text-stone-500 block uppercase">
                    Time:
                  </span>
                  <span className="text-[11px] text-amber-300 font-mono font-medium">
                    {currentTimeLabel}
                  </span>
                </div>
              </div>
            </motion.div>
          )}

          {/* TAB 2: EXTRA PLANS (CART) */}
          {activeTab === 'cart' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-2.5"
            >
              <div className="p-2.5 rounded-xl bg-stone-900/90 border border-stone-800 text-center text-xs text-stone-300">
                Tap any plan below to add it to our date at Marino Beach Hotel:
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {config.dateCartActivities.map((act) => {
                  const isInCart = selections.cartActivities.includes(act.id);
                  return (
                    <div
                      key={act.id}
                      onClick={() => handleToggleCartActivity(act.id)}
                      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between active:scale-98 ${
                        isInCart
                          ? 'bg-rose-950/40 border-rose-400 ring-1 ring-rose-400/40'
                          : 'bg-stone-900/70 hover:bg-stone-850 border-stone-800'
                      }`}
                    >
                      <div className="flex items-center gap-2.5 min-w-0 pr-2">
                        <span className="text-xl shrink-0">{act.emoji}</span>
                        <div className="min-w-0">
                          <div className="font-medium text-xs text-stone-100 truncate">
                            {act.title}
                          </div>
                          <div className="text-[11px] text-stone-400 font-light truncate">
                            {act.subtitle}
                          </div>
                        </div>
                      </div>

                      <button
                        type="button"
                        className={`p-1.5 rounded-lg text-xs font-mono shrink-0 ${
                          isInCart
                            ? 'bg-rose-500 text-stone-950 font-bold'
                            : 'bg-stone-800 text-stone-400'
                        }`}
                      >
                        {isInCart ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* TAB 3: NOTE TO GEE */}
          {activeTab === 'note' && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3 bg-stone-900/70 border border-stone-800 rounded-xl p-4"
            >
              <div>
                <label className="block text-xs uppercase tracking-wider text-rose-300/90 mb-1 font-mono">
                  Anything special you want {senderName} to know? (Optional)
                </label>
                <textarea
                  rows={3}
                  value={selections.specialWish}
                  onChange={(e) => setSelections({ ...selections, specialWish: e.target.value })}
                  placeholder="e.g. Bring me a chocolate treat, or take lots of cute photos of us by the pool!"
                  className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-200 text-xs focus:outline-none focus:border-rose-500/60 resize-none leading-relaxed"
                />
              </div>

              <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 text-xs text-stone-300 space-y-1">
                <span className="font-medium text-rose-300 block mb-1">Date Itinerary Summary:</span>
                <p className="flex items-center gap-1.5">
                  <Hotel className="w-3.5 h-3.5 text-rose-400" />
                  <span><strong>Venue:</strong> {config.venueName}, {config.venueLocation}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-amber-400" />
                  <span><strong>Timing:</strong> {currentTimeLabel}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <CalendarIcon className="w-3.5 h-3.5 text-rose-400" />
                  <span><strong>Schedule:</strong> {currentDayLabel}</span>
                </p>
                <p className="flex items-center gap-1.5">
                  <ShoppingCart className="w-3.5 h-3.5 text-pink-400" />
                  <span><strong>Extra Plans:</strong> {selections.cartActivities.length} added</span>
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Bottom Actions Bar */}
        <div className="w-full mt-5 pt-4 border-t border-rose-500/15 flex items-center justify-between gap-2.5">
          <button
            type="button"
            onClick={() => {
              soundEngine.playClick();
              if (activeTab === 'note') {
                setActiveTab('cart');
              } else if (activeTab === 'cart') {
                setActiveTab('schedule');
              } else if (onBackToQuestion) {
                onBackToQuestion();
              }
            }}
            className="px-3.5 sm:px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white border border-stone-800 text-xs font-medium transition-all flex items-center gap-1.5 cursor-pointer min-h-[42px] active:scale-95 shrink-0"
            aria-label="Previous step"
          >
            <ArrowLeft className="w-3.5 h-3.5 text-rose-400" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-2">
            {activeTab !== 'note' ? (
              <button
                onClick={() => {
                  soundEngine.playClick();
                  if (activeTab === 'schedule') setActiveTab('cart');
                  else if (activeTab === 'cart') setActiveTab('note');
                }}
                className="px-5 py-2.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer min-h-[42px]"
              >
                <span>Next</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            ) : (
              <button
                onClick={handleConfirm}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-400 hover:to-pink-500 text-stone-950 text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-lg shadow-rose-900/40 flex items-center gap-1.5 cursor-pointer min-h-[42px]"
              >
                <HeartHandshake className="w-4 h-4 text-stone-950" />
                <span>Issue Date Pass 💕</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
