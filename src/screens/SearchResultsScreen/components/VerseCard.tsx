import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Verse } from 'lib/types';
import { HighlightedText } from 'components/common/HighlightedText';
import surahs from 'lib/quran/surahs.json';
import { colors } from 'lib/theme/colors';
import { spacing } from 'lib/theme/spacing';

interface SurahInfo {
  id: number;
  name: string;
  translate: string;
  type: string;
  verse_count: number;
  juz_id: number;
}

interface VerseCardProps {
  verse: Verse;
  onPress: () => void;
  highlightText?: string;
  highlightMode?: 'lafaz' | 'terjemahan';
  score?: number;
}

export const VerseCard: React.FC<VerseCardProps> = ({
  verse,
  onPress,
  highlightText,
  highlightMode = 'lafaz',
}) => {
  // Get surah info from surahs.json
  const surahInfo: SurahInfo | undefined = surahs.find(
    (s: SurahInfo) => s.id === verse.surah_id,
  );

  const surahName = surahInfo?.name || `Surah ${verse.surah_id}`;
  const surahType = surahInfo?.type || 'Makkiyah';

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      {/* Header Row with Badges */}
      <View style={styles.headerRow}>
        {/* Surah Name Badge */}
        <View style={styles.surahBadge}>
          <Text style={styles.surahBadgeText}>
            Surah {surahName} Ayat {verse.number}
          </Text>
        </View>

        {/* Surah Type Badge (Makkiyah/Madaniyah) */}
        <View style={styles.typeBadge}>
          <Text style={styles.typeBadgeText}>{surahType}</Text>
        </View>
      </View>

      {/* Arabic Text */}
      <Text style={styles.arabicText}>{verse.text}</Text>

      {/* Show Transliteration for lafaz mode, Translation for terjemahan mode */}
      {highlightMode === 'lafaz' ? (
        <HighlightedText
          text={verse.transliteration}
          query={highlightText}
          highlightColor={colors.tealDark}
          style={styles.transliterationText}
        />
      ) : (
        <HighlightedText
          text={verse.translation_id}
          query={highlightText}
          highlightColor={colors.tealDark}
          style={styles.translationText}
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.background,
    borderRadius: spacing.borderRadius.sm,
    borderWidth: 0.5,
    borderColor: colors.grayBorder,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  surahBadge: {
    backgroundColor: colors.tealLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderTopLeftRadius: spacing.borderRadius.sm,
    borderBottomRightRadius: spacing.borderRadius.sm,
    paddingRight: spacing.cardPadding,
  },
  surahBadgeText: {
    color: colors.tealDark,
    fontSize: 12,
    fontWeight: '600',
  },
  typeBadge: {
    backgroundColor: colors.greenLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderTopLeftRadius: spacing.borderRadius.sm,
    borderBottomRightRadius: spacing.borderRadius.sm,
    marginLeft: -spacing.sm,
  },
  typeBadgeText: {
    color: colors.greenDark,
    fontSize: 12,
    fontWeight: '600',
  },
  arabicText: {
    fontSize: 24,
    fontFamily: 'noorehuda',
    color: colors.gray800,
    textAlign: 'right',
    lineHeight: 48,
    marginBottom: 12,
    marginHorizontal: spacing.md,
  },
  transliterationText: {
    fontSize: 11,
    fontFamily: 'Montserrat-Italic',
    lineHeight: 18,
    letterSpacing: 0.5,
    color: colors.gray500,
    textAlign: 'left',
    marginBottom: spacing.md,
    marginHorizontal: spacing.md,
  },
  translationText: {
    fontSize: 11,
    color: colors.gray600,
    textAlign: 'left',
    marginBottom: spacing.md,
    marginHorizontal: spacing.md,
    lineHeight: 18,
    letterSpacing: 0.5,
  },
});

export default VerseCard;
