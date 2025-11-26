import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from 'lib/theme/ThemeProvider';
import { Verse } from 'lib/types';

interface VerseCardProps {
  verse: Verse;
  onPress: () => void;
  highlightText?: string;
}

export const VerseCard: React.FC<VerseCardProps> = ({
  verse,
  onPress,
  highlightText: _highlightText,
}) => {
  const { colors, spacing, typography } = useTheme();

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderRadius: 12,
          padding: spacing.md,
          borderColor: colors.border,
        },
      ]}
      onPress={onPress}
      activeOpacity={0.7}>
      {/* Verse Key Badge */}
      <View
        style={[
          styles.badge,
          {
            backgroundColor: colors.surfaceElevated,
            paddingHorizontal: spacing.sm,
            paddingVertical: spacing.xs,
            marginBottom: spacing.sm,
          },
        ]}>
        <Text style={[typography.caption, { color: colors.primary }]}>
          {verse.verse_key}
        </Text>
      </View>

      {/* Arabic Text */}
      <Text
        style={[
          typography.arabic,
          styles.arabicText,
          { color: colors.text, marginBottom: spacing.sm },
        ]}>
        {verse.text}
      </Text>

      {/* Transliteration */}
      <Text
        style={[
          typography.body,
          { color: colors.textSecondary, marginBottom: spacing.xs },
        ]}>
        {verse.transliteration}
      </Text>

      {/* Translation */}
      <Text style={[typography.bodySmall, { color: colors.textMuted }]}>
        {verse.translation_id}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 6,
  },
  arabicText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});

export default VerseCard;
