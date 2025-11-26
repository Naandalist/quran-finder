import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from 'lib/theme/ThemeProvider';

interface VerseMetaHeaderProps {
  verseKey: string;
  surahName?: string;
  verseNumber?: number;
}

export const VerseMetaHeader: React.FC<VerseMetaHeaderProps> = ({
  verseKey,
  surahName,
  verseNumber,
}) => {
  const { colors, spacing, typography } = useTheme();

  const [surahId, ayahNum] = verseKey.split(':');

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          padding: spacing.md,
          borderRadius: 12,
        },
      ]}>
      <View style={styles.row}>
        <Text style={[typography.h3, { color: colors.text }]}>
          {surahName || `Surah ${surahId}`}
        </Text>
        <View
          style={[
            styles.badge,
            {
              backgroundColor: colors.primary,
              paddingHorizontal: spacing.sm,
              paddingVertical: spacing.xs,
            },
          ]}>
          <Text style={[typography.caption, { color: colors.background }]}>
            Ayat {verseNumber || ayahNum}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    borderRadius: 6,
  },
});

export default VerseMetaHeader;
