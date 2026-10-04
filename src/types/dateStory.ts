export interface MemoryItem {
  id: string;
  title: string;
  dateOrMoment: string;
  description: string;
  category: string;
  icon: 'star' | 'coffee' | 'heart' | 'music' | 'sunset' | 'sparkles';
}

export interface DateActivityAddon {
  id: string;
  title: string;
  subtitle: string;
  emoji: string;
  category: string;
  isPopular?: boolean;
}

export interface StoryConfig {
  recipientName: string;
  senderName: string;
  venueName: string;
  venueLocation: string;
  highTeaTiming: string;
  openingLetterTitle: string;
  openingLetterBody: string;
  bigQuestionHeading: string;
  bigQuestionSubtext: string;
  memories: MemoryItem[];
  availableDays: {
    id: string;
    title: string;
    subtitle: string;
    isHalfDayNote?: boolean;
  }[];
  dateCartActivities: DateActivityAddon[];
  defaultDatePreference: string;
  passConfirmationMessage: string;
}

export interface UserSelections {
  daySelection: string;
  daySelectionLabel?: string;
  dayType?: 'weekend' | 'weekday_half' | 'flexible';
  timeSlot?: string;
  cartActivities: string[];
  specialWish: string;
  acceptedAt?: string;
}
