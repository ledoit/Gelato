export const APP_NAME = 'Gelato';

export const BRANDING = {
  displayName: APP_NAME,
  bundleId: 'com.menhir.gelato',
  primaryColor: '#FF6B6B',
  secondaryColor: '#4ECDC4',
  backgroundColor: '#F8F9FA',
  accentColor: '#FFE66D',
} as const;

export const LAYOUT = {
  headerHeight: 60,
  tabBarHeight: 80,
  borderRadius: 12,
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
} as const;

export const TYPOGRAPHY = {
  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
} as const;