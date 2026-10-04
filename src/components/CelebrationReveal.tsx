import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import {
  StoryConfig,
  UserSelections,
} from '../types/dateStory';
import { soundEngine } from '../utils/soundEngine';
import {
  Heart,
  Calendar,
  Ticket,
  Copy,
  RotateCcw,
  Check,
  MapPin,
  Clock,
  ShoppingCart,
  Waves,
  Download,
  Loader2,
  ArrowLeft,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';
import { downloadDatePassPdf } from '../utils/pdfGenerator';

interface CelebrationRevealProps {
  config: StoryConfig;
  selections: UserSelections;
  onRestart: () => void;
  onBackToCustomize?: () => void;
}

export const CelebrationReveal: React.FC<CelebrationRevealProps> = ({
  config,
  selections,
  onRestart,
  onBackToCustomize,
}) => {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const ticketRef = useRef<HTMLDivElement | null>(null);

  const formattedDayStr = (() => {
    if (selections.daySelectionLabel) {
      return selections.daySelectionLabel;
    }
    if (selections.daySelection && selections.daySelection.startsWith('day_')) {
      const parts = selections.daySelection.replace('day_', '').split('_');
      if (parts.length === 3) {
        const d = new Date(parseInt(parts[0]), parseInt(parts[1]), parseInt(parts[2]));
        const weekday = d.toLocaleDateString('en-US', { weekday: 'long' });
        const month = d.toLocaleDateString('en-US', { month: 'short' });
        const dateNum = d.getDate();
        const isWeekend = d.getDay() === 0 || d.getDay() === 6;
        return `${weekday}, ${month} ${dateNum} (${isWeekend ? 'Weekend' : 'Half-Day Leave'})`;
      }
    }
    const fallback = config.availableDays.find((d) => d.id === selections.daySelection);
    return fallback ? fallback.title : 'Any Weekend Afternoon (3:00 PM - 5:00 PM)';
  })();

  const cartActivityObjects = selections.cartActivities.map(
    (id) => config.dateCartActivities.find((a) => a.id === id)
  ).filter(Boolean);

  const handleConfettiShower = () => {
    soundEngine.playCelestialChime();
    confetti({
      particleCount: 75,
      spread: 65,
      origin: { y: 0.7 },
      colors: ['#fda4af', '#f43f5e', '#fbbf24', '#c084fc'],
    });
  };

  const handleCopySummary = () => {
    soundEngine.playClick();
    const cartSummary = cartActivityObjects.length > 0
      ? cartActivityObjects.map((a) => `${a?.emoji} ${a?.title}`).join(', ')
      : 'Just relaxing afternoon together';

    const timeSlotText = selections.timeSlot || '3:00 PM - 5:00 PM (Afternoon)';

    const message = `✨ Hey Gee! I said YES to our date! 🥰💕\n\n` +
      `🏨 Destination: ${config.venueName} - ${config.venueLocation}\n` +
      `⏰ Time: ${timeSlotText}\n` +
      `📅 Date Plan: ${formattedDayStr}\n` +
      `🛒 Extra Plans in Cart: ${cartSummary}\n` +
      (selections.specialWish ? `💌 Note for you: "${selections.specialWish}"\n\n` : '\n') +
      `Can't wait to spend the day with you! ❤️`;

    navigator.clipboard.writeText(message).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    });
  };

  // High-reliability PDF download with zero empty pages
  const handleDownloadPdf = async () => {
    if (isDownloading) return;
    soundEngine.playClick();
    setIsDownloading(true);

    let generatedSuccessfully = false;

    // 1. Try DOM screenshot of the visible on-screen ticket
    try {
      if (ticketRef.current) {
        const dataUrl = await toPng(ticketRef.current, {
          quality: 1,
          pixelRatio: 2.5,
          backgroundColor: '#0c080e',
          cacheBust: true,
        });

        // Ensure we got a real, non-empty image (real image dataUrl is > 10,000 characters)
        if (dataUrl && dataUrl.length > 10000) {
          const img = new Image();
          img.src = dataUrl;
          await new Promise((resolve) => {
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
          });

          if (img.width > 100 && img.height > 100) {
            const pdf = new jsPDF({
              orientation: img.width >= img.height ? 'landscape' : 'portrait',
              unit: 'px',
              format: [img.width, img.height],
            });

            pdf.addImage(dataUrl, 'PNG', 0, 0, img.width, img.height);
            pdf.save(`Date-Pass-${config.recipientName}-and-${config.senderName}.pdf`);
            generatedSuccessfully = true;
          }
        }
      }
    } catch (err) {
      console.warn('DOM capture attempt failed, using direct PDF generator', err);
    }

    // 2. If DOM capture did not produce a full image, use the rock-solid vector PDF generator
    if (!generatedSuccessfully) {
      try {
        const ok = downloadDatePassPdf(config, selections, formattedDayStr);
        if (ok) {
          generatedSuccessfully = true;
        }
      } catch (err) {
        console.error('Vector PDF generator failed, triggering print dialog', err);
      }
    }

    if (generatedSuccessfully) {
      soundEngine.playCelestialChime();
      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 3000);
    } else {
      window.print();
    }

    setIsDownloading(false);
  };

  const handleAddToCalendar = () => {
    soundEngine.playClick();

    const timeSlotStr = selections.timeSlot || '3:00 PM - 5:00 PM';
    const title = encodeURIComponent(`Date with ${config.senderName} at Marino Beach Hotel 💕`);
    const details = encodeURIComponent(
      `Special Date with Gee!\n` +
      `Venue: ${config.venueName}, ${config.venueLocation}\n` +
      `Timing: ${timeSlotStr}\n` +
      `Date Plan: ${formattedDayStr}\n` +
      (cartActivityObjects.length > 0
        ? `Extra Plans in Cart: ${cartActivityObjects.map((a) => a?.title).join(', ')}\n`
        : '') +
      (selections.specialWish ? `Note: ${selections.specialWish}\n` : '')
    );
    const location = encodeURIComponent(`${config.venueName}, Colombo, Sri Lanka`);

    let targetDate = new Date();
    if (selections.daySelection && selections.daySelection.startsWith('day_')) {
      const parts = selections.daySelection.replace('day_', '').split('_');
      if (parts.length === 3) {
        targetDate = new Date(parseInt(parts[0]), parseInt(parts[1]), parseInt(parts[2]));
      }
    } else {
      const dayOfWeek = targetDate.getDay();
      const daysUntilSat = (6 - dayOfWeek + 7) % 7 || 7;
      targetDate = new Date(targetDate.getTime() + daysUntilSat * 24 * 60 * 60 * 1000);
    }

    let startHour = 15;
    let startMin = 0;
    let endHour = 17;
    let endMin = 0;

    if (timeSlotStr.includes('12:00')) {
      startHour = 12; endHour = 14; endMin = 30;
    } else if (timeSlotStr.includes('10:30') || timeSlotStr.includes('Brunch')) {
      startHour = 10; startMin = 30; endHour = 13; endMin = 0;
    } else if (timeSlotStr.includes('Whole Day') || timeSlotStr.includes('11:00')) {
      startHour = 11; endHour = 17; endMin = 30;
    }

    targetDate.setHours(startHour, startMin, 0, 0);
    const startIso = targetDate.toISOString().replace(/-|:|\.\d\d\d/g, '');
    const endDate = new Date(targetDate.getTime() + (endHour - startHour) * 60 * 60 * 1000 + (endMin - startMin) * 60 * 1000);
    const endIso = endDate.toISOString().replace(/-|:|\.\d\d\d/g, '');

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&details=${details}&location=${location}&dates=${startIso}/${endIso}`;
    window.open(googleCalendarUrl, '_blank');
  };

  return (
    <div className="min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-4rem)] py-4 sm:py-6 px-3 sm:px-6 flex items-center justify-center">
      <div className="w-full max-w-3xl mx-auto flex flex-col items-center">
        {/* Top Header */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-4 sm:mb-6"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-[11px] sm:text-xs font-mono uppercase tracking-widest mb-2">
            <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/30" />
            <span>Date Officially Confirmed</span>
          </div>
          <h2 className="font-serif-romantic text-2xl sm:text-4xl text-stone-100 font-light tracking-tight text-balance">
            It's a date, {config.recipientName}!
          </h2>
          <p className="mt-1 text-xs text-stone-400 max-w-md mx-auto font-light px-2">
            Here is your official digital date pass. Tap download to save your PDF pass, copy the WhatsApp RSVP to send to Gee, or add to your calendar!
          </p>
        </motion.div>

        {/* The Golden Ticket / Boarding Pass (On-Screen View) */}
        <motion.div
          ref={ticketRef}
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full bg-gradient-to-b from-stone-900 via-stone-900 to-stone-950 border border-rose-500/30 rounded-2xl shadow-2xl shadow-rose-950/50 relative overflow-hidden"
        >
          {/* Top Bar */}
          <div className="h-1.5 w-full bg-gradient-to-r from-rose-500 via-pink-400 to-amber-400" />

          {/* Ticket Header */}
          <div className="p-4 sm:p-6 border-b border-rose-500/15 flex flex-wrap items-center justify-between gap-2.5">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center shrink-0">
                <Ticket className="w-5 h-5 text-rose-400" />
              </div>
              <div>
                <span className="text-[9px] font-mono tracking-widest text-rose-300/80 uppercase block">
                  DATE PASS · {config.recipientName.toUpperCase()} & {config.senderName.toUpperCase()}
                </span>
                <h3 className="font-serif-romantic text-lg sm:text-xl text-stone-100 font-medium">
                  Afternoon Date & Ocean Breeze
                </h3>
              </div>
            </div>

            <div className="text-right">
              <span className="text-[9px] sm:text-[10px] font-mono text-stone-500 uppercase block tracking-wider">
                Status
              </span>
              <span className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-semibold text-emerald-400 bg-emerald-950/50 border border-emerald-500/40 px-2.5 py-0.5 rounded-full font-mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                CONFIRMED
              </span>
            </div>
          </div>

          {/* Ticket Body Grid */}
          <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-4 relative">
            {/* Left Column */}
            <div className="space-y-3">
              <div>
                <span className="text-[10px] uppercase font-mono tracking-wider text-rose-300/70 block flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-rose-400" />
                  Date Destination
                </span>
                <span className="font-serif-romantic text-lg text-stone-100 font-medium block">
                  {config.venueName}
                </span>
                <span className="text-xs text-stone-400 font-light block">
                  {config.venueLocation} · Rooftop sea view & ocean breeze
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-0.5">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-rose-300/70 block flex items-center gap-1">
                    <Clock className="w-3 h-3 text-rose-400" />
                    Timing
                  </span>
                  <span className="font-medium text-xs text-stone-200 block truncate" title={selections.timeSlot || '3:00 PM - 5:00 PM'}>
                    {selections.timeSlot || '3:00 PM - 5:00 PM'}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-mono tracking-wider text-rose-300/70 block flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-rose-400" />
                    Date Selection
                  </span>
                  <span className="font-medium text-xs text-rose-200 block truncate" title={formattedDayStr}>
                    {formattedDayStr}
                  </span>
                </div>
              </div>

              <div className="pt-0.5">
                <span className="text-[10px] uppercase font-mono tracking-wider text-rose-300/70 block flex items-center gap-1">
                  <Waves className="w-3 h-3 text-rose-400" />
                  Experience
                </span>
                <span className="font-medium text-xs text-stone-200 block">
                  Afternoon treats, sea breeze, and our custom plans
                </span>
              </div>

              {/* Extra Plans Added to Cart */}
              <div className="pt-1">
                <span className="text-[10px] uppercase font-mono tracking-wider text-rose-300/70 block flex items-center gap-1 mb-1">
                  <ShoppingCart className="w-3 h-3 text-rose-400" />
                  Extra Plans in Date Cart ({cartActivityObjects.length})
                </span>
                {cartActivityObjects.length > 0 ? (
                  <div className="flex flex-wrap gap-1.5">
                    {cartActivityObjects.map((act) => (
                      <span
                        key={act?.id}
                        className="px-2 py-0.5 rounded-lg bg-rose-500/10 border border-rose-500/25 text-rose-200 text-xs font-medium flex items-center gap-1"
                      >
                        <span>{act?.emoji}</span>
                        <span>{act?.title}</span>
                      </span>
                    ))}
                  </div>
                ) : (
                  <span className="text-xs text-stone-400 font-light">
                    Just relaxing afternoon together
                  </span>
                )}
              </div>

              {selections.specialWish && (
                <div className="p-2.5 rounded-xl bg-stone-950/60 border border-rose-500/15 text-xs text-stone-300 font-light">
                  <span className="text-[10px] uppercase font-mono text-rose-400/80 block mb-0.5">
                    Cham's Note to Gee:
                  </span>
                  "{selections.specialWish}"
                </div>
              )}
            </div>

            {/* Right Column: Tear-off Stub */}
            <div className="flex flex-col justify-between border-t md:border-t-0 md:border-l border-rose-500/15 pt-3 md:pt-0 md:pl-5">
              <div className="space-y-2">
                <div className="text-xs text-stone-400 font-light leading-relaxed">
                  <span className="font-serif-romantic text-base text-rose-200 block font-medium mb-0.5">
                    "Reserved With All My Love"
                  </span>
                  Admit Two: Cham & Gee. Smiles, sweet treats, ocean views, and the happiest afternoon!
                </div>

                <div className="p-2.5 rounded-xl bg-stone-950/80 border border-stone-800 text-[10px] font-mono text-stone-400 space-y-1">
                  <div className="flex justify-between">
                    <span>NIGHT TIME:</span>
                    <span className="text-emerald-400 font-semibold">
                      {selections.timeSlot?.includes('Whole Day') ? 'NO (DAYTIME / SUNSET)' : 'NO (AFTERNOON ONLY)'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>HOTEL:</span>
                    <span className="text-rose-300">MARINO BEACH</span>
                  </div>
                  <div className="flex justify-between">
                    <span>HAPPINESS:</span>
                    <span className="text-rose-300">GUARANTEED</span>
                  </div>
                </div>
              </div>

              {/* Barcode Graphic */}
              <div className="mt-3 pt-2.5 border-t border-stone-800 flex flex-col items-center">
                <div className="flex items-center gap-1 h-6 sm:h-7 opacity-80 mb-0.5">
                  {[2, 4, 1, 3, 5, 2, 1, 4, 3, 2, 5, 1, 4, 2, 3, 4, 1, 5, 2, 3, 1, 4, 2].map((w, i) => (
                    <div
                      key={i}
                      className="bg-stone-400 h-full"
                      style={{ width: `${w * 1.5}px` }}
                    />
                  ))}
                </div>
                <span className="font-mono text-[9px] tracking-widest text-stone-500 uppercase">
                  CHAM-AND-GEE · DATE-PASS
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Action Controls */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-center gap-2.5 mt-5">
          {/* Direct PDF Download Button */}
          <button
            onClick={handleDownloadPdf}
            disabled={isDownloading}
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-gradient-to-r from-amber-400 via-rose-400 to-pink-500 hover:from-amber-300 hover:to-pink-400 text-stone-950 text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-lg shadow-rose-950/40 flex items-center justify-center gap-2 cursor-pointer min-h-[44px] active:scale-98 disabled:opacity-75"
          >
            {isDownloading ? (
              <>
                <Loader2 className="w-4 h-4 text-stone-950 animate-spin" />
                <span>Preparing PDF...</span>
              </>
            ) : downloadSuccess ? (
              <>
                <Check className="w-4 h-4 text-stone-950" />
                <span>PDF Downloaded!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-stone-950" />
                <span>Download Date Pass (PDF)</span>
              </>
            )}
          </button>

          {/* Copy WhatsApp Button */}
          <button
            onClick={handleCopySummary}
            className="w-full sm:w-auto px-5 py-3 rounded-xl bg-rose-500 hover:bg-rose-400 text-stone-950 text-xs sm:text-sm font-semibold tracking-wide transition-all shadow-md shadow-rose-900/40 flex items-center justify-center gap-2 cursor-pointer min-h-[44px] active:scale-98"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-stone-950" />
                <span>Copied! Send to Gee on WhatsApp</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-stone-950" />
                <span>Copy WhatsApp RSVP</span>
              </>
            )}
          </button>

          {/* Add to Calendar Button */}
          <button
            onClick={handleAddToCalendar}
            className="w-full sm:w-auto px-4 py-3 rounded-xl bg-stone-900 hover:bg-stone-800 border border-stone-700 text-stone-200 text-xs font-medium transition-all flex items-center justify-center gap-2 cursor-pointer min-h-[44px]"
          >
            <Calendar className="w-4 h-4 text-rose-400" />
            <span>Add to Calendar</span>
          </button>

          {/* Secondary Controls with Previous Button */}
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {onBackToCustomize && (
              <button
                onClick={onBackToCustomize}
                className="px-3.5 py-3 rounded-xl bg-stone-900/80 hover:bg-stone-800 border border-stone-800 text-stone-300 hover:text-white text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px]"
                title="Edit date details"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-rose-400" />
                <span>Previous</span>
              </button>
            )}

            <button
              onClick={handleConfettiShower}
              className="flex-1 sm:flex-none px-3.5 py-3 rounded-xl bg-stone-900/80 hover:bg-stone-800 border border-stone-800 text-stone-300 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px]"
            >
              <Heart className="w-4 h-4 text-pink-400 fill-pink-400/30" />
              <span>Celebrate</span>
            </button>

            <button
              onClick={onRestart}
              className="px-3.5 py-3 rounded-xl bg-stone-900/50 hover:bg-stone-800 text-stone-400 hover:text-stone-200 text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer min-h-[44px]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restart</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
