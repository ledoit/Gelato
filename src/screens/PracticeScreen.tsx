import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Audio } from 'expo-av';
import { Camera } from 'expo-camera';
import { Lesson, LessonItem, PracticeResponse, NavigationParams, Reward } from '../types';
import { RewardOverlay } from '../components/RewardOverlay';
import { lessonService } from '../services/supabase';
import { whisperService, ttsService } from '../services/ai';
import { BRANDING, LAYOUT, TYPOGRAPHY } from '../constants/app';
import { scaleFont, getSpacing, getScreenDimensions, getContainerWidth } from '../utils/responsive';

type PracticeScreenNavigationProp = StackNavigationProp<NavigationParams, 'Practice'>;
type PracticeScreenRouteProp = RouteProp<NavigationParams, 'Practice'>;

interface PracticeScreenProps {
  navigation: PracticeScreenNavigationProp;
  route: PracticeScreenRouteProp;
}

type PracticeState = 'waiting' | 'recording' | 'processing' | 'feedback' | 'completed';

export const PracticeScreen: React.FC<PracticeScreenProps> = ({ navigation, route }) => {
  const { lessonId } = route.params;
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [practiceItems, setPracticeItems] = useState<LessonItem[]>([]);
  const [responses, setResponses] = useState<PracticeResponse[]>([]);
  const [state, setState] = useState<PracticeState>('waiting');
  const [isRecording, setIsRecording] = useState(false);
  const [showReward, setShowReward] = useState(false);
  const [sessionAccuracy, setSessionAccuracy] = useState(0);
  const [streakCount, setStreakCount] = useState(3); // Mock streak
  const [attemptCount, setAttemptCount] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const { isTablet } = getScreenDimensions();
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const recording = useRef<Audio.Recording | null>(null);

  useEffect(() => {
    loadLesson();
    setupAudio();
    // Mock camera permission request
    requestCameraPermission();
  }, [lessonId]);

  useEffect(() => {
    if (state === 'recording') {
      startPulseAnimation();
    } else {
      stopPulseAnimation();
    }
  }, [state]);

  const loadLesson = async () => {
    try {
      const lessonData = await lessonService.getById(lessonId);
      if (lessonData) {
        setLesson(lessonData);
        // Only include positive and neutral items for practice
        const items = lessonData.sections
          .filter(section => section.type !== 'awareness')
          .flatMap(section => section.items);
        setPracticeItems(items);
      }
    } catch (error) {
      console.error('Error loading lesson:', error);
    }
  };

  const setupAudio = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });
    } catch (error) {
      console.error('Error setting up audio:', error);
    }
  };

  const requestCameraPermission = async () => {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Camera Permission',
          'Camera access is needed for future AR features. You can enable it later in settings.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error requesting camera permission:', error);
    }
  };

  const startPulseAnimation = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopPulseAnimation = () => {
    pulseAnim.setValue(1);
  };

  const startRecording = async () => {
    try {
      setIsRecording(true);
      setState('recording');
      
      // Mock recording setup
      console.log('Starting recording...');
      
      // In real implementation:
      // recording.current = new Audio.Recording();
      // await recording.current.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
      // await recording.current.startAsync();
    } catch (error) {
      console.error('Error starting recording:', error);
      setIsRecording(false);
      setState('waiting');
    }
  };

  const stopRecording = async () => {
    try {
      setIsRecording(false);
      setState('processing');

      // Mock recording stop
      console.log('Stopping recording...');
      
      // In real implementation:
      // await recording.current?.stopAndUnloadAsync();
      // const uri = recording.current?.getURI();
      
      // Mock processing with Whisper
      const currentItem = practiceItems[currentItemIndex];
      const result = await whisperService.transcribeAndValidate(
        'mock-audio-url',
        currentItem.word,
        'es'
      );

      // Process the result with positive-only feedback
      await processResponse(result);
    } catch (error) {
      console.error('Error stopping recording:', error);
      setState('waiting');
    }
  };

  const processResponse = async (result: { transcription: string; isCorrect: boolean; similarity: number }) => {
    const currentItem = practiceItems[currentItemIndex];
    const newAttempt = attemptCount + 1;
    
    const response: PracticeResponse = {
      id: Date.now().toString(),
      itemId: currentItem.id,
      userResponse: result.transcription,
      expectedResponse: currentItem.word,
      isCorrect: result.isCorrect,
      attempts: newAttempt,
    };

    if (result.isCorrect || result.similarity > 0.7) {
      // Positive feedback - move to next item
      setFeedbackMessage('🎉 Excellent! That sounded great!');
      setResponses(prev => [...prev, response]);
      
      setTimeout(() => {
        moveToNextItem();
      }, 2000);
    } else {
      // Positive-only approach: Show correct pronunciation and encourage
      setFeedbackMessage(`💪 Try again like this: "${currentItem.word}"`);
      
      // Play correct pronunciation
      await playCorrectPronunciation(currentItem);
      
      setAttemptCount(newAttempt);
      
      setTimeout(() => {
        setState('waiting');
        setFeedbackMessage('');
      }, 3000);
    }

    setState('feedback');
  };

  const playCorrectPronunciation = async (item: LessonItem) => {
    try {
      // Mock TTS playback
      console.log(`Playing correct pronunciation for: ${item.word}`);
      await ttsService.generateAudio(item.word, 'es');
    } catch (error) {
      console.error('Error playing pronunciation:', error);
    }
  };

  const moveToNextItem = () => {
    const nextIndex = currentItemIndex + 1;
    
    if (nextIndex >= practiceItems.length) {
      // Practice session completed
      completeSession();
    } else {
      setCurrentItemIndex(nextIndex);
      setAttemptCount(0);
      setState('waiting');
      setFeedbackMessage('');
    }
  };

  const completeSession = () => {
    const accuracy = Math.round((responses.filter(r => r.isCorrect).length / responses.length) * 100) || 0;
    const isPerfect = accuracy === 100;
    
    setSessionAccuracy(accuracy);
    setState('completed');
    
    // Show rewards
    setTimeout(() => {
      setShowReward(true);
    }, 500);
  };

  const handleRewardClose = () => {
    setShowReward(false);
    navigation.goBack();
  };

  const getCurrentItem = () => {
    return practiceItems[currentItemIndex];
  };

  const getProgress = () => {
    return practiceItems.length > 0 ? (currentItemIndex / practiceItems.length) * 100 : 0;
  };

  if (!lesson || practiceItems.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, isTablet && styles.tabletLoadingText]}>
            Preparing your practice session...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentItem = getCurrentItem();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={BRANDING.primaryColor} />
      
      {/* Header */}
      <LinearGradient
        colors={[BRANDING.primaryColor, BRANDING.secondaryColor]}
        style={styles.header}
      >
        <View style={[styles.headerContent, { width: getContainerWidth() }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.backButtonText, isTablet && styles.tabletBackButtonText]}>
              ← Back
            </Text>
          </TouchableOpacity>
          
          <View style={styles.progressContainer}>
            <Text style={[styles.progressText, isTablet && styles.tabletProgressText]}>
              {currentItemIndex + 1} of {practiceItems.length}
            </Text>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${getProgress()}%` },
                ]}
              />
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Main Content */}
      <View style={[styles.content, { width: getContainerWidth() }]}>
        {state !== 'completed' && currentItem && (
          <>
            {/* Current Word */}
            <View style={styles.wordContainer}>
              <Text style={[styles.instruction, isTablet && styles.tabletInstruction]}>
                Say this word:
              </Text>
              <Text style={[styles.currentWord, isTablet && styles.tabletCurrentWord]}>
                {currentItem.word}
              </Text>
              <Text style={[styles.translation, isTablet && styles.tabletTranslation]}>
                "{currentItem.translation}"
              </Text>
              {currentItem.phonetic && (
                <Text style={[styles.phonetic, isTablet && styles.tabletPhonetic]}>
                  /{currentItem.phonetic}/
                </Text>
              )}
            </View>

            {/* Feedback Message */}
            {feedbackMessage && (
              <View style={styles.feedbackContainer}>
                <Text style={[styles.feedbackText, isTablet && styles.tabletFeedbackText]}>
                  {feedbackMessage}
                </Text>
              </View>
            )}

            {/* Recording Button */}
            <View style={styles.recordingContainer}>
              <Animated.View
                style={[
                  styles.recordingButton,
                  isTablet && styles.tabletRecordingButton,
                  { transform: [{ scale: pulseAnim }] },
                ]}
              >
                <TouchableOpacity
                  style={[
                    styles.recordButton,
                    isTablet && styles.tabletRecordButton,
                    isRecording && styles.recordButtonActive,
                  ]}
                  onPress={isRecording ? stopRecording : startRecording}
                  disabled={state === 'processing' || state === 'feedback'}
                >
                  <Text style={[styles.recordIcon, isTablet && styles.tabletRecordIcon]}>
                    {state === 'processing' ? '⏳' : isRecording ? '⏹️' : '🎤'}
                  </Text>
                </TouchableOpacity>
              </Animated.View>
              
              <Text style={[styles.recordingInstructions, isTablet && styles.tabletRecordingInstructions]}>
                {state === 'processing'
                  ? 'Processing your pronunciation...'
                  : isRecording
                  ? 'Recording... Tap to stop'
                  : 'Tap to record your pronunciation'
                }
              </Text>
            </View>
          </>
        )}

        {state === 'completed' && (
          <View style={styles.completedContainer}>
            <Text style={[styles.completedTitle, isTablet && styles.tabletCompletedTitle]}>
              🎉 Practice Complete!
            </Text>
            <Text style={[styles.completedSubtitle, isTablet && styles.tabletCompletedSubtitle]}>
              Great job practicing your pronunciation!
            </Text>
          </View>
        )}
      </View>

      {/* Reward Overlay */}
      <RewardOverlay
        visible={showReward}
        onClose={handleRewardClose}
        accuracy={sessionAccuracy}
        streakCount={streakCount}
        isPerfectLesson={sessionAccuracy === 100}
        rewards={[]} // Mock rewards would be generated here
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BRANDING.backgroundColor,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: getSpacing(LAYOUT.spacing.xl),
  },
  loadingText: {
    fontSize: scaleFont(TYPOGRAPHY.sizes.lg),
    color: BRANDING.primaryColor,
    textAlign: 'center',
  },
  tabletLoadingText: {
    fontSize: scaleFont(TYPOGRAPHY.sizes.xl),
  },
  header: {
    paddingVertical: getSpacing(LAYOUT.spacing.md),
    paddingHorizontal: getSpacing(LAYOUT.spacing.md),
    alignItems: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    alignSelf: 'center',
  },
  backButton: {
    flex: 1,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: scaleFont(TYPOGRAPHY.sizes.md),
    fontWeight: TYPOGRAPHY.weights.medium,
  },
  tabletBackButtonText: {
    fontSize: scaleFont(TYPOGRAPHY.sizes.lg),
  },
  progressContainer: {
    flex: 2,
    alignItems: 'center',
  },
  progressText: {
    color: '#FFFFFF',
    fontSize: scaleFont(TYPOGRAPHY.sizes.sm),
    marginBottom: getSpacing(LAYOUT.spacing.xs),
  },
  tabletProgressText: {
    fontSize: scaleFont(TYPOGRAPHY.sizes.md),
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  content: {
    flex: 1,
    alignSelf: 'center',
    paddingHorizontal: getSpacing(LAYOUT.spacing.md),
    justifyContent: 'center',
  },
  wordContainer: {
    alignItems: 'center',
    marginBottom: getSpacing(LAYOUT.spacing.xl),
  },
  instruction: {
    fontSize: scaleFont(TYPOGRAPHY.sizes.lg),
    color: '#7F8C8D',
    marginBottom: getSpacing(LAYOUT.spacing.md),
  },
  tabletInstruction: {
    fontSize: scaleFont(TYPOGRAPHY.sizes.xl),
  },
  currentWord: {
    fontSize: scaleFont(48),
    fontWeight: TYPOGRAPHY.weights.bold,
    color: BRANDING.primaryColor,
    marginBottom: getSpacing(LAYOUT.spacing.sm),
    textAlign: 'center',
  },
  tabletCurrentWord: {
    fontSize: scaleFont(64),
  },
  translation: {
    fontSize: scaleFont(TYPOGRAPHY.sizes.xl),
    color: '#34495E',
    marginBottom: getSpacing(LAYOUT.spacing.xs),
    textAlign: 'center',
  },
  tabletTranslation: {
    fontSize: scaleFont(TYPOGRAPHY.sizes.xxl),
  },
  phonetic: {
    fontSize: scaleFont(TYPOGRAPHY.sizes.lg),
    color: '#7F8C8D',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  tabletPhonetic: {
    fontSize: scaleFont(TYPOGRAPHY.sizes.xl),
  },
  feedbackContainer: {
    backgroundColor: '#E8F5E8',
    padding: getSpacing(LAYOUT.spacing.md),
    borderRadius: LAYOUT.borderRadius,
    marginBottom: getSpacing(LAYOUT.spacing.lg),
  },
  feedbackText: {
    fontSize: scaleFont(TYPOGRAPHY.sizes.lg),
    color: '#27AE60',
    textAlign: 'center',
    fontWeight: TYPOGRAPHY.weights.medium,
  },
  tabletFeedbackText: {
    fontSize: scaleFont(TYPOGRAPHY.sizes.xl),
  },
  recordingContainer: {
    alignItems: 'center',
  },
  recordingButton: {
    marginBottom: getSpacing(LAYOUT.spacing.lg),
  },
  tabletRecordingButton: {
    marginBottom: getSpacing(LAYOUT.spacing.xl),
  },
  recordButton: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: BRANDING.primaryColor,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  tabletRecordButton: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  recordButtonActive: {
    backgroundColor: '#E74C3C',
  },
  recordIcon: {
    fontSize: scaleFont(40),
  },
  tabletRecordIcon: {
    fontSize: scaleFont(48),
  },
  recordingInstructions: {
    fontSize: scaleFont(TYPOGRAPHY.sizes.md),
    color: '#7F8C8D',
    textAlign: 'center',
    maxWidth: '80%',
  },
  tabletRecordingInstructions: {
    fontSize: scaleFont(TYPOGRAPHY.sizes.lg),
  },
  completedContainer: {
    alignItems: 'center',
  },
  completedTitle: {
    fontSize: scaleFont(TYPOGRAPHY.sizes.xxl),
    fontWeight: TYPOGRAPHY.weights.bold,
    color: BRANDING.primaryColor,
    marginBottom: getSpacing(LAYOUT.spacing.md),
    textAlign: 'center',
  },
  tabletCompletedTitle: {
    fontSize: scaleFont(40),
  },
  completedSubtitle: {
    fontSize: scaleFont(TYPOGRAPHY.sizes.lg),
    color: '#7F8C8D',
    textAlign: 'center',
  },
  tabletCompletedSubtitle: {
    fontSize: scaleFont(TYPOGRAPHY.sizes.xl),
  },
});