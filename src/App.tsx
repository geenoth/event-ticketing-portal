/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RomanticCanvas } from './components/RomanticCanvas';
import { RomanticHeader } from './components/RomanticHeader';
import { LetterOpening } from './components/LetterOpening';
import { StoryMemories } from './components/StoryMemories';
import { TheQuestion } from './components/TheQuestion';
import { DateCustomizer } from './components/DateCustomizer';
import { CelebrationReveal } from './components/CelebrationReveal';
import { StoryConfig, UserSelections } from './types/dateStory';
import {
  loadStoryConfig,
  DEFAULT_USER_SELECTIONS,
} from './utils/storyStorage';
import { soundEngine } from './utils/soundEngine';
import { submitDateSelectionsToWeb3Forms } from './utils/web3forms';

const CHAPTER_TITLES = ['The Letter', 'Our Memories', 'The Question', 'Our Date & Plans', 'The Pass'];

export default function App() {
  const [config, setConfig] = useState<StoryConfig>(() => loadStoryConfig());
  const [activeChapter, setActiveChapter] = useState(0);
  const [maxUnlockedChapter, setMaxUnlockedChapter] = useState(0);
  const [selections, setSelections] = useState<UserSelections>(DEFAULT_USER_SELECTIONS);
  const [isCelebrating, setIsCelebrating] = useState(false);

  useEffect(() => {
    const handleHashChange = () => {
      const updated = loadStoryConfig();
      setConfig(updated);
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Automatically scroll to top whenever chapter changes
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
  }, [activeChapter]);

  const handleSelectChapter = (idx: number) => {
    if (idx > maxUnlockedChapter) return;
    setActiveChapter(idx);
    if (idx === 4) {
      setIsCelebrating(true);
    }
  };

  const unlockAndGo = (nextChapter: number) => {
    setMaxUnlockedChapter((prev) => Math.max(prev, nextChapter));
    setActiveChapter(nextChapter);
  };

  const handleLetterComplete = () => {
    unlockAndGo(1);
  };

  const handleProceedToQuestion = () => {
    unlockAndGo(2);
  };

  const handleBackToLetter = () => {
    soundEngine.playClick();
    setActiveChapter(0);
  };

  const handleQuestionAccepted = () => {
    setIsCelebrating(true);
    unlockAndGo(3);
  };

  const handleBackToMemories = () => {
    soundEngine.playClick();
    setActiveChapter(1);
  };

  const handleConfirmSelections = (newSelections: UserSelections) => {
    setSelections(newSelections);
    setIsCelebrating(true);

    // Automatically send all chosen date options and form data to Web3Forms
    const activityNames = newSelections.cartActivities.map((actId) => {
      const found = config.dateCartActivities.find((a) => a.id === actId);
      return found ? `${found.emoji} ${found.title}` : actId;
    });

    submitDateSelectionsToWeb3Forms({
      recipientName: config.recipientName,
      senderName: config.senderName,
      venueName: config.venueName,
      venueLocation: config.venueLocation,
      daySelectionLabel: newSelections.daySelectionLabel,
      timeSlot: newSelections.timeSlot,
      cartActivities: activityNames,
      specialWish: newSelections.specialWish,
      acceptedAt: newSelections.acceptedAt,
    });

    unlockAndGo(4);
  };

  const handleRestart = () => {
    soundEngine.playCelestialChime();
    setActiveChapter(0);
    setMaxUnlockedChapter(0);
    setIsCelebrating(false);
  };

  return (
    <div className="relative min-h-screen bg-[#0c080e] text-stone-100 flex flex-col justify-between selection:bg-rose-500/30 selection:text-rose-200">
      {/* Background Interactive Ambient Canvas with glowing circles */}
      <RomanticCanvas isCelebrating={isCelebrating} />

      {/* Top Bar Header with Mobile Side Navigation Drawer and Locked Step Protection */}
      <RomanticHeader
        recipientName={config.recipientName}
        senderName={config.senderName}
        activeChapter={activeChapter}
        maxUnlockedChapter={maxUnlockedChapter}
        totalChapters={CHAPTER_TITLES.length}
        chapterTitles={CHAPTER_TITLES}
        onSelectChapter={handleSelectChapter}
      />

      {/* Story Stage */}
      <main className="relative z-10 flex-1 flex flex-col justify-center">
        <AnimatePresence mode="wait">
          {activeChapter === 0 && (
            <motion.div
              key="chapter-0"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.4 }}
            >
              <LetterOpening
                recipientName={config.recipientName}
                senderName={config.senderName}
                title={config.openingLetterTitle}
                body={config.openingLetterBody}
                onOpenComplete={handleLetterComplete}
              />
            </motion.div>
          )}

          {activeChapter === 1 && (
            <motion.div
              key="chapter-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              <StoryMemories
                recipientName={config.recipientName}
                senderName={config.senderName}
                memories={config.memories}
                onProceedToQuestion={handleProceedToQuestion}
                onBackToLetter={handleBackToLetter}
              />
            </motion.div>
          )}

          {activeChapter === 2 && (
            <motion.div
              key="chapter-2"
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.4 }}
            >
              <TheQuestion
                recipientName={config.recipientName}
                senderName={config.senderName}
                questionHeading={config.bigQuestionHeading}
                questionSubtext={config.bigQuestionSubtext}
                onAccepted={handleQuestionAccepted}
                onBackToMemories={handleBackToMemories}
              />
            </motion.div>
          )}

          {activeChapter === 3 && (
            <motion.div
              key="chapter-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
            >
              <DateCustomizer
                recipientName={config.recipientName}
                senderName={config.senderName}
                config={config}
                initialSelections={selections}
                onConfirmSelections={handleConfirmSelections}
                onBackToQuestion={() => handleSelectChapter(2)}
              />
            </motion.div>
          )}

          {activeChapter === 4 && (
            <motion.div
              key="chapter-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.5 }}
            >
              <CelebrationReveal
                config={config}
                selections={selections}
                onRestart={handleRestart}
                onBackToCustomize={() => handleSelectChapter(3)}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer with "A Special Date For Cham & Gee" removed as requested */}
      <footer className="relative z-10 py-4 px-6 border-t border-rose-500/10 text-center text-xs text-stone-500">
        <div className="max-w-6xl mx-auto flex items-center justify-center">
          <span>
            Made with all my love for {config.recipientName} · From {config.senderName}
          </span>
        </div>
      </footer>
    </div>
  );
}
