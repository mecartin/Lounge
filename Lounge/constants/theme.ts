// constants/theme.ts
export const Colors = {
  primary: 'tomato',
  primaryDark: '#d35400',
  primaryLight: '#ff7f50',

  secondary: '#3498db',
  secondaryDark: '#2980b9',
  secondaryLight: '#5dade2',

  accent: '#f1c40f',

  text: '#333333',
  textLight: '#555555',
  textLighter: '#7f8c8d',
  textOnPrimary: '#ffffff',
  textOnSecondary: '#ffffff',

  background: '#f4f6f8', // Light background for screens
  surface: '#ffffff',    // Background for cards, modals etc.
  surfaceDark: '#eeeeee',

  border: '#dddddd',
  borderLight: '#eeeeee',

  success: '#2ecc71',
  error: '#e74c3c',
  warning: '#f39c12',

  // Grays
  grayDark: '#333333',
  grayMedium: '#888888',
  grayLight: '#cccccc',
  grayLighter: '#eeeeee',
  white: '#ffffff',
  black: '#000000',

  // Service specific (examples)
  spotifyGreen: '#1DB954',
};

export const Fonts = {
  // Define your font families here after loading them in App.tsx
  // Example:
  // regular: 'YourFont-Regular',
  // bold: 'YourFont-Bold',
  // light: 'YourFont-Light',
  defaultFamily: 'System', // Fallback
};

export const FontSizes = {
  xs: 10,
  sm: 12,
  md: 14,
  lg: 16,
  xl: 18,
  xxl: 24,
  xxxl: 30,
  title: 28,
  header: 22,
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  screenPadding: 20,
  cardPadding: 15,
};

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  round: 50,
};

export const Shadows = {
  light: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.18,
    shadowRadius: 1.00,
    elevation: 1,
  },
  medium: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
  },
  dark: {
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8,
  },
};

const theme = {
  Colors,
  Fonts,
  FontSizes,
  Spacing,
  BorderRadius,
  Shadows,
};

export default theme;