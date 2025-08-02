import { Dimensions, PixelRatio } from 'react-native';
import { ScreenDimensions } from '../types';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Tablet breakpoint (768px is common for tablets)
const TABLET_BREAKPOINT = 768;

export const getScreenDimensions = (): ScreenDimensions => {
  const { width, height } = Dimensions.get('window');
  const isTablet = Math.min(width, height) >= TABLET_BREAKPOINT;
  const orientation = width > height ? 'landscape' : 'portrait';
  
  return {
    width,
    height,
    isTablet,
    orientation,
  };
};

// Scale font size based on screen size
export const scaleFont = (size: number): number => {
  const { isTablet } = getScreenDimensions();
  const scale = isTablet ? 1.2 : 1;
  return Math.round(PixelRatio.roundToNearestPixel(size * scale));
};

// Scale dimension based on screen width
export const scaleWidth = (width: number): number => {
  const screenWidth = Dimensions.get('window').width;
  return (width / 375) * screenWidth; // 375 is iPhone X width as base
};

// Scale dimension based on screen height
export const scaleHeight = (height: number): number => {
  const screenHeight = Dimensions.get('window').height;
  return (height / 812) * screenHeight; // 812 is iPhone X height as base
};

// Get responsive padding/margins
export const getSpacing = (base: number): number => {
  const { isTablet } = getScreenDimensions();
  return isTablet ? base * 1.5 : base;
};

// Get responsive width percentage
export const getWidthPercentage = (percentage: number): number => {
  const { width } = Dimensions.get('window');
  return (percentage / 100) * width;
};

// Get responsive height percentage
export const getHeightPercentage = (percentage: number): number => {
  const { height } = Dimensions.get('window');
  return (percentage / 100) * height;
};

// Check if device is in landscape mode
export const isLandscape = (): boolean => {
  const { width, height } = Dimensions.get('window');
  return width > height;
};

// Get safe container width for content
export const getContainerWidth = (): number => {
  const { width, isTablet } = getScreenDimensions();
  
  if (isTablet) {
    // On tablets, limit content width for better readability
    return Math.min(width * 0.8, 600);
  }
  
  return width * 0.9; // 90% width on phones
};

// Get responsive grid columns
export const getGridColumns = (): number => {
  const { isTablet, orientation } = getScreenDimensions();
  
  if (isTablet) {
    return orientation === 'landscape' ? 4 : 3;
  }
  
  return 2; // 2 columns on phones
};

export default {
  getScreenDimensions,
  scaleFont,
  scaleWidth,
  scaleHeight,
  getSpacing,
  getWidthPercentage,
  getHeightPercentage,
  isLandscape,
  getContainerWidth,
  getGridColumns,
};