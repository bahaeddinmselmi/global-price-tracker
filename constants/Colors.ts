const tintColorLight = '#FF5252';
const tintColorDark = '#FF7676';

export default {
  primary: '#FF5252', // Bright red
  secondary: '#4CAF50', // Green 
  tertiary: '#2196F3', // Blue
  accent: '#FFC107', // Amber
  success: '#4CAF50', // Green
  warning: '#FF9800', // Orange
  error: '#F44336', // Red
  
  background: '#F5F7FA', // Light background
  backgroundDark: '#121212', // Dark background
  
  card: '#FFFFFF', // Card background
  cardDark: '#1E1E1E', // Dark card background
  
  text: '#333333', // Main text
  textSecondary: '#666666', // Secondary text
  textDark: '#F5F5F5', // Dark mode text
  textSecondaryDark: '#B0B0B0', // Dark mode secondary text
  
  border: '#E0E0E0', // Light border
  borderDark: '#444444', // Dark border
  
  shadow: '#000000', // Shadow color
  inactive: '#AAAAAA', // Inactive state
  white: '#FFFFFF',
  black: '#000000',

  // Light theme colors
  light: {
    text: '#333333',
    background: '#F5F7FA',
    tint: tintColorLight,
    tabIconDefault: '#AAAAAA',
    tabIconSelected: tintColorLight,
  },
  
  // Dark theme colors
  dark: {
    text: '#F5F5F5',
    background: '#121212',
    tint: tintColorDark,
    tabIconDefault: '#AAAAAA',
    tabIconSelected: tintColorDark,
  },
};