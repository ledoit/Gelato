import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { Lesson, LessonSection, NavigationParams } from '../types';
import { LessonItemCard } from '../components/LessonItemCard';
import { lessonService } from '../services/supabase';
import { BRANDING, LAYOUT, TYPOGRAPHY } from '../constants/app';
import { scaleFont, getSpacing, getScreenDimensions, getContainerWidth } from '../utils/responsive';

type LessonScreenNavigationProp = StackNavigationProp<NavigationParams, 'Lesson'>;
type LessonScreenRouteProp = RouteProp<NavigationParams, 'Lesson'>;

interface LessonScreenProps {
  navigation: LessonScreenNavigationProp;
  route: LessonScreenRouteProp;
}

export const LessonScreen: React.FC<LessonScreenProps> = ({ navigation, route }) => {
  const { lessonId, moduleId } = route.params;
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const { isTablet } = getScreenDimensions();

  useEffect(() => {
    loadLesson();
  }, [lessonId]);

  const loadLesson = async () => {
    try {
      const lessonData = await lessonService.getById(lessonId);
      setLesson(lessonData);
    } catch (error) {
      console.error('Error loading lesson:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStartPractice = () => {
    if (lesson) {
      navigation.navigate('Practice', { lessonId: lesson.id });
    }
  };

  const renderSectionHeader = (section: LessonSection) => {
    const getSectionIcon = () => {
      switch (section.type) {
        case 'positive':
          return '⭐';
        case 'neutral':
          return '💡';
        case 'awareness':
          return '👁️';
        default:
          return '📖';
      }
    };

    const getSectionColor = () => {
      switch (section.type) {
        case 'positive':
          return BRANDING.primaryColor;
        case 'neutral':
          return BRANDING.secondaryColor;
        case 'awareness':
          return '#95A5A6';
        default:
          return BRANDING.primaryColor;
      }
    };

    return (
      <View style={[styles.sectionHeader, isTablet && styles.tabletSectionHeader]}>
        <View style={styles.sectionTitleContainer}>
          <Text style={[styles.sectionIcon, isTablet && styles.tabletSectionIcon]}>
            {getSectionIcon()}
          </Text>
          <Text style={[styles.sectionTitle, isTablet && styles.tabletSectionTitle]}>
            {section.title}
          </Text>
        </View>
        <Text style={[styles.sectionDescription, isTablet && styles.tabletSectionDescription]}>
          {section.description}
        </Text>
        {section.type === 'awareness' && (
          <View style={[styles.awarenessNotice, { backgroundColor: `${getSectionColor()}20` }]}>
            <Text style={[styles.awarenessText, isTablet && styles.tabletAwarenessText, { color: getSectionColor() }]}>
              Just so you recognize these words
            </Text>
          </View>
        )}
      </View>
    );
  };

  const renderSection = (section: LessonSection) => (
    <View key={section.type} style={styles.section}>
      {renderSectionHeader(section)}
      <View style={styles.itemsContainer}>
        {section.items.map((item) => (
          <LessonItemCard
            key={item.id}
            item={item}
            sectionType={section.type}
          />
        ))}
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, isTablet && styles.tabletLoadingText]}>
            Loading lesson...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!lesson) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, isTablet && styles.tabletErrorText]}>
            Lesson not found
          </Text>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.backButtonText, isTablet && styles.tabletBackButtonText]}>
              Go Back
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={BRANDING.primaryColor} />
      
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <LinearGradient
          colors={[BRANDING.primaryColor, BRANDING.secondaryColor]}
          style={styles.header}
        >
          <View style={[styles.headerContent, { width: getContainerWidth() }]}>
            <TouchableOpacity
              style={styles.backIcon}
              onPress={() => navigation.goBack()}
            >
              <Text style={[styles.backIconText, isTablet && styles.tabletBackIconText]}>
                ←
              </Text>
            </TouchableOpacity>
            
            <View style={styles.headerInfo}>
              <Text style={[styles.lessonTitle, isTablet && styles.tabletLessonTitle]}>
                {lesson.title}
              </Text>
              <Text style={[styles.lessonDescription, isTablet && styles.tabletLessonDescription]}>
                {lesson.description}
              </Text>
              <View style={styles.lessonMeta}>
                <Text style={[styles.duration, isTablet && styles.tabletDuration]}>
                  ⏱️ {lesson.estimatedDuration} min
                </Text>
                <Text style={[styles.difficulty, isTablet && styles.tabletDifficulty]}>
                  📊 {lesson.difficulty}
                </Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Content */}
        <View style={[styles.content, { width: getContainerWidth() }]}>
          {lesson.sections.map(renderSection)}
        </View>

        {/* Practice Button */}
        <View style={[styles.practiceContainer, { width: getContainerWidth() }]}>
          <TouchableOpacity style={styles.practiceButton} onPress={handleStartPractice}>
            <LinearGradient
              colors={[BRANDING.accentColor, '#F39C12']}
              style={[styles.practiceGradient, isTablet && styles.tabletPracticeGradient]}
            >
              <Text style={[styles.practiceIcon, isTablet && styles.tabletPracticeIcon]}>
                🎯
              </Text>
              <Text style={[styles.practiceText, isTablet && styles.tabletPracticeText]}>
                Start Practice
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: getSpacing(LAYOUT.spacing.xl),
  },
  errorText: {
    fontSize: scaleFont(TYPOGRAPHY.sizes.lg),
    color: '#E74C3C',
    marginBottom: getSpacing(LAYOUT.spacing.lg),
    textAlign: 'center',
  },
  tabletErrorText: {
    fontSize: scaleFont(TYPOGRAPHY.sizes.xl),
  },
  backButton: {
    backgroundColor: BRANDING.primaryColor,
    paddingHorizontal: getSpacing(LAYOUT.spacing.lg),
    paddingVertical: getSpacing(LAYOUT.spacing.md),
    borderRadius: LAYOUT.borderRadius,
  },
  backButtonText: {
    color: '#FFFFFF',
    fontSize: scaleFont(TYPOGRAPHY.sizes.md),
    fontWeight: TYPOGRAPHY.weights.semibold,
  },
  tabletBackButtonText: {
    fontSize: scaleFont(TYPOGRAPHY.sizes.lg),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    alignItems: 'center',
    paddingBottom: getSpacing(LAYOUT.spacing.xl),
  },
  header: {
    width: '100%',
    paddingVertical: getSpacing(LAYOUT.spacing.lg),
    paddingHorizontal: getSpacing(LAYOUT.spacing.md),
    alignItems: 'center',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'center',
  },
  backIcon: {
    marginRight: getSpacing(LAYOUT.spacing.md),
  },
  backIconText: {
    fontSize: scaleFont(24),
    color: '#FFFFFF',
  },
  tabletBackIconText: {
    fontSize: scaleFont(32),
  },
  headerInfo: {
    flex: 1,
  },
  lessonTitle: {
    fontSize: scaleFont(TYPOGRAPHY.sizes.xl),
    fontWeight: TYPOGRAPHY.weights.bold,
    color: '#FFFFFF',
    marginBottom: getSpacing(LAYOUT.spacing.xs),
  },
  tabletLessonTitle: {
    fontSize: scaleFont(TYPOGRAPHY.sizes.xxl),
  },
  lessonDescription: {
    fontSize: scaleFont(TYPOGRAPHY.sizes.md),
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: getSpacing(LAYOUT.spacing.sm),
    lineHeight: scaleFont(TYPOGRAPHY.sizes.md) * 1.4,
  },
  tabletLessonDescription: {
    fontSize: scaleFont(TYPOGRAPHY.sizes.lg),
    lineHeight: scaleFont(TYPOGRAPHY.sizes.lg) * 1.4,
  },
  lessonMeta: {
    flexDirection: 'row',
    gap: getSpacing(LAYOUT.spacing.md),
  },
  duration: {
    fontSize: scaleFont(TYPOGRAPHY.sizes.sm),
    color: 'rgba(255, 255, 255, 0.8)',
  },
  tabletDuration: {
    fontSize: scaleFont(TYPOGRAPHY.sizes.md),
  },
  difficulty: {
    fontSize: scaleFont(TYPOGRAPHY.sizes.sm),
    color: 'rgba(255, 255, 255, 0.8)',
    textTransform: 'capitalize',
  },
  tabletDifficulty: {
    fontSize: scaleFont(TYPOGRAPHY.sizes.md),
  },
  content: {
    alignSelf: 'center',
    paddingHorizontal: getSpacing(LAYOUT.spacing.md),
    paddingTop: getSpacing(LAYOUT.spacing.lg),
  },
  section: {
    marginBottom: getSpacing(LAYOUT.spacing.xl),
  },
  sectionHeader: {
    marginBottom: getSpacing(LAYOUT.spacing.md),
  },
  tabletSectionHeader: {
    marginBottom: getSpacing(LAYOUT.spacing.lg),
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: getSpacing(LAYOUT.spacing.xs),
  },
  sectionIcon: {
    fontSize: scaleFont(24),
    marginRight: getSpacing(LAYOUT.spacing.sm),
  },
  tabletSectionIcon: {
    fontSize: scaleFont(28),
  },
  sectionTitle: {
    fontSize: scaleFont(TYPOGRAPHY.sizes.lg),
    fontWeight: TYPOGRAPHY.weights.bold,
    color: '#2C3E50',
  },
  tabletSectionTitle: {
    fontSize: scaleFont(TYPOGRAPHY.sizes.xl),
  },
  sectionDescription: {
    fontSize: scaleFont(TYPOGRAPHY.sizes.sm),
    color: '#7F8C8D',
    lineHeight: scaleFont(TYPOGRAPHY.sizes.sm) * 1.4,
  },
  tabletSectionDescription: {
    fontSize: scaleFont(TYPOGRAPHY.sizes.md),
    lineHeight: scaleFont(TYPOGRAPHY.sizes.md) * 1.4,
  },
  awarenessNotice: {
    marginTop: getSpacing(LAYOUT.spacing.sm),
    padding: getSpacing(LAYOUT.spacing.sm),
    borderRadius: LAYOUT.borderRadius / 2,
  },
  awarenessText: {
    fontSize: scaleFont(TYPOGRAPHY.sizes.xs),
    fontWeight: TYPOGRAPHY.weights.medium,
    textAlign: 'center',
  },
  tabletAwarenessText: {
    fontSize: scaleFont(TYPOGRAPHY.sizes.sm),
  },
  itemsContainer: {
    gap: getSpacing(LAYOUT.spacing.xs),
  },
  practiceContainer: {
    alignSelf: 'center',
    paddingHorizontal: getSpacing(LAYOUT.spacing.md),
    paddingTop: getSpacing(LAYOUT.spacing.lg),
  },
  practiceButton: {
    width: '100%',
  },
  practiceGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: getSpacing(LAYOUT.spacing.md),
    paddingHorizontal: getSpacing(LAYOUT.spacing.xl),
    borderRadius: LAYOUT.borderRadius,
  },
  tabletPracticeGradient: {
    paddingVertical: getSpacing(LAYOUT.spacing.lg),
  },
  practiceIcon: {
    fontSize: scaleFont(24),
    marginRight: getSpacing(LAYOUT.spacing.sm),
  },
  tabletPracticeIcon: {
    fontSize: scaleFont(28),
  },
  practiceText: {
    color: '#FFFFFF',
    fontSize: scaleFont(TYPOGRAPHY.sizes.lg),
    fontWeight: TYPOGRAPHY.weights.bold,
  },
  tabletPracticeText: {
    fontSize: scaleFont(TYPOGRAPHY.sizes.xl),
  },
});