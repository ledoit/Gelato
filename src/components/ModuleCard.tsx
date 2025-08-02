import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Module } from '../types';
import { BRANDING, LAYOUT, TYPOGRAPHY } from '../constants/app';
import { scaleFont, getSpacing, getScreenDimensions } from '../utils/responsive';

interface ModuleCardProps {
  module: Module;
  onPress: () => void;
}

export const ModuleCard: React.FC<ModuleCardProps> = ({ module, onPress }) => {
  const { isTablet } = getScreenDimensions();
  const progress = module.lessonsCount > 0 ? module.completedLessons / module.lessonsCount : 0;

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.8}>
      <LinearGradient
        colors={[module.color, `${module.color}CC`]}
        style={[styles.card, isTablet && styles.tabletCard]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.header}>
          <Text style={[styles.icon, isTablet && styles.tabletIcon]}>
            {module.icon}
          </Text>
          <View style={styles.badgeContainer}>
            <Text style={styles.badge}>{module.difficulty}</Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={[styles.title, isTablet && styles.tabletTitle]}>
            {module.title}
          </Text>
          <Text style={[styles.description, isTablet && styles.tabletDescription]}>
            {module.description}
          </Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View
                style={[
                  styles.progressFill,
                  { width: `${progress * 100}%` },
                ]}
              />
            </View>
            <Text style={[styles.progressText, isTablet && styles.tabletProgressText]}>
              {module.completedLessons}/{module.lessonsCount} lessons
            </Text>
          </View>
        </View>
      </LinearGradient>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    margin: getSpacing(LAYOUT.spacing.sm),
  },
  card: {
    borderRadius: LAYOUT.borderRadius,
    padding: getSpacing(LAYOUT.spacing.md),
    minHeight: 180,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  tabletCard: {
    minHeight: 220,
    padding: getSpacing(LAYOUT.spacing.lg),
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: getSpacing(LAYOUT.spacing.sm),
  },
  icon: {
    fontSize: scaleFont(32),
  },
  tabletIcon: {
    fontSize: scaleFont(40),
  },
  badgeContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: getSpacing(LAYOUT.spacing.sm),
    paddingVertical: getSpacing(LAYOUT.spacing.xs),
    borderRadius: 12,
  },
  badge: {
    color: '#FFFFFF',
    fontSize: scaleFont(TYPOGRAPHY.sizes.xs),
    fontWeight: TYPOGRAPHY.weights.medium,
    textTransform: 'capitalize',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    color: '#FFFFFF',
    fontSize: scaleFont(TYPOGRAPHY.sizes.lg),
    fontWeight: TYPOGRAPHY.weights.bold,
    marginBottom: getSpacing(LAYOUT.spacing.xs),
  },
  tabletTitle: {
    fontSize: scaleFont(TYPOGRAPHY.sizes.xl),
  },
  description: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: scaleFont(TYPOGRAPHY.sizes.sm),
    fontWeight: TYPOGRAPHY.weights.regular,
    lineHeight: scaleFont(TYPOGRAPHY.sizes.sm) * 1.4,
  },
  tabletDescription: {
    fontSize: scaleFont(TYPOGRAPHY.sizes.md),
    lineHeight: scaleFont(TYPOGRAPHY.sizes.md) * 1.4,
  },
  footer: {
    marginTop: getSpacing(LAYOUT.spacing.md),
  },
  progressContainer: {
    gap: getSpacing(LAYOUT.spacing.xs),
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
  },
  progressText: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: scaleFont(TYPOGRAPHY.sizes.xs),
    fontWeight: TYPOGRAPHY.weights.medium,
  },
  tabletProgressText: {
    fontSize: scaleFont(TYPOGRAPHY.sizes.sm),
  },
});