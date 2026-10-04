import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import confetti from 'canvas-confetti';
import { Heart, Smile, ArrowLeft } from 'lucide-react';
import { soundEngine } from '../utils/soundEngine';

interface TheQuestionProps {
  recipientName: string;
  senderName: string;
  questionHeading: string;
  questionSubtext: string;
  onAccepted: () => void;
  onBackToMemories: () => void;
}

const EVASIVE_PHRASES = [
  'No',
  'Wait Cham, are you sure? 🥺',
  'Wrong button silly! 💕',
  'What if I get you chocolates? 🍫',
  'I will carry all your shopping bags! 🛍️',
  'I have a surprise planned for you! 🌅',
  'Error: "No" is not allowed for Cham! ❤️',
  'Pretty please with sugar on top? 🥺',
  'You know you want to say yes! 🥰',
  'Look how big the YES button is getting! 💖',
  'No night time, just a sweet afternoon! ☀️',
  'Please say yes! 💓',
];

export const TheQuestion: React.FC<TheQuestionProps> = ({
  recipientName,
  senderName,
  questionHeading,
  questionSubtext,
  onAccepted,
  onBackToMemories,
}) => {
  const [noCount, setNoCount] = useState(0);
  const [noPos, setNoPos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDodging, setIsDodging] = useState(false);
  const [hasAccepted, setHasAccepted] = useState(false);
  const arenaRef = useRef<HTMLDivElement | null>(null);

  const dodgeNoButton = () => {
    soundEngine.playDodgingPop();
    setNoCount((prev) => prev + 1);
    setIsDodging(true);

    if (arenaRef.current) {
      const rect = arenaRef.current.getBoundingClientRect();
      // Keep strictly within mobile boundaries so button never clips off-screen
      const safeMaxX = Math.max(Math.min(rect.width / 2 - 70, 100), 35);
      const safeMaxY = Math.max(Math.min(rect.height / 2 - 35, 60), 25);

      const randomX = (Math.random() * 2 - 1) * safeMaxX;
      const randomY = (Math.random() * 2 - 1) * safeMaxY;

      setNoPos({ x: randomX, y: randomY });
    }
  };

  const handleYes = () => {
    if (hasAccepted) return;
    setHasAccepted(true);

    soundEngine.playYesCelebration();

    try {
      confetti({
        particleCount: 75,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#f43f5e', '#fb7185', '#fda4af', '#f59e0b', '#fde68a'],
      });

      setTimeout(() => {
        confetti({
          particleCount: 85,
          angle: 60,
          spread: 80,
          origin: { x: 0.15, y: 0.7 },
          colors: ['#ec4899', '#f43f5e', '#ffd700'],
        });
        confetti({
          particleCount: 85,
          angle: 120,
          spread: 80,
          origin: { x: 0.85, y: 0.7 },
          colors: ['#ec4899', '#f43f5e', '#ffd700'],
        });
      }, 300);
    } catch {
      // Confetti safety
    }

    setTimeout(() => {
      onAccepted();
    }, 1300);
  };

  // Safe scaling on mobile devices to prevent viewport overflow
  const yesScale = Math.min(1 + noCount * 0.08, 1.4);

  return (
    <div className="min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-4rem)] flex items-center justify-center p-3 sm:p-6">
      <div className="w-full max-w-lg mx-auto flex flex-col items-center text-center">
        {/* Top Kicker */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 text-[11px] sm:text-xs tracking-widest text-rose-300/80 uppercase mb-2 sm:mb-3"
        >
          <span>Part 03</span>
          <span aria-hidden="true">·</span>
          <span>The Big Question</span>
        </motion.div>

        {/* Pulsing Centerpiece without AI icon */}
        <motion.div
          animate={{
            scale: [1, 1.08, 1, 1.08, 1],
          }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            repeatType: 'loop',
            ease: 'easeInOut',
          }}
          onMouseEnter={() => soundEngine.playHeartbeat()}
          className="relative my-3 sm:my-4"
        >
          <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-full bg-gradient-to-tr from-rose-600 via-pink-600 to-amber-500 p-0.5 shadow-2xl shadow-rose-600/50 flex items-center justify-center relative">
            <div className="w-full h-full rounded-full bg-stone-950/90 flex items-center justify-center">
              <Heart className="w-10 h-10 sm:w-14 sm:h-14 text-rose-400 fill-rose-500/80 drop-shadow-lg" />
            </div>
            <div className="absolute -inset-3 bg-rose-500/20 rounded-full blur-xl -z-10 animate-pulse" />
          </div>
        </motion.div>

        {/* Main Question Display */}
        <motion.h2
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-serif-romantic text-2xl sm:text-4xl md:text-5xl text-stone-100 font-light tracking-tight leading-tight mt-2 text-balance px-2"
        >
          {recipientName}, will you go on a date with me?
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="mt-2 text-xs sm:text-sm text-stone-300 max-w-sm sm:max-w-md mx-auto font-light leading-relaxed space-y-1 px-3"
        >
          <p className="text-rose-200/90 font-medium">
            A special relaxing afternoon date just for the two of us!
          </p>
          <p className="text-stone-400 text-xs">
            (No night time, back before dark, and I have a wonderful surprise ready for you)
          </p>
        </motion.div>

        {/* Playful Evasive Interactive Arena (Mobile overflow protected) */}
        <div
          ref={arenaRef}
          className="w-full relative min-h-[170px] sm:min-h-[210px] my-4 sm:my-6 flex items-center justify-center overflow-hidden rounded-2xl bg-stone-950/20 border border-stone-900/50"
        >
          <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-8 relative z-10 p-2">
            {/* The Glowing YES Button without AI icon */}
            <motion.button
              onClick={handleYes}
              onMouseEnter={() => soundEngine.playHeartbeat()}
              style={{
                scale: yesScale,
              }}
              whileHover={{ scale: yesScale * 1.05 }}
              whileTap={{ scale: yesScale * 0.95 }}
              className="relative px-6 sm:px-8 py-3 sm:py-3.5 rounded-2xl bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 hover:from-rose-400 hover:to-pink-500 text-stone-950 font-bold text-sm sm:text-base shadow-xl shadow-rose-900/50 hover:shadow-rose-500/40 transition-all flex items-center gap-2 cursor-pointer z-20 group min-h-[46px] select-none"
            >
              <Heart className="w-4 h-4 sm:w-5 sm:h-5 fill-stone-950 text-stone-950" />
              <span>YES, I would love to! 💕</span>
            </motion.button>

            {/* The Evasive NO Button (Mobile touch optimized) */}
            <motion.div
              animate={{
                x: noPos.x,
                y: noPos.y,
              }}
              transition={{
                type: 'spring',
                stiffness: 400,
                damping: 24,
              }}
              className="relative z-10"
            >
              <button
                onMouseEnter={dodgeNoButton}
                onTouchStart={(e) => {
                  e.preventDefault();
                  dodgeNoButton();
                }}
                onClick={(e) => {
                  e.preventDefault();
                  dodgeNoButton();
                }}
                className="px-4 py-2.5 rounded-xl bg-stone-900/90 text-stone-400 hover:text-rose-200 border border-stone-800 text-xs sm:text-sm font-medium transition-all shadow-lg hover:border-rose-500/40 cursor-pointer select-none whitespace-nowrap min-h-[42px]"
              >
                <span>{EVASIVE_PHRASES[noCount % EVASIVE_PHRASES.length]}</span>
              </button>
            </motion.div>
          </div>
        </div>

        {/* Playful hint text */}
        <AnimatePresence>
          {noCount > 0 && !hasAccepted && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-[11px] sm:text-xs text-rose-300/80 font-mono flex items-center justify-center gap-1.5 px-3"
            >
              <Smile className="w-3.5 h-3.5 text-rose-400 shrink-0" />
              <span>
                Attempted dodges: {noCount} · Hint: A big surprise is waiting when you press YES!
              </span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Back navigation */}
        <div className="mt-6 sm:mt-8">
          <button
            onClick={onBackToMemories}
            className="text-xs text-stone-500 hover:text-stone-300 transition-colors flex items-center gap-1 cursor-pointer py-1.5 px-3 rounded-lg"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Read memories again</span>
          </button>
        </div>
      </div>
    </div>
  );
};
