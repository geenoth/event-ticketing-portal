import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, ArrowRight } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

interface LetterOpeningProps {
  recipientName: string;
  senderName: string;
  title: string;
  body: string;
  onOpenComplete: () => void;
}

export const LetterOpening: React.FC<LetterOpeningProps> = ({
  recipientName,
  senderName,
  title,
  body,
  onOpenComplete,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const handleOpenEnvelope = () => {
    if (!isOpen) {
      soundEngine.playEnvelopeOpen();
      setIsOpen(true);
    }
  };

  const handleProceed = () => {
    soundEngine.playCelestialChime();
    onOpenComplete();
  };

  return (
    <div className="relative min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-4rem)] flex items-center justify-center p-3 sm:p-6">
      <div className="w-full max-w-xl mx-auto flex flex-col items-center text-center">
        {/* Intro */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-4 sm:mb-6"
        >
          <div className="flex items-center justify-center gap-2 text-[11px] sm:text-xs tracking-widest text-rose-300/80 uppercase mb-1.5">
            <span>Special Message</span>
            <span aria-hidden="true">·</span>
            <span>Just For You</span>
          </div>
          <h1 className="font-serif-romantic text-2xl sm:text-4xl md:text-5xl font-light text-stone-100 tracking-tight text-balance">
            A sweet surprise for {recipientName}
          </h1>
          <p className="mt-1.5 text-xs sm:text-sm text-stone-400 font-light max-w-md mx-auto">
            Tap the heart wax seal below to open your letter from {senderName}.
          </p>
        </motion.div>

        {/* Envelope Container */}
        <div className="w-full relative flex items-center justify-center py-1 sm:py-2">
          <AnimatePresence mode="wait">
            {!isOpen ? (
              /* Sealed Envelope (Mobile touch optimized) */
              <motion.div
                key="closed-envelope"
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.05, opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                onMouseEnter={() => {
                  setIsHovered(true);
                  soundEngine.playHeartbeat();
                }}
                onMouseLeave={() => setIsHovered(false)}
                onClick={handleOpenEnvelope}
                className="group relative cursor-pointer w-full max-w-sm sm:max-w-md bg-gradient-to-b from-stone-900 to-stone-950 border border-rose-500/25 rounded-2xl p-6 sm:p-8 shadow-2xl shadow-rose-950/40 hover:border-rose-400/50 hover:shadow-rose-500/10 transition-all duration-300 active:scale-98"
              >
                {/* Glow backdrop */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-500/20 via-pink-500/10 to-amber-500/20 rounded-2xl blur-xl opacity-50 group-hover:opacity-100 transition-opacity" />

                <div className="relative z-10 flex flex-col items-center">
                  {/* Postage Stamp */}
                  <div className="self-end border border-dashed border-rose-400/40 p-1.5 sm:p-2 rounded text-[10px] text-rose-300/80 font-mono tracking-widest flex items-center gap-1.5">
                    <Heart className="w-3 h-3 text-rose-400 fill-rose-400/30" />
                    <span>SPECIAL INVITATION</span>
                  </div>

                  {/* Wax Seal */}
                  <div className="my-6 sm:my-8 relative">
                    <motion.div
                      animate={{
                        scale: isHovered ? 1.08 : 1,
                        rotate: isHovered ? [0, -3, 3, 0] : 0,
                      }}
                      transition={{ duration: 0.3 }}
                      className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-gradient-to-br from-rose-600 via-rose-700 to-rose-900 border-2 border-rose-300/40 shadow-xl shadow-rose-900/60 flex items-center justify-center relative overflow-hidden group-hover:from-rose-500 group-hover:to-rose-800 transition-colors"
                    >
                      <div className="absolute inset-1 rounded-full border border-rose-300/30 border-dashed" />
                      <Heart className="w-7 h-7 sm:w-8 sm:h-8 text-rose-100 fill-rose-100/40 drop-shadow" />
                    </motion.div>
                    <span className="absolute -bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap text-[11px] font-mono tracking-wider text-rose-300/90 font-medium">
                      Tap seal to open
                    </span>
                  </div>

                  {/* Addressed To */}
                  <div className="mt-3 pt-5 border-t border-rose-500/15 w-full flex flex-col items-center gap-0.5">
                    <span className="text-[10px] sm:text-[11px] uppercase tracking-widest text-stone-500 font-mono">
                      Special Letter For
                    </span>
                    <span className="font-serif-romantic text-2xl sm:text-3xl text-rose-200 font-medium">
                      {recipientName}
                    </span>
                    <span className="text-xs text-stone-400 font-light">With all my love</span>
                  </div>
                </div>
              </motion.div>
            ) : (
              /* Opened Letter */
              <motion.div
                key="open-letter"
                initial={{ opacity: 0, y: 25, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="w-full max-w-lg bg-stone-900/95 backdrop-blur-xl border border-rose-500/30 rounded-2xl p-5 sm:p-8 shadow-2xl relative"
              >
                <div className="text-left space-y-4">
                  <div className="flex items-center justify-between border-b border-rose-500/15 pb-2.5">
                    <span className="text-[11px] sm:text-xs text-rose-300/80 font-mono tracking-wider">
                      PART 01 · A NOTE FOR YOU
                    </span>
                    <div className="flex items-center gap-1 text-xs text-stone-400">
                      <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400/20" />
                      <span>From {senderName}</span>
                    </div>
                  </div>

                  <h2 className="font-serif-romantic text-xl sm:text-3xl text-rose-100 leading-snug font-medium pt-1">
                    {title}
                  </h2>

                  <div className="font-serif-romantic text-base sm:text-lg text-stone-300 leading-relaxed font-light">
                    <p className="first-letter:text-3xl sm:first-letter:text-4xl first-letter:font-normal first-letter:text-rose-400 first-letter:mr-1 first-letter:float-left">
                      {body}
                    </p>
                  </div>

                  {/* Sign-off */}
                  <div className="pt-4 border-t border-rose-500/15 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex flex-col space-y-1 sm:space-y-1.5 text-left">
                      <span className="text-xs text-stone-400 font-light italic tracking-wider block">
                        Always yours,
                      </span>
                      <span className="font-script-romantic text-3xl sm:text-4xl text-rose-300 block select-none pt-0.5">
                        {senderName}
                      </span>
                    </div>

                    <button
                      onClick={handleProceed}
                      className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-stone-950 font-medium text-xs tracking-wide transition-all shadow-lg shadow-rose-900/40 flex items-center justify-center gap-2 group cursor-pointer min-h-[44px]"
                    >
                      <span>See our little moments</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
