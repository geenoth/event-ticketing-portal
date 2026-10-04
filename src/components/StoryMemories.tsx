import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MemoryItem } from '../types/dateStory';
import { soundEngine } from '../utils/soundEngine';
import { Coffee, Music, Heart, Star, Sunset, ArrowRight, ArrowLeft } from 'lucide-react';

interface StoryMemoriesProps {
  recipientName: string;
  senderName: string;
  memories: MemoryItem[];
  onProceedToQuestion: () => void;
  onBackToLetter: () => void;
}

export const StoryMemories: React.FC<StoryMemoriesProps> = ({
  recipientName,
  senderName,
  memories,
  onProceedToQuestion,
  onBackToLetter,
}) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [likedMemories, setLikedMemories] = useState<Record<string, number>>({});

  const handleLike = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playHeartbeat();
    setLikedMemories((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  const handleNext = () => {
    if (activeIdx < memories.length - 1) {
      soundEngine.playClick();
      setActiveIdx((prev) => prev + 1);
    } else {
      soundEngine.playCelestialChime();
      onProceedToQuestion();
    }
  };

  const handlePrev = () => {
    if (activeIdx > 0) {
      soundEngine.playClick();
      setActiveIdx((prev) => prev - 1);
    } else {
      onBackToLetter();
    }
  };

  const getMemoryIcon = (type: MemoryItem['icon']) => {
    switch (type) {
      case 'coffee':
        return <Coffee className="w-5 h-5 text-amber-400" />;
      case 'music':
        return <Music className="w-5 h-5 text-rose-400" />;
      case 'sunset':
        return <Sunset className="w-5 h-5 text-pink-400" />;
      case 'star':
      case 'sparkles':
        return <Star className="w-5 h-5 text-amber-300" />;
      default:
        return <Heart className="w-5 h-5 text-rose-400" />;
    }
  };

  const current = memories[activeIdx] || memories[0];

  return (
    <div className="min-h-[calc(100vh-3.5rem)] sm:min-h-[calc(100vh-4rem)] flex items-center justify-center p-3 sm:p-6">
      <div className="w-full max-w-2xl mx-auto flex flex-col items-center">
        {/* Chapter Header */}
        <div className="text-center mb-5 sm:mb-8">
          <div className="flex items-center justify-center gap-2 text-[11px] sm:text-xs tracking-widest text-rose-300/80 uppercase mb-1.5">
            <span>Part 02</span>
            <span aria-hidden="true">·</span>
            <span>Why You Mean So Much To Me</span>
          </div>
          <h2 className="font-serif-romantic text-2xl sm:text-4xl text-stone-100 font-light tracking-tight">
            Little reasons I love being with you, {recipientName}
          </h2>
          <p className="mt-1.5 text-xs sm:text-sm text-stone-400 max-w-md mx-auto">
            Before I ask you my question, here are some sweet moments that always make me smile.
          </p>
        </div>

        {/* Memory Carousel Card */}
        <div className="w-full relative min-h-[310px] sm:min-h-[360px] flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={current.id}
              initial={{ opacity: 0, x: 30, scale: 0.97 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: -30, scale: 0.97 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="w-full bg-stone-900/90 border border-rose-500/20 rounded-2xl p-5 sm:p-8 backdrop-blur-md shadow-2xl relative overflow-hidden"
            >
              {/* Background glow */}
              <div className="absolute top-0 right-0 w-48 sm:w-64 h-48 sm:h-64 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />

              {/* Card Meta Bar */}
              <div className="flex items-center justify-between border-b border-rose-500/10 pb-3 sm:pb-4 mb-4 sm:mb-6">
                <div className="flex items-center gap-2.5 sm:gap-3">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-stone-800/80 border border-stone-700/60 flex items-center justify-center shrink-0">
                    {getMemoryIcon(current.icon)}
                  </div>
                  <div>
                    <span className="text-[10px] sm:text-[11px] font-mono uppercase tracking-widest text-rose-300/80 block">
                      {current.category}
                    </span>
                    <span className="text-xs text-stone-400 font-light">{current.dateOrMoment}</span>
                  </div>
                </div>

                {/* Love reaction button */}
                <button
                  onClick={(e) => handleLike(current.id, e)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-stone-800/80 hover:bg-stone-800 border border-rose-500/20 text-rose-300 hover:text-rose-200 transition-colors text-xs font-mono cursor-pointer active:scale-95 min-h-[36px]"
                  title="Send heart"
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      (likedMemories[current.id] || 0) > 0 ? 'fill-rose-500 text-rose-500' : 'text-rose-400'
                    }`}
                  />
                  <span>{(likedMemories[current.id] || 0) + 1}</span>
                </button>
              </div>

              {/* Content */}
              <h3 className="font-serif-romantic text-xl sm:text-3xl text-stone-100 font-medium leading-snug mb-3">
                "{current.title}"
              </h3>

              <p className="font-serif-romantic text-base sm:text-xl text-stone-300 leading-relaxed font-light mb-6">
                {current.description}
              </p>

              {/* Footer indicator */}
              <div className="flex items-center justify-between pt-3 border-t border-rose-500/10 text-xs text-stone-500">
                <span>
                  Moment {activeIdx + 1} of {memories.length}
                </span>
                <span className="text-rose-300/80 font-mono text-[10px] sm:text-[11px]">
                  Swipe or tap below
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Dots & Controls (Mobile thumb friendly) */}
        <div className="w-full flex items-center justify-between mt-5 px-1 gap-2">
          <button
            onClick={handlePrev}
            className="h-11 px-3.5 sm:px-4 rounded-xl bg-stone-900/80 hover:bg-stone-800 text-stone-400 hover:text-stone-200 border border-stone-800 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">Previous</span>
          </button>

          {/* Dots */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {memories.map((_, i) => (
              <button
                key={i}
                onClick={() => {
                  soundEngine.playClick();
                  setActiveIdx(i);
                }}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  activeIdx === i ? 'w-6 bg-rose-400' : 'w-2 bg-stone-700 hover:bg-stone-500'
                }`}
                aria-label={`Go to moment ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="h-11 px-4 sm:px-5 rounded-xl bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 text-stone-950 text-xs font-semibold transition-all shadow-md shadow-rose-900/40 flex items-center gap-1.5 cursor-pointer shrink-0"
          >
            <span>{activeIdx === memories.length - 1 ? 'My question' : 'Next'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
