export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,

  // Additional specific spacing values
  none: 0,
  '2xs': 2,
  '3xl': 64,

  // Component specific spacing
  inputPaddingHorizontal: 16,
  inputPaddingTop: 10,
  inputPaddingBottom: 12,
  cardPadding: 20,
  buttonPaddingVertical: 14,
  borderRadius: {
    sm: 8,
    md: 10,
    lg: 16,
    full: 9999,
  },
  borderWidth: {
    default: 1,
    medium: 2,
    thick: 4,
  },
  radioSize: {
    outer: 22,
    inner: 12,
  },
} as const;

export type Spacing = typeof spacing;
