import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
  StatusBar,
  RefreshControl,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { StackNavigationProp } from '@react-navigation/stack';
import { Module, NavigationParams } from '../types';
import { ModuleCard } from '../components/ModuleCard';
import { moduleService } from '../services/supabase';
import { APP_NAME, BRANDING, LAYOUT, TYPOGRAPHY } from '../constants/app';
import { scaleFont, getSpacing, getScreenDimensions, getGridColumns, getContainerWidth } from '../utils/responsive';

type HomeScreenNavigationProp = StackNavigationProp<NavigationParams, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const [modules, setModules] = useState<Module[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const { isTablet } = getScreenDimensions();
  const numColumns = getGridColumns();

  useEffect(() => {
    loadModules();
  }, []);

  const loadModules = async () => {
    try {
      const moduleData = await moduleService.getAll();
      setModules(moduleData);
    } catch (error) {
      console.error('Error loading modules:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadModules();
    setRefreshing(false);
  };

  const handleModulePress = (module: Module) => {
    // Navigate to lesson selection or first lesson
    navigation.navigate('Lesson', {
      lessonId: '1', // First lesson in module
      moduleId: module.id,
    });
  };

  const renderModule = ({ item, index }: { item: Module; index: number }) => (
    <View style={[styles.moduleContainer, { width: `${100 / numColumns}%` }]}>
      <ModuleCard module={item} onPress={() => handleModulePress(item)} />
    </View>
  );

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <LinearGradient
        colors={[BRANDING.primaryColor, BRANDING.secondaryColor]}
        style={styles.headerGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={[styles.headerContent, { width: getContainerWidth() }]}>
          <Text style={[styles.appTitle, isTablet && styles.tabletAppTitle]}>
            {APP_NAME}
          </Text>
          <Text style={[styles.subtitle, isTablet && styles.tabletSubtitle]}>
            Choose your learning flavor
          </Text>
          <Text style={[styles.description, isTablet && styles.tabletDescription]}>
            Each flavor offers a unique approach to mastering a new language
          </Text>
        </View>
      </LinearGradient>
    </View>
  );

  const renderFooter = () => (
    <View style={styles.footerContainer}>
      <Text style={[styles.footerText, isTablet && styles.tabletFooterText]}>
        🌟 More flavors coming soon!
      </Text>
      <Text style={[styles.footerSubtext, isTablet && styles.tabletFooterSubtext]}>
        Each lesson is personalized and adapts to your learning style
      </Text>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, isTablet && styles.tabletLoadingText]}>
            Loading your learning flavors...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={BRANDING.primaryColor} />
      
      <FlatList
        data={modules}
        renderItem={renderModule}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        key={numColumns} // Force re-render when columns change
        ListHeaderComponent={renderHeader}
        ListFooterComponent={renderFooter}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[BRANDING.primaryColor]}
            tintColor={BRANDING.primaryColor}
          />
        }
        showsVerticalScrollIndicator={false}
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
  listContainer: {
    flexGrow: 1,
  },
  headerContainer: {
    marginBottom: getSpacing(LAYOUT.spacing.lg),
  },
  headerGradient: {
    alignItems: 'center',
    paddingVertical: getSpacing(LAYOUT.spacing.xl),
    paddingHorizontal: getSpacing(LAYOUT.spacing.md),
  },
  headerContent: {
    alignItems: 'center',
    alignSelf: 'center',
  },
  appTitle: {
    fontSize: scaleFont(TYPOGRAPHY.sizes.xxl),
    fontWeight: TYPOGRAPHY.weights.bold,
    color: '#FFFFFF',
    marginBottom: getSpacing(LAYOUT.spacing.sm),
    textAlign: 'center',
  },
  tabletAppTitle: {
    fontSize: scaleFont(40),
  },
  subtitle: {
    fontSize: scaleFont(TYPOGRAPHY.sizes.lg),
    fontWeight: TYPOGRAPHY.weights.medium,
    color: 'rgba(255, 255, 255, 0.95)',
    marginBottom: getSpacing(LAYOUT.spacing.xs),
    textAlign: 'center',
  },
  tabletSubtitle: {
    fontSize: scaleFont(TYPOGRAPHY.sizes.xl),
  },
  description: {
    fontSize: scaleFont(TYPOGRAPHY.sizes.md),
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    lineHeight: scaleFont(TYPOGRAPHY.sizes.md) * 1.4,
  },
  tabletDescription: {
    fontSize: scaleFont(TYPOGRAPHY.sizes.lg),
    lineHeight: scaleFont(TYPOGRAPHY.sizes.lg) * 1.4,
  },
  moduleContainer: {
    paddingHorizontal: getSpacing(LAYOUT.spacing.xs),
  },
  footerContainer: {
    padding: getSpacing(LAYOUT.spacing.xl),
    alignItems: 'center',
    marginTop: getSpacing(LAYOUT.spacing.lg),
  },
  footerText: {
    fontSize: scaleFont(TYPOGRAPHY.sizes.lg),
    fontWeight: TYPOGRAPHY.weights.semibold,
    color: BRANDING.primaryColor,
    marginBottom: getSpacing(LAYOUT.spacing.sm),
    textAlign: 'center',
  },
  tabletFooterText: {
    fontSize: scaleFont(TYPOGRAPHY.sizes.xl),
  },
  footerSubtext: {
    fontSize: scaleFont(TYPOGRAPHY.sizes.sm),
    color: '#7F8C8D',
    textAlign: 'center',
    lineHeight: scaleFont(TYPOGRAPHY.sizes.sm) * 1.4,
  },
  tabletFooterSubtext: {
    fontSize: scaleFont(TYPOGRAPHY.sizes.md),
    lineHeight: scaleFont(TYPOGRAPHY.sizes.md) * 1.4,
  },
});