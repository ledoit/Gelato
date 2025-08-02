# 🍦 Gelato - AI-Driven Language Learning App

A mobile-first React Native + Expo app for AI-powered language learning with positive-only reinforcement.

## 🌟 Features

### 📱 Mobile-First Design
- **Universal Support**: iPhone, iPad, and Android tablets
- **Responsive Layout**: Adapts gracefully to all screen sizes
- **Tablet Optimized**: Enhanced layouts and larger text on iPads
- **No Web Dependencies**: Pure mobile experience

### 🎯 Learning System
- **Flavor-Based Modules**: Alphabet, Basics, Grammar "flavors"
- **Three-Section Lessons**: 
  - ⭐ **Positive**: Core vocabulary to practice
  - 💡 **Neutral**: Additional helpful context
  - 👁️ **Awareness**: Recognition-only words
- **Positive-Only Feedback**: No "wrong" states, only encouragement
- **AI-Generated Content**: Ready for GPT-4o lesson creation

### 🎤 Practice & Recognition
- **Voice Recording**: Microphone input for pronunciation practice
- **Whisper Integration**: Ready for OpenAI Whisper transcription
- **TTS Support**: Text-to-speech for correct pronunciation
- **Camera Ready**: Permissions for future AR features

### 🎉 Gamification & Rewards
- **Confetti Animations**: Celebrate achievements
- **Streak Counter**: Track daily practice consistency
- **Perfect Lesson Bonus**: Extra rewards for 100% accuracy
- **Progress Tracking**: Visual progress indicators

## 🏗️ Architecture

### Project Structure
```
src/
├── components/          # Reusable UI components
│   ├── ModuleCard.tsx   # Learning module cards
│   ├── LessonItemCard.tsx # Individual lesson items
│   └── RewardOverlay.tsx # Achievement celebrations
├── screens/             # Main app screens
│   ├── HomeScreen.tsx   # Module selection
│   ├── LessonScreen.tsx # Lesson content display
│   └── PracticeScreen.tsx # Voice practice
├── services/            # Backend integrations
│   ├── supabase.ts      # Database operations
│   └── ai.ts            # GPT-4o & TTS services
├── types/               # TypeScript definitions
├── constants/           # App configuration
├── utils/               # Helper functions
└── navigation/          # React Navigation setup
```

### 🛠️ Tech Stack
- **Framework**: React Native + Expo
- **Language**: TypeScript
- **Navigation**: React Navigation 6
- **Database**: Supabase (with schema stubs)
- **Audio**: Expo AV + Camera
- **Animations**: React Native Reanimated
- **UI**: Linear Gradients + Confetti

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- Expo CLI
- iOS Simulator or Android Emulator
- Physical device for testing audio features

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd Gelato

# Install dependencies
npm install

# Start development server
npx expo start
```

### Run on Device
```bash
# iOS (requires macOS)
npx expo run:ios

# Android
npx expo run:android

# Development build
npx expo start --dev-client
```

## 📱 Responsive Design

### Tablet Support
- **Grid Layouts**: 2 columns on phones, 3-4 on tablets
- **Scalable Typography**: Automatic font scaling
- **Container Widths**: Content limited for readability
- **Touch Targets**: Larger buttons on tablets

### Screen Adaptations
- **Portrait/Landscape**: Automatic orientation handling
- **Safe Areas**: Proper insets for notched devices
- **Dynamic Spacing**: Responsive margins and padding

## 🤖 AI Integration (Ready)

### GPT-4o Lesson Generation
```typescript
// Generate contextual lessons
const lesson = await aiService.generateLesson(
  'basic-greetings',
  'beginner',
  'spanish'
);
```

### Whisper Speech Recognition
```typescript
// Transcribe and validate pronunciation
const result = await whisperService.transcribeAndValidate(
  audioUrl,
  expectedText,
  'es'
);
```

### Text-to-Speech
```typescript
// Generate audio for words
const audioUrl = await ttsService.generateAudio(
  'Hola',
  'es'
);
```

## 📊 Database Schema (Supabase)

### Tables
- **languages**: Available learning languages
- **modules**: Learning modules (Flavors)
- **lessons**: Individual lesson content
- **user_progress**: Learning progress tracking
- **rewards**: Achievement system

### Sample Data
Mock data included for:
- Spanish, French, German languages
- Alphabet, Basics, Grammar modules
- Basic greetings lesson with sections

## 🎨 Design System

### Brand Colors
- **Primary**: `#FF6B6B` (Coral)
- **Secondary**: `#4ECDC4` (Turquoise)
- **Accent**: `#FFE66D` (Yellow)
- **Background**: `#F8F9FA` (Light Gray)

### Typography
- **Responsive scaling** based on device type
- **Weight hierarchy**: Regular, Medium, Semibold, Bold
- **Accessibility**: High contrast ratios

## 🔄 Positive Reinforcement System

### No "Wrong" States
- Incorrect attempts show correct pronunciation
- Encouraging messages: "Try again like this..."
- Audio playback of correct pronunciation
- Progress continues regardless of accuracy

### Celebration System
- **80%+ Accuracy**: Confetti animation
- **100% Perfect**: Bonus confetti + special badge
- **Streak Rewards**: Daily practice recognition
- **Milestone Badges**: Progress achievements

## 📋 Development Roadmap

### Phase 1: Core Features ✅
- [x] Mobile app scaffold
- [x] Responsive design system
- [x] Navigation structure
- [x] Basic lesson flow
- [x] Mock data integration

### Phase 2: AI Integration 🔄
- [ ] Connect GPT-4o for lesson generation
- [ ] Implement Whisper speech recognition
- [ ] Add TTS audio generation
- [ ] Real-time pronunciation feedback

### Phase 3: Advanced Features 📋
- [ ] User authentication
- [ ] Progress synchronization
- [ ] Offline lesson caching
- [ ] AR vocabulary features
- [ ] Social learning features

## 🛡️ Permissions

### Required Permissions
- **Microphone**: Voice recording for pronunciation
- **Camera**: Future AR features (optional)

### Privacy
- All audio processing designed for privacy
- No sensitive data stored locally
- User control over recordings

## 🧪 Testing

### Development Testing
```bash
# Run on iOS Simulator
npx expo start --ios

# Run on Android Emulator  
npx expo start --android

# Test on physical device
npx expo start --tunnel
```

### Features to Test
- [x] Responsive layout on different screen sizes
- [x] Navigation between screens
- [x] Audio permission requests
- [x] Mock data display
- [ ] Real audio recording (requires physical device)
- [ ] Performance on older devices

## 📄 License

This project is proprietary software developed for Menhir.

## 🤝 Contributing

### Code Style
- TypeScript strict mode
- ESLint + Prettier configuration
- Component-based architecture
- Responsive design patterns

### Commit Messages
```
feat: Add new feature
fix: Bug fix
style: UI/styling changes
refactor: Code restructuring
docs: Documentation updates
```

---

**Built with ❤️ for language learners everywhere**

Ready to plug in AI-generated lessons and start learning! 🚀