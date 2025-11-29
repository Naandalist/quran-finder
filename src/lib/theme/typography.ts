import { TextStyle } from 'react-native';

// ============================================================================
// Font Families
// ============================================================================

export const fontFamily = {
  // Montserrat variants
  montserrat: {
    thin: 'Montserrat-Thin',
    thinItalic: 'Montserrat-ThinItalic',
    extraLight: 'Montserrat-ExtraLight',
    extraLightItalic: 'Montserrat-ExtraLightItalic',
    light: 'Montserrat-Light',
    lightItalic: 'Montserrat-LightItalic',
    regular: 'Montserrat-Regular',
    italic: 'Montserrat-Italic',
    medium: 'Montserrat-Medium',
    mediumItalic: 'Montserrat-MediumItalic',
    semiBold: 'Montserrat-SemiBold',
    semiBoldItalic: 'Montserrat-SemiBoldItalic',
    bold: 'Montserrat-Bold',
    boldItalic: 'Montserrat-BoldItalic',
    extraBold: 'Montserrat-ExtraBold',
    extraBoldItalic: 'Montserrat-ExtraBoldItalic',
    black: 'Montserrat-Black',
    blackItalic: 'Montserrat-BlackItalic',
  },
  // Display/Decorative fonts
  display: {
    crushedStrike: 'CrushedStrike',
  },
} as const;

// ============================================================================
// Typography Styles
// ============================================================================

export const typography: Record<string, TextStyle> = {
  // Display - for hero titles, decorative text
  display: {
    fontSize: 40,
    fontFamily: fontFamily.display.crushedStrike,
    lineHeight: 48,
  },
  // Headings
  h1: {
    fontSize: 28,
    fontFamily: fontFamily.montserrat.bold,
    lineHeight: 34,
  },
  h2: {
    fontSize: 24,
    fontFamily: fontFamily.montserrat.semiBold,
    lineHeight: 30,
  },
  h3: {
    fontSize: 20,
    fontFamily: fontFamily.montserrat.semiBold,
    lineHeight: 26,
  },
  // Body text
  body: {
    fontSize: 16,
    fontFamily: fontFamily.montserrat.regular,
    lineHeight: 22,
  },
  bodyMedium: {
    fontSize: 16,
    fontFamily: fontFamily.montserrat.medium,
    lineHeight: 22,
  },
  bodyBold: {
    fontSize: 16,
    fontFamily: fontFamily.montserrat.semiBold,
    lineHeight: 22,
  },
  bodySmall: {
    fontSize: 14,
    fontFamily: fontFamily.montserrat.regular,
    lineHeight: 20,
  },
  bodySmallMedium: {
    fontSize: 14,
    fontFamily: fontFamily.montserrat.medium,
    lineHeight: 20,
  },
  // Captions and labels
  caption: {
    fontSize: 12,
    fontFamily: fontFamily.montserrat.regular,
    lineHeight: 16,
  },
  captionMedium: {
    fontSize: 12,
    fontFamily: fontFamily.montserrat.medium,
    lineHeight: 16,
  },
  // Labels
  label: {
    fontSize: 14,
    fontFamily: fontFamily.montserrat.medium,
    lineHeight: 18,
  },
  labelSmall: {
    fontSize: 12,
    fontFamily: fontFamily.montserrat.medium,
    lineHeight: 16,
  },
  // Button text
  button: {
    fontSize: 16,
    fontFamily: fontFamily.montserrat.semiBold,
    lineHeight: 20,
  },
  buttonSmall: {
    fontSize: 14,
    fontFamily: fontFamily.montserrat.semiBold,
    lineHeight: 18,
  },
  // Arabic text (uses system font for proper Arabic rendering)
  arabic: {
    fontSize: 24,
    fontWeight: '400',
    lineHeight: 40,
  },
};
