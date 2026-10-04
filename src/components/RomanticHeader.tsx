import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX, Lock, Menu, X, Heart } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

interface RomanticHeaderProps {
  recipientName: string;
  senderName: string;
  activeChapter: number;
  maxUnlockedChapter: number;
  totalChapters: number;
  chapterTitles: string[];
  onSelectChapter: (index: number) => void;
}

export const RomanticHeader: React.FC<RomanticHeaderProps> = ({
  recipientName,
  senderName,
  activeChapter,
  maxUnlockedChapter,
  totalChapters,
  chapterTitles,
  onSelectChapter,
}) => {
  const [muted, setMuted] = useState(soundEngine.getMuted());
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleToggleSound = () => {
    const nextMuted = soundEngine.toggleMute();
    setMuted(nextMuted);
  };

  const handleStepClick = (idx: number) => {
    if (idx > maxUnlockedChapter) {
      soundEngine.playDodgingPop();
      return;
    }
    soundEngine.playCelestialChime();
    onSelectChapter(idx);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-stone-950/90 border-b border-rose-500/10 transition-colors">
        <div className="max-w-6xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
          {/* Zone 1: Single text wordmark */}
          <div className="flex items-center gap-2 shrink truncate">
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400/50 animate-pulse shrink-0" />
            <span className="font-serif-romantic text-base sm:text-xl font-medium tracking-wide text-rose-200/95 truncate">
              {`To ${recipientName}, From ${senderName}`}
            </span>
          </div>

          {/* Zone 2 (Desktop): Navigation links */}
          <nav className="hidden md:flex items-center gap-5 text-xs tracking-wider uppercase">
            {chapterTitles.map((title, idx) => {
              const isActive = activeChapter === idx;
              const isCompleted = activeChapter > idx;
              const isLocked = idx > maxUnlockedChapter;

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleStepClick(idx)}
                  disabled={isLocked}
                  title={isLocked ? 'Step is locked · Follow step by step!' : title}
                  className={`transition-all flex items-center gap-1.5 whitespace-nowrap ${
                    isLocked
                      ? 'text-stone-700 cursor-not-allowed opacity-60'
                      : isActive
                      ? 'text-rose-300 font-semibold cursor-pointer'
                      : isCompleted
                      ? 'text-stone-400 hover:text-stone-200 cursor-pointer'
                      : 'text-stone-500 hover:text-stone-400 cursor-pointer'
                  }`}
                >
                  <span className="font-mono text-[10px] opacity-70">0{idx + 1}.</span>
                  <span>{title}</span>
                  {isLocked && <Lock className="w-3 h-3 text-stone-700 ml-0.5" />}
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Audio Toggle + Mobile Menu Trigger */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Audio Toggle (44px touch target) */}
            <button
              onClick={handleToggleSound}
              title={muted ? 'Unmute sound effects' : 'Mute sound effects'}
              className="h-10 w-10 rounded-xl bg-stone-900/90 hover:bg-stone-800 text-rose-200 hover:text-white border border-stone-800 transition-colors flex items-center justify-center cursor-pointer"
              aria-label={muted ? 'Sound muted' : 'Sound active'}
            >
              {muted ? (
                <VolumeX className="w-4 h-4 text-stone-500" />
              ) : (
                <div className="flex items-center gap-0.5">
                  <Volume2 className="w-4 h-4 text-rose-400" />
                </div>
              )}
            </button>

            {/* Mobile Hamburger Menu Button (44px touch target) */}
            <button
              onClick={() => {
                soundEngine.playClick();
                setIsMobileMenuOpen(true);
              }}
              className="md:hidden flex items-center gap-1.5 h-10 px-3 rounded-xl bg-stone-900 border border-stone-800 text-xs text-rose-200 hover:text-white transition-colors cursor-pointer active:scale-95"
              aria-label="Open date steps"
            >
              <span className="font-mono text-[11px] text-rose-300 font-semibold">
                0{activeChapter + 1}/{totalChapters}
              </span>
              <Menu className="w-4 h-4 text-rose-400" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Slide-out Side Navigation Bar */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden flex justify-end">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileMenuOpen(false)}
              className="fixed inset-0 bg-stone-950/80 backdrop-blur-sm cursor-pointer"
            />

            {/* Side Drawer */}
            <motion.aside
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 240 }}
              className="relative w-4/5 max-w-xs h-full bg-stone-900 border-l border-rose-500/20 shadow-2xl p-5 flex flex-col justify-between z-10"
            >
              <div>
                {/* Drawer Header */}
                <div className="flex items-center justify-between pb-3 border-b border-rose-500/15 mb-5">
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-rose-400 fill-rose-400/30" />
                    <span className="font-serif-romantic text-lg text-rose-200 font-medium">
                      Date Steps
                    </span>
                  </div>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="h-9 w-9 rounded-lg text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors flex items-center justify-center cursor-pointer"
                    aria-label="Close navigation"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Steps List */}
                <div className="space-y-2">
                  {chapterTitles.map((title, idx) => {
                    const isActive = activeChapter === idx;
                    const isCompleted = activeChapter > idx;
                    const isLocked = idx > maxUnlockedChapter;

                    return (
                      <button
                        key={idx}
                        onClick={() => handleStepClick(idx)}
                        disabled={isLocked}
                        className={`w-full p-3 rounded-xl text-left transition-all flex items-center justify-between text-xs tracking-wide min-h-[44px] ${
                          isLocked
                            ? 'bg-stone-950/40 text-stone-600 border border-transparent cursor-not-allowed'
                            : isActive
                            ? 'bg-rose-500/15 border border-rose-400/50 text-rose-200 font-semibold shadow-md'
                            : isCompleted
                            ? 'bg-stone-800/60 text-stone-300 hover:bg-stone-800 hover:text-white cursor-pointer'
                            : 'text-stone-400 hover:bg-stone-800 cursor-pointer'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-[11px] text-rose-400/80">
                            0{idx + 1}.
                          </span>
                          <span>{title}</span>
                        </div>

                        {isLocked ? (
                          <Lock className="w-3.5 h-3.5 text-stone-600" />
                        ) : isActive ? (
                          <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Drawer Bottom Info without any AI icon */}
              <div className="pt-4 border-t border-stone-800 text-[11px] text-stone-400 font-mono flex items-center justify-between">
                <span>From {senderName} with love</span>
                <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/30" />
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};
