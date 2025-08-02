export interface Language {
  id: string;
  name: string;
  code: string; // e.g., 'es', 'fr', 'de'
  flag: string;
  isActive: boolean;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  lessonsCount: number;
  completedLessons: number;
  icon: string;
  color: string;
}

export interface LessonItem {
  id: string;
  word: string;
  translation: string;
  audioUrl?: string;
  imageUrl?: string;
  phonetic?: string;
}

export interface LessonSection {
  type: 'positive' | 'neutral' | 'awareness';
  title: string;
  description: string;
  items: LessonItem[];
}

export interface Lesson {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  sections: LessonSection[];
  estimatedDuration: number; // in minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export interface UserProgress {
  id: string;
  userId: string;
  lessonId: string;
  completedAt?: Date;
  accuracy: number; // 0-100
  streakCount: number;
  perfectStreak: number;
  timeSpent: number; // in seconds
}

export interface Reward {
  id: string;
  type: 'streak' | 'perfect' | 'milestone' | 'daily';
  title: string;
  description: string;
  icon: string;
  earnedAt: Date;
  value: number;
}

export interface PracticeSession {
  id: string;
  lessonId: string;
  startedAt: Date;
  completedAt?: Date;
  responses: PracticeResponse[];
  finalAccuracy: number;
}

export interface PracticeResponse {
  id: string;
  itemId: string;
  userResponse: string;
  expectedResponse: string;
  isCorrect: boolean;
  attempts: number;
  audioRecordingUrl?: string;
}

export interface NavigationParams {
  Home: undefined;
  Lesson: { lessonId: string; moduleId: string };
  Practice: { lessonId: string };
  Profile: undefined;
  Rewards: undefined;
}

// Responsive design types
export interface ScreenDimensions {
  width: number;
  height: number;
  isTablet: boolean;
  orientation: 'portrait' | 'landscape';
}

export interface ScaledSize {
  width: number;
  height: number;
  scale: number;
  fontScale: number;
}