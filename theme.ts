import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

export const COLORS = {
  green: '#78B88B',
  greenDark: '#4E8D63',
  orange: '#E8741A',
  cream: '#F6EFE8',
  text: '#1F2937',
};

export const theme = {
  ...DefaultTheme,
  roundness: 14,
  colors: {
    ...DefaultTheme.colors,
    primary: COLORS.greenDark,
    secondary: COLORS.orange,
    background: COLORS.cream,
    surface: '#FFFFFF',
    onSurface: COLORS.text,
  },
};
