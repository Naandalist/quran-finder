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
  // Inter variants
  inter: {
    light: 'Inter-Light',
    regular: 'Inter-Regular',
    medium: 'Inter-Medium',
    semiBold: 'Inter-SemiBold',
    bold: 'Inter-Bold',
  },
  // Arabic fonts
  arabic: {
    // ArefRuqaa - Traditional Arabic calligraphy style
    arefRuqaa: {
      regular: 'ArefRuqaa-Regular',
      bold: 'ArefRuqaa-Bold',
    },
    // OmarNaskh - Clean Naskh style for Quran
    omarNaskh: {
      regular: 'OmarNaskh-Regular',
      medium: 'OmarNaskh-Medium',
      bold: 'OmarNaskh-Bold',
    },
    // NooreHuda - Beautiful Quran font
    nooreHuda: 'noorehuda',
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
  // Arabic text styles - using OmarNaskh for Quran text
  arabic: {
    fontSize: 28,
    fontFamily: fontFamily.arabic.omarNaskh.regular,
    lineHeight: 56,
  },
  arabicMedium: {
    fontSize: 28,
    fontFamily: fontFamily.arabic.omarNaskh.medium,
    lineHeight: 56,
  },
  arabicBold: {
    fontSize: 28,
    fontFamily: fontFamily.arabic.omarNaskh.bold,
    lineHeight: 56,
  },
  arabicSmall: {
    fontSize: 22,
    fontFamily: fontFamily.arabic.omarNaskh.regular,
    lineHeight: 44,
  },
  arabicLarge: {
    fontSize: 32,
    fontFamily: fontFamily.arabic.omarNaskh.regular,
    lineHeight: 64,
  },
  // ArefRuqaa - for decorative Arabic headers
  arabicDisplay: {
    fontSize: 36,
    fontFamily: fontFamily.arabic.arefRuqaa.regular,
    lineHeight: 72,
  },
  arabicDisplayBold: {
    fontSize: 36,
    fontFamily: fontFamily.arabic.arefRuqaa.bold,
    lineHeight: 72,
  },
};
