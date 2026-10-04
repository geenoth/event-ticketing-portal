import { StoryConfig, UserSelections } from '../types/dateStory';

export const DEFAULT_STORY_CONFIG: StoryConfig = {
  recipientName: 'Cham',
  senderName: 'Gee',
  venueName: 'Marino Beach Hotel',
  venueLocation: 'Colombo (Sea View)',
  highTeaTiming: '3:00 PM - 5:00 PM (Afternoon Date)',
  openingLetterTitle: 'To my sweetest Cham, from Gee',
  openingLetterBody:
    'You work so hard every day, and I love seeing your beautiful smile. I wanted to put together a little surprise to brighten your afternoon and show you how much you mean to me. Open this letter to see some of our favorite little moments...',
  bigQuestionHeading: 'Will you go on a date with me?',
  bigQuestionSubtext:
    'A special relaxing afternoon date just for the two of us! (No night time, back before dark!)',
  memories: [
    {
      id: 'm1',
      title: 'Your lovely laugh',
      dateOrMoment: 'Every single time',
      description: 'Whenever you laugh at my silly jokes, my heart feels so warm and happy.',
      category: 'Pure Joy',
      icon: 'heart',
    },
    {
      id: 'm2',
      title: 'Our tea & snack chats',
      dateOrMoment: 'After work talks',
      description: 'Talking with you and sharing snacks is my favorite part of the day.',
      category: 'Sweet Moments',
      icon: 'coffee',
    },
    {
      id: 'm3',
      title: 'How hard you work',
      dateOrMoment: 'Every weekday',
      description: 'You work so diligently! You really deserve a peaceful, fun, and relaxing break.',
      category: 'My Champion',
      icon: 'star',
    },
    {
      id: 'm4',
      title: 'Looking at the sea with you',
      dateOrMoment: 'Our dream afternoon',
      description: 'Sitting beside you, watching the waves and talking about everything.',
      category: 'Colombo Vibes',
      icon: 'sunset',
    },
  ],
  availableDays: [
    {
      id: 'flexible_weekend',
      title: 'Any Weekend Afternoon (Saturday or Sunday)',
      subtitle: '3:00 PM to 5:00 PM · Free day from work, totally relaxed!',
      isHalfDayNote: false,
    },
    {
      id: 'flexible_halfday',
      title: 'A Weekday (I will take a Half-Day Leave)',
      subtitle: 'Take a half day off from work and we can go on a quiet afternoon!',
      isHalfDayNote: true,
    },
    {
      id: 'flexible_chat',
      title: 'Flexible / Let\'s Decide Together Over Chat',
      subtitle: 'I said YES! We can pick the exact day anytime later!',
      isHalfDayNote: false,
    },
  ],
  dateCartActivities: [
    {
      id: 'beach_walk',
      title: 'Go to the Beach',
      subtitle: 'Walk on the soft sand, feel the sea wind, and watch the waves',
      emoji: '🏖️',
      category: 'Relaxing',
      isPopular: true,
    },
    {
      id: 'shopping',
      title: 'Go Shopping Together',
      subtitle: 'Walk around the mall and buy something cute for Cham',
      emoji: '🛍️',
      category: 'Fun & Gifts',
      isPopular: true,
    },
    {
      id: 'movie',
      title: 'Watch a Movie at Cinema',
      subtitle: 'Sit together with caramel popcorn and watch a fun movie',
      emoji: '🎬',
      category: 'Entertainment',
    },
    {
      id: 'cute_photos',
      title: 'Take Cute Photos',
      subtitle: 'Take lots of pretty photos of you with the sea and hotel view',
      emoji: '📸',
      category: 'Memories',
      isPopular: true,
    },
    {
      id: 'ice_cream',
      title: 'Get Ice Cream',
      subtitle: 'Stop for delicious gelato or ice cream cones afterwards',
      emoji: '🍦',
      category: 'Sweet Treat',
    },
    {
      id: 'rooftop_sunset',
      title: 'Rooftop Sunset by the Pool',
      subtitle: 'Sit by the famous Marino Beach infinity pool and watch the golden sunset together',
      emoji: '🌅',
      category: 'Romantic View',
      isPopular: true,
    },
  ],
  defaultDatePreference: 'Any Weekend Afternoon (3:00 PM - 5:00 PM)',
  passConfirmationMessage: 'Afternoon date officially reserved for Cham and Gee!',
};

const STORAGE_KEY = 'romantic_date_cham_gee_v5';

export function loadStoryConfig(): StoryConfig {
  try {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      const encodedData = params.get('data');
      if (encodedData) {
        const decodedJson = decodeURIComponent(escape(atob(encodedData)));
        const parsed = JSON.parse(decodedJson);
        if (parsed && parsed.recipientName) {
          return { ...DEFAULT_STORY_CONFIG, ...parsed };
        }
      }
    }
  } catch (err) {
    console.warn('Failed to parse URL story data:', err);
  }

  try {
    if (typeof window !== 'undefined') {
      const local = localStorage.getItem(STORAGE_KEY);
      if (local) {
        const parsed = JSON.parse(local);
        return { ...DEFAULT_STORY_CONFIG, ...parsed };
      }
    }
  } catch (err) {
    console.warn('Failed to load localStorage story:', err);
  }

  return DEFAULT_STORY_CONFIG;
}

export function saveStoryConfig(config: StoryConfig): void {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    }
  } catch (err) {
    console.error('Failed to save to localStorage', err);
  }
}

export function generateShareableUrl(config: StoryConfig): string {
  try {
    const jsonStr = JSON.stringify(config);
    const encoded = btoa(unescape(encodeURIComponent(jsonStr)));
    const baseUrl = window.location.origin + window.location.pathname;
    return `${baseUrl}#data=${encoded}`;
  } catch {
    return window.location.href;
  }
}

export const DEFAULT_USER_SELECTIONS: UserSelections = {
  daySelection: 'flexible_weekend',
  daySelectionLabel: 'Any Weekend Afternoon (Saturday or Sunday)',
  dayType: 'weekend',
  timeSlot: '3:00 PM - 5:00 PM (Afternoon)',
  cartActivities: ['beach_walk', 'cute_photos'],
  specialWish: 'Make sure to bring your sweetest smile!',
};
