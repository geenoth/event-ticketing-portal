import React, { useState } from 'react';
import { motion } from 'motion/react';
import { StoryConfig } from '../types/dateStory';
import { generateShareableUrl, DEFAULT_STORY_CONFIG } from '../utils/storyStorage';
import { soundEngine } from '../utils/soundEngine';
import {
  X,
  Copy,
  Check,
  Heart,
  Share2,
  RefreshCw,
  Plus,
  Trash2,
} from 'lucide-react';

interface CustomizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: StoryConfig;
  onSaveConfig: (newConfig: StoryConfig) => void;
}

export const CustomizeModal: React.FC<CustomizeModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
}) => {
  const [formData, setFormData] = useState<StoryConfig>({ ...config });
  const [copiedLink, setCopiedLink] = useState(false);
  const [activeTab, setActiveTab] = useState<'names' | 'letter' | 'memories' | 'share'>('names');

  if (!isOpen) return null;

  const handleCopyLink = () => {
    soundEngine.playClick();
    const url = generateShareableUrl(formData);
    navigator.clipboard.writeText(url).then(() => {
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    });
  };

  const handleApply = () => {
    soundEngine.playCelestialChime();
    onSaveConfig(formData);
    onClose();
  };

  const handleResetToDefault = () => {
    soundEngine.playClick();
    setFormData({ ...DEFAULT_STORY_CONFIG });
  };

  const handleUpdateMemory = (index: number, field: string, value: string) => {
    const updated = [...formData.memories];
    updated[index] = { ...updated[index], [field]: value };
    setFormData({ ...formData, memories: updated });
  };

  const handleAddMemory = () => {
    soundEngine.playClick();
    setFormData({
      ...formData,
      memories: [
        ...formData.memories,
        {
          id: `m_${Date.now()}`,
          title: 'Another sweet memory',
          dateOrMoment: 'Special time',
          description: 'Being with you is always my happiest time.',
          category: 'Sweet Moments',
          icon: 'heart',
        },
      ],
    });
  };

  const handleRemoveMemory = (index: number) => {
    soundEngine.playClick();
    const updated = formData.memories.filter((_, i) => i !== index);
    setFormData({ ...formData, memories: updated });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-2xl bg-stone-900 border border-rose-500/25 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-rose-500/15 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400/40" />
            <h3 className="font-serif-romantic text-xl text-stone-100 font-medium">
              Edit Your High Tea Date Invitation
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-200 hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-stone-800 bg-stone-950/50 px-6 pt-2 gap-4 text-xs font-mono">
          {[
            { id: 'names', label: '1. Names & Hotel' },
            { id: 'letter', label: '2. Letter' },
            { id: 'memories', label: '3. Memories' },
            { id: 'share', label: '4. Share Link' },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`pb-2.5 transition-colors border-b-2 cursor-pointer ${
                activeTab === t.id
                  ? 'border-rose-400 text-rose-300 font-semibold'
                  : 'border-transparent text-stone-400 hover:text-stone-200'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Scrollable Tab Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {activeTab === 'names' && (
            <div className="space-y-4">
              <div>
                <label className="block text-stone-300 font-medium mb-1">
                  Girlfriend's Name
                </label>
                <input
                  type="text"
                  value={formData.recipientName}
                  onChange={(e) => setFormData({ ...formData, recipientName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:border-rose-500/80 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  value={formData.senderName}
                  onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:border-rose-500/80 focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-300 font-medium mb-1">
                    Hotel Venue
                  </label>
                  <input
                    type="text"
                    value={formData.venueName}
                    onChange={(e) => setFormData({ ...formData, venueName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:border-rose-500/80 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-stone-300 font-medium mb-1">
                    High Tea Timing
                  </label>
                  <input
                    type="text"
                    value={formData.highTeaTiming}
                    onChange={(e) => setFormData({ ...formData, highTeaTiming: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:border-rose-500/80 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'letter' && (
            <div className="space-y-4">
              <div>
                <label className="block text-stone-300 font-medium mb-1">
                  Letter Title
                </label>
                <input
                  type="text"
                  value={formData.openingLetterTitle}
                  onChange={(e) =>
                    setFormData({ ...formData, openingLetterTitle: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:border-rose-500/80 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">
                  Letter Message (Simple words)
                </label>
                <textarea
                  rows={4}
                  value={formData.openingLetterBody}
                  onChange={(e) =>
                    setFormData({ ...formData, openingLetterBody: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-xs focus:border-rose-500/80 focus:outline-none resize-none leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-medium mb-1">
                  The Question
                </label>
                <input
                  type="text"
                  value={formData.bigQuestionHeading}
                  onChange={(e) =>
                    setFormData({ ...formData, bigQuestionHeading: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-800 text-stone-100 text-sm focus:border-rose-500/80 focus:outline-none"
                />
              </div>
            </div>
          )}

          {activeTab === 'memories' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-stone-300 font-medium">
                  Sweet Memories ({formData.memories.length})
                </span>
                <button
                  onClick={handleAddMemory}
                  className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-300 hover:bg-rose-500/30 border border-rose-500/30 flex items-center gap-1 text-[11px] cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Memory</span>
                </button>
              </div>

              {formData.memories.map((mem, idx) => (
                <div
                  key={mem.id || idx}
                  className="p-3.5 rounded-xl bg-stone-950 border border-stone-800 space-y-2 relative"
                >
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={mem.title}
                      onChange={(e) => handleUpdateMemory(idx, 'title', e.target.value)}
                      placeholder="Title of memory..."
                      className="font-medium text-stone-200 bg-transparent border-b border-stone-800 focus:border-rose-400 focus:outline-none flex-1 pb-1"
                    />
                    {formData.memories.length > 1 && (
                      <button
                        onClick={() => handleRemoveMemory(idx)}
                        className="text-stone-500 hover:text-rose-400 transition-colors cursor-pointer"
                        title="Delete memory"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                  <textarea
                    rows={2}
                    value={mem.description}
                    onChange={(e) => handleUpdateMemory(idx, 'description', e.target.value)}
                    placeholder="What happened..."
                    className="w-full px-2 py-1 rounded bg-stone-900 border border-stone-800 text-stone-300 text-xs focus:outline-none resize-none"
                  />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'share' && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/25">
                <div className="flex items-center gap-2 mb-2">
                  <Share2 className="w-4 h-4 text-rose-400" />
                  <span className="font-medium text-stone-100">Send This Link to Cham</span>
                </div>
                <p className="text-stone-400 text-xs font-light leading-relaxed">
                  Send this link to Cham on WhatsApp or message. When she opens it, she will see your letter, the High Tea invite for Marino Beach Hotel, and can choose her plans!
                </p>
              </div>

              <div>
                <label className="block text-stone-400 mb-1 font-mono text-[11px]">
                  Generated URL
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={generateShareableUrl(formData)}
                    className="w-full px-3 py-2 rounded-xl bg-stone-950 border border-stone-800 text-stone-300 font-mono text-xs select-all focus:outline-none"
                  />
                  <button
                    onClick={handleCopyLink}
                    className="px-4 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-stone-950 font-semibold text-xs transition-colors flex items-center gap-1.5 shrink-0 cursor-pointer"
                  >
                    {copiedLink ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-rose-500/15 bg-stone-950/80 flex items-center justify-between">
          <button
            onClick={handleResetToDefault}
            className="text-stone-500 hover:text-stone-300 text-xs flex items-center gap-1 cursor-pointer transition-colors"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Reset to default</span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-stone-400 hover:text-stone-200 text-xs transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleApply}
              className="px-5 py-2 rounded-xl bg-rose-500 hover:bg-rose-400 text-stone-950 font-semibold text-xs shadow-md shadow-rose-900/40 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Heart className="w-3.5 h-3.5 fill-stone-950" />
              <span>Save & View</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
