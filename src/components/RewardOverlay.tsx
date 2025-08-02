import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { LinearGradient } from 'expo-linear-gradient';
import { Reward } from '../types';
import { BRANDING, LAYOUT, TYPOGRAPHY } from '../constants/app';
import { scaleFont, getSpacing, getScreenDimensions, getContainerWidth } from '../utils/responsive';

interface RewardOverlayProps {
  visible: boolean;
  onClose: () => void;
  accuracy: number;
  streakCount: number;
  isPerfectLesson: boolean;
  rewards: Reward[];
}

export const RewardOverlay: React.FC<RewardOverlayProps> = ({
  visible,
  onClose,
  accuracy,
  streakCount,
  isPerfectLesson,
  rewards,
}) => {
  const { isTablet } = getScreenDimensions();
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const confettiRef = useRef<ConfettiCannon>(null);

  useEffect(() => {
    if (visible) {
      // Start confetti if high accuracy or perfect lesson
      if (accuracy >= 80 || isPerfectLesson) {
        setTimeout(() => {
          confettiRef.current?.start();
        }, 300);
      }

      // Animate in
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          tension: 100,
          friction: 8,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      // Reset animations
      scaleAnim.setValue(0);
      fadeAnim.setValue(0);
    }
  }, [visible, accuracy, isPerfectLesson]);

  const getAccuracyMessage = () => {
    if (isPerfectLesson) {
      return '🌟 Perfect! Amazing work!';
    } else if (accuracy >= 90) {
      return '🎉 Excellent! You\'re doing great!';
    } else if (accuracy >= 80) {
      return '✨ Great job! Keep it up!';
    } else if (accuracy >= 70) {
      return '👍 Good work! You\'re improving!';
    } else {
      return '💪 Nice try! Practice makes perfect!';
    }
  };

  const getAccuracyColor = () => {
    if (isPerfectLesson || accuracy >= 90) return BRANDING.accentColor;
    if (accuracy >= 80) return BRANDING.primaryColor;
    if (accuracy >= 70) return BRANDING.secondaryColor;
    return '#95A5A6';
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <Animated.View
          style={[
            styles.container,
            isTablet && styles.tabletContainer,
            {
              transform: [{ scale: scaleAnim }],
              opacity: fadeAnim,
            },
          ]}
        >
          <LinearGradient
            colors={['#FFFFFF', '#F8F9FA']}
            style={[styles.content, isTablet && styles.tabletContent]}
          >
            {/* Confetti */}
            <ConfettiCannon
              ref={confettiRef}
              count={isPerfectLesson ? 200 : accuracy >= 80 ? 100 : 50}
              origin={{ x: getContainerWidth() / 2, y: 0 }}
              autoStart={false}
              fadeOut
            />

            {/* Main Message */}
            <View style={styles.messageContainer}>
              <Text style={[styles.mainMessage, isTablet && styles.tabletMainMessage]}>
                {getAccuracyMessage()}
              </Text>
              
              <View
                style={[
                  styles.accuracyContainer,
                  { backgroundColor: getAccuracyColor() },
                ]}
              >
                <Text style={[styles.accuracyText, isTablet && styles.tabletAccuracyText]}>
                  {accuracy}% Accuracy
                </Text>
              </View>
            </View>

            {/* Streak Counter */}
            {streakCount > 0 && (
              <View style={styles.streakContainer}>
                <Text style={[styles.streakIcon, isTablet && styles.tabletStreakIcon]}>
                  🔥
                </Text>
                <View>
                  <Text style={[styles.streakText, isTablet && styles.tabletStreakText]}>
                    {streakCount} Day Streak!
                  </Text>
                  <Text style={[styles.streakSubtext, isTablet && styles.tabletStreakSubtext]}>
                    Keep up the consistency!
                  </Text>
                </View>
              </View>
            )}

            {/* Perfect Lesson Bonus */}
            {isPerfectLesson && (
              <View style={styles.bonusContainer}>
                <LinearGradient
                  colors={[BRANDING.accentColor, '#F39C12']}
                  style={styles.bonusGradient}
                >
                  <Text style={[styles.bonusIcon, isTablet && styles.tabletBonusIcon]}>
                    🏆
                  </Text>
                  <Text style={[styles.bonusText, isTablet && styles.tabletBonusText]}>
                    Perfect Lesson Bonus!
                  </Text>
                  <Text style={[styles.bonusSubtext, isTablet && styles.tabletBonusSubtext]}>
                    +100 XP for flawless performance
                  </Text>
                </LinearGradient>
              </View>
            )}

            {/* Rewards */}
            {rewards.length > 0 && (
              <View style={styles.rewardsContainer}>
                <Text style={[styles.rewardsTitle, isTablet && styles.tabletRewardsTitle]}>
                  Rewards Earned
                </Text>
                {rewards.map((reward) => (
                  <View key={reward.id} style={styles.rewardItem}>
                    <Text style={[styles.rewardIcon, isTablet && styles.tabletRewardIcon]}>
                      {reward.icon}
                    </Text>
                    <View style={styles.rewardText}>
                      <Text style={[styles.rewardTitle, isTablet && styles.tabletRewardTitle]}>
                        {reward.title}
                      </Text>
                      <Text style={[styles.rewardDescription, isTablet && styles.tabletRewardDescription]}>
                        {reward.description}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Continue Button */}
            <TouchableOpacity style={styles.continueButton} onPress={onClose}>
              <LinearGradient
                colors={[BRANDING.primaryColor, BRANDING.secondaryColor]}
                style={[styles.continueGradient, isTablet && styles.tabletContinueGradient]}
              >
                <Text style={[styles.continueText, isTablet && styles.tabletContinueText]}>
                  Continue Learning
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    width: '90%',
    maxWidth: 400,
  },
  tabletContainer: {
    maxWidth: 500,
  },
  content: {
    borderRadius: LAYOUT.borderRadius * 2,
    padding: getSpacing(LAYOUT.spacing.xl),
    alignItems: 'center',
  },
  tabletContent: {
    padding: getSpacing(LAYOUT.spacing.xl * 1.5),
  },
  messageContainer: {
    alignItems: 'center',
    marginBottom: getSpacing(LAYOUT.spacing.lg),
  },
  mainMessage: {
    fontSize: scaleFont(TYPOGRAPHY.sizes.xl),
    fontWeight: TYPOGRAPHY.weights.bold,
    color: '#2C3E50',
    textAlign: 'center',
    marginBottom: getSpacing(LAYOUT.spacing.md),
  },
  tabletMainMessage: {
    fontSize: scaleFont(TYPOGRAPHY.sizes.xxl),
  },
  accuracyContainer: {
    paddingHorizontal: getSpacing(LAYOUT.spacing.lg),
    paddingVertical: getSpacing(LAYOUT.spacing.md),
    borderRadius: LAYOUT.borderRadius,
  },
  accuracyText: {
    color: '#FFFFFF',
    fontSize: scaleFont(TYPOGRAPHY.sizes.lg),
    fontWeight: TYPOGRAPHY.weights.bold,
  },
  tabletAccuracyText: {
    fontSize: scaleFont(TYPOGRAPHY.sizes.xl),
  },
  streakContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    padding: getSpacing(LAYOUT.spacing.md),
    borderRadius: LAYOUT.borderRadius,
    marginBottom: getSpacing(LAYOUT.spacing.lg),
    alignSelf: 'stretch',
  },
  streakIcon: {
    fontSize: scaleFont(32),
    marginRight: getSpacing(LAYOUT.spacing.md),
  },
  tabletStreakIcon: {
    fontSize: scaleFont(40),
  },
  streakText: {
    fontSize: scaleFont(TYPOGRAPHY.sizes.lg),
    fontWeight: TYPOGRAPHY.weights.bold,
    color: '#E65100',
  },
  tabletStreakText: {
    fontSize: scaleFont(TYPOGRAPHY.sizes.xl),
  },
  streakSubtext: {
    fontSize: scaleFont(TYPOGRAPHY.sizes.sm),
    color: '#BF360C',
  },
  tabletStreakSubtext: {
    fontSize: scaleFont(TYPOGRAPHY.sizes.md),
  },
  bonusContainer: {
    alignSelf: 'stretch',
    marginBottom: getSpacing(LAYOUT.spacing.lg),
  },
  bonusGradient: {
    padding: getSpacing(LAYOUT.spacing.lg),
    borderRadius: LAYOUT.borderRadius,
    alignItems: 'center',
  },
  bonusIcon: {
    fontSize: scaleFont(40),
    marginBottom: getSpacing(LAYOUT.spacing.sm),
  },
  tabletBonusIcon: {
    fontSize: scaleFont(48),
  },
  bonusText: {
    color: '#FFFFFF',
    fontSize: scaleFont(TYPOGRAPHY.sizes.lg),
    fontWeight: TYPOGRAPHY.weights.bold,
    marginBottom: getSpacing(LAYOUT.spacing.xs),
  },
  tabletBonusText: {
    fontSize: scaleFont(TYPOGRAPHY.sizes.xl),
  },
  bonusSubtext: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: scaleFont(TYPOGRAPHY.sizes.sm),
  },
  tabletBonusSubtext: {
    fontSize: scaleFont(TYPOGRAPHY.sizes.md),
  },
  rewardsContainer: {
    alignSelf: 'stretch',
    marginBottom: getSpacing(LAYOUT.spacing.lg),
  },
  rewardsTitle: {
    fontSize: scaleFont(TYPOGRAPHY.sizes.lg),
    fontWeight: TYPOGRAPHY.weights.bold,
    color: '#2C3E50',
    marginBottom: getSpacing(LAYOUT.spacing.md),
    textAlign: 'center',
  },
  tabletRewardsTitle: {
    fontSize: scaleFont(TYPOGRAPHY.sizes.xl),
  },
  rewardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: getSpacing(LAYOUT.spacing.md),
    backgroundColor: '#E8F5E8',
    borderRadius: LAYOUT.borderRadius,
    marginBottom: getSpacing(LAYOUT.spacing.sm),
  },
  rewardIcon: {
    fontSize: scaleFont(24),
    marginRight: getSpacing(LAYOUT.spacing.md),
  },
  tabletRewardIcon: {
    fontSize: scaleFont(28),
  },
  rewardText: {
    flex: 1,
  },
  rewardTitle: {
    fontSize: scaleFont(TYPOGRAPHY.sizes.md),
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: '#2C3E50',
  },
  tabletRewardTitle: {
    fontSize: scaleFont(TYPOGRAPHY.sizes.lg),
  },
  rewardDescription: {
    fontSize: scaleFont(TYPOGRAPHY.sizes.sm),
    color: '#7F8C8D',
  },
  tabletRewardDescription: {
    fontSize: scaleFont(TYPOGRAPHY.sizes.md),
  },
  continueButton: {
    alignSelf: 'stretch',
  },
  continueGradient: {
    paddingVertical: getSpacing(LAYOUT.spacing.md),
    paddingHorizontal: getSpacing(LAYOUT.spacing.xl),
    borderRadius: LAYOUT.borderRadius,
    alignItems: 'center',
  },
  tabletContinueGradient: {
    paddingVertical: getSpacing(LAYOUT.spacing.lg),
  },
  continueText: {
    color: '#FFFFFF',
    fontSize: scaleFont(TYPOGRAPHY.sizes.lg),
    fontWeight: TYPOGRAPHY.weights.bold,
  },
  tabletContinueText: {
    fontSize: scaleFont(TYPOGRAPHY.sizes.xl),
  },
});