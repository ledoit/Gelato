import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { Audio } from 'expo-av';
import { LessonItem } from '../types';
import { BRANDING, LAYOUT, TYPOGRAPHY } from '../constants/app';
import { scaleFont, getSpacing, getScreenDimensions } from '../utils/responsive';

interface LessonItemCardProps {
  item: LessonItem;
  sectionType: 'positive' | 'neutral' | 'awareness';
  onPress?: () => void;
}

export const LessonItemCard: React.FC<LessonItemCardProps> = ({
  item,
  sectionType,
  onPress,
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const { isTablet } = getScreenDimensions();

  const getSectionColor = () => {
    switch (sectionType) {
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

  const playAudio = async () => {
    if (isPlayingAudio) return;

    try {
      setIsPlayingAudio(true);
      
      // Mock audio playback - in real implementation, use item.audioUrl
      // const { sound } = await Audio.Sound.createAsync({ uri: item.audioUrl });
      // await sound.playAsync();
      
      // Mock delay for audio playback
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log(`Playing audio for: ${item.word}`);
    } catch (error) {
      console.error('Error playing audio:', error);
    } finally {
      setIsPlayingAudio(false);
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isTablet && styles.tabletContainer,
        { borderLeftColor: getSectionColor() },
      ]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={[styles.word, isTablet && styles.tabletWord]}>
            {item.word}
          </Text>
          <Text style={[styles.translation, isTablet && styles.tabletTranslation]}>
            {item.translation}
          </Text>
          {item.phonetic && (
            <Text style={[styles.phonetic, isTablet && styles.tabletPhonetic]}>
              /{item.phonetic}/
            </Text>
          )}
        </View>

        <TouchableOpacity
          style={[
            styles.audioButton,
            isTablet && styles.tabletAudioButton,
            { backgroundColor: getSectionColor() },
            isPlayingAudio && styles.audioButtonPlaying,
          ]}
          onPress={playAudio}
          disabled={isPlayingAudio || sectionType === 'awareness'}
        >
          {isPlayingAudio ? (
            <ActivityIndicator color="#FFFFFF" size="small" />
          ) : (
            <Text style={[styles.audioIcon, isTablet && styles.tabletAudioIcon]}>
              {sectionType === 'awareness' ? '👁️' : '🔊'}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: LAYOUT.borderRadius,
    marginBottom: getSpacing(LAYOUT.spacing.sm),
    borderLeftWidth: 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
  },
  tabletContainer: {
    marginBottom: getSpacing(LAYOUT.spacing.md),
    borderLeftWidth: 6,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: getSpacing(LAYOUT.spacing.md),
  },
  textContainer: {
    flex: 1,
    marginRight: getSpacing(LAYOUT.spacing.md),
  },
  word: {
    fontSize: scaleFont(TYPOGRAPHY.sizes.lg),
    fontWeight: TYPOGRAPHY.weights.bold,
    color: '#2C3E50',
    marginBottom: getSpacing(LAYOUT.spacing.xs),
  },
  tabletWord: {
    fontSize: scaleFont(TYPOGRAPHY.sizes.xl),
  },
  translation: {
    fontSize: scaleFont(TYPOGRAPHY.sizes.md),
    color: '#34495E',
    marginBottom: getSpacing(LAYOUT.spacing.xs),
  },
  tabletTranslation: {
    fontSize: scaleFont(TYPOGRAPHY.sizes.lg),
  },
  phonetic: {
    fontSize: scaleFont(TYPOGRAPHY.sizes.sm),
    color: '#7F8C8D',
    fontStyle: 'italic',
  },
  tabletPhonetic: {
    fontSize: scaleFont(TYPOGRAPHY.sizes.md),
  },
  audioButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabletAudioButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  audioButtonPlaying: {
    opacity: 0.7,
  },
  audioIcon: {
    fontSize: scaleFont(20),
  },
  tabletAudioIcon: {
    fontSize: scaleFont(24),
  },
});