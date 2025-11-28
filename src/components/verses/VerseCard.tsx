import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from 'lib/theme/ThemeProvider';
import { Verse } from 'lib/types';
import { HighlightedText } from 'components/common/HighlightedText';

interface VerseCardProps {
  verse: Verse;
  onPress: () => void;
  highlightText?: string;
  score?: number;
}

export const VerseCard: React.FC<VerseCardProps> = ({
  verse,
  onPress,
  highlightText,
  score,
}) => {
  const { colors, spacing, typography } = useTheme();

  // Determine score badge color based on score value
  const getScoreBadgeColor = (s: number) => {
    if (s >= 80) return '#22c55e'; // green - excellent match
    if (s >= 50) return '#3b82f6'; // blue - good match
    if (s >= 30) return '#f59e0b'; // amber - fair match
    return '#6b7280'; // gray - weak match
  };

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
      {/* Badge Row */}
      <View style={styles.badgeRow}>
        {/* Verse Key Badge */}
        <View
          style={[
            styles.badge,
            {
              backgroundColor: colors.surfaceElevated,
              paddingHorizontal: spacing.sm,
              paddingVertical: spacing.xs,
            },
          ]}>
          <Text style={[typography.caption, { color: colors.primary }]}>
            {verse.verse_key}
          </Text>
        </View>

        {/* Score Badge */}
        {score !== undefined && (
          <View
            style={[
              styles.scoreBadge,
              {
                backgroundColor: getScoreBadgeColor(score),
                paddingHorizontal: spacing.sm,
                paddingVertical: spacing.xs,
              },
            ]}>
            <Text style={[typography.caption, styles.scoreText]}>
              {score.toFixed(1)}
            </Text>
          </View>
        )}
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
      <HighlightedText
        text={verse.transliteration}
        query={highlightText}
        highlightColor={colors.primary}
        style={[
          typography.body,
          { color: colors.textSecondary, marginBottom: spacing.xs },
        ]}
      />

      {/* Translation */}
      {/* <Text style={[typography.bodySmall, { color: colors.textMuted }]}>
        {verse.translation_id}
      </Text> */}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 6,
  },
  scoreBadge: {
    borderRadius: 6,
  },
  scoreText: {
    color: '#ffffff',
    fontWeight: '600',
  },
  arabicText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});

export default VerseCard;
