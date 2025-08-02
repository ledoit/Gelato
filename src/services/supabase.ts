import { createClient } from '@supabase/supabase-js';
import { Language, Module, Lesson, UserProgress, Reward } from '../types';

// TODO: Replace with actual Supabase URL and anon key
const supabaseUrl = 'https://your-project.supabase.co';
const supabaseAnonKey = 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database schema stubs - these will be implemented in Supabase

/*
-- Languages table
CREATE TABLE languages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  flag TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Modules table
CREATE TABLE modules (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  lessons_count INTEGER DEFAULT 0,
  icon TEXT,
  color TEXT,
  language_id UUID REFERENCES languages(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Lessons table
CREATE TABLE lessons (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  module_id UUID REFERENCES modules(id),
  title TEXT NOT NULL,
  description TEXT,
  estimated_duration INTEGER, -- in minutes
  difficulty TEXT CHECK (difficulty IN ('beginner', 'intermediate', 'advanced')),
  lesson_data JSONB, -- stores sections and items
  created_at TIMESTAMP DEFAULT NOW()
);

-- User Progress table
CREATE TABLE user_progress (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL, -- from auth.users
  lesson_id UUID REFERENCES lessons(id),
  completed_at TIMESTAMP,
  accuracy INTEGER CHECK (accuracy >= 0 AND accuracy <= 100),
  streak_count INTEGER DEFAULT 0,
  perfect_streak INTEGER DEFAULT 0,
  time_spent INTEGER DEFAULT 0, -- in seconds
  created_at TIMESTAMP DEFAULT NOW()
);

-- Rewards table
CREATE TABLE rewards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL, -- from auth.users
  type TEXT CHECK (type IN ('streak', 'perfect', 'milestone', 'daily')),
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  value INTEGER DEFAULT 0,
  earned_at TIMESTAMP DEFAULT NOW()
);
*/

// Service functions for database operations

export const languageService = {
  async getAll(): Promise<Language[]> {
    // Mock data for now
    return [
      {
        id: '1',
        name: 'Spanish',
        code: 'es',
        flag: '🇪🇸',
        isActive: true,
      },
      {
        id: '2',
        name: 'French',
        code: 'fr',
        flag: '🇫🇷',
        isActive: true,
      },
      {
        id: '3',
        name: 'German',
        code: 'de',
        flag: '🇩🇪',
        isActive: false,
      },
    ];
  },

  async getById(id: string): Promise<Language | null> {
    const languages = await this.getAll();
    return languages.find(lang => lang.id === id) || null;
  },
};

export const moduleService = {
  async getAll(): Promise<Module[]> {
    // Mock data for now
    return [
      {
        id: '1',
        title: 'Alphabet Flavor',
        description: 'Learn the basics of pronunciation and letter sounds',
        difficulty: 'beginner',
        lessonsCount: 12,
        completedLessons: 0,
        icon: '🔤',
        color: '#FF6B6B',
      },
      {
        id: '2',
        title: 'Basics Flavor',
        description: 'Essential words and phrases for daily conversation',
        difficulty: 'beginner',
        lessonsCount: 24,
        completedLessons: 0,
        icon: '👋',
        color: '#4ECDC4',
      },
      {
        id: '3',
        title: 'Grammar Flavor',
        description: 'Understanding sentence structure and grammar rules',
        difficulty: 'intermediate',
        lessonsCount: 36,
        completedLessons: 0,
        icon: '📚',
        color: '#FFE66D',
      },
    ];
  },

  async getById(id: string): Promise<Module | null> {
    const modules = await this.getAll();
    return modules.find(module => module.id === id) || null;
  },
};

export const lessonService = {
  async getByModuleId(moduleId: string): Promise<Lesson[]> {
    // Mock data for now
    return [
      {
        id: '1',
        moduleId: moduleId,
        title: 'Basic Greetings',
        description: 'Learn how to say hello, goodbye, and other common greetings',
        estimatedDuration: 10,
        difficulty: 'beginner',
        sections: [
          {
            type: 'positive',
            title: 'Practice These',
            description: 'Learn and practice these words',
            items: [
              { id: '1', word: 'Hola', translation: 'Hello', phonetic: 'OH-lah' },
              { id: '2', word: 'Adiós', translation: 'Goodbye', phonetic: 'ah-DYOHS' },
              { id: '3', word: 'Gracias', translation: 'Thank you', phonetic: 'GRAH-thyahs' },
            ],
          },
          {
            type: 'neutral',
            title: 'Good to Know',
            description: 'These are helpful but not required for progression',
            items: [
              { id: '4', word: 'Por favor', translation: 'Please', phonetic: 'por fah-BOHR' },
              { id: '5', word: 'De nada', translation: 'You\'re welcome', phonetic: 'deh NAH-dah' },
            ],
          },
          {
            type: 'awareness',
            title: 'Just so you recognize these words',
            description: 'No need to memorize, just be aware of them',
            items: [
              { id: '6', word: 'Buenos días', translation: 'Good morning', phonetic: 'BWAY-nohs DEE-ahs' },
              { id: '7', word: 'Buenas noches', translation: 'Good evening', phonetic: 'BWAY-nahs NOH-chehs' },
            ],
          },
        ],
      },
    ];
  },

  async getById(id: string): Promise<Lesson | null> {
    // Mock implementation
    const lessons = await this.getByModuleId('1');
    return lessons.find(lesson => lesson.id === id) || null;
  },
};

export const progressService = {
  async getUserProgress(userId: string): Promise<UserProgress[]> {
    // Mock data for now
    return [];
  },

  async updateProgress(progress: Partial<UserProgress>): Promise<UserProgress> {
    // Mock implementation
    return {
      id: '1',
      userId: 'user-1',
      lessonId: 'lesson-1',
      accuracy: 85,
      streakCount: 3,
      perfectStreak: 1,
      timeSpent: 600,
      ...progress,
    } as UserProgress;
  },
};

export const rewardService = {
  async getUserRewards(userId: string): Promise<Reward[]> {
    // Mock data for now
    return [];
  },

  async awardReward(reward: Partial<Reward>): Promise<Reward> {
    // Mock implementation
    return {
      id: '1',
      type: 'streak',
      title: 'Three Day Streak!',
      description: 'You practiced for three days in a row!',
      icon: '🔥',
      earnedAt: new Date(),
      value: 10,
      ...reward,
    } as Reward;
  },
};