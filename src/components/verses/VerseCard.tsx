import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Verse } from 'lib/types';
import { HighlightedText } from 'components/common/HighlightedText';
import surahs from 'lib/quran/surahs.json';

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
  score,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Get surah info from surahs.json
  const surahInfo: SurahInfo | undefined = surahs.find(
    (s: SurahInfo) => s.id === verse.surah_id,
  );

  const surahName = surahInfo?.name || `Surah ${verse.surah_id}`;
  const surahType = surahInfo?.type || 'Makkiyah';
  const surahNumber = surahInfo?.id || verse.surah_id;

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

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

      {/* Transliteration */}
      <HighlightedText
        text={verse.transliteration}
        query={highlightMode === 'lafaz' ? highlightText : undefined}
        highlightColor="#2F97AA"
        style={styles.transliterationText}
      />

      {/* Translation (only show when expanded) */}
      {isExpanded && (
        <HighlightedText
          text={verse.translation_id}
          query={highlightMode === 'terjemahan' ? highlightText : undefined}
          highlightColor="#3B82F6"
          style={styles.translationText}
        />
      )}

      {/* Score Badge at Bottom Left */}
      {/* {score !== undefined && (
        <View style={styles.scoreBadgeContainer}>
          <View style={styles.scoreBadge}>
            <ScoreIcon size={16} color="#E31F25" />
            <Text style={styles.scoreBadgeText}>{Math.round(score)}%</Text>
          </View>
        </View>
      )} */}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 0.5,
    borderColor: '#95a5a6',
    // paddingBottom: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    marginBottom: 16,
  },
  surahBadge: {
    backgroundColor: '#ADE3EF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderTopLeftRadius: 8,
    borderBottomRightRadius: 8,
    paddingRight: 20,
  },
  surahBadgeText: {
    color: '#2F97AA',
    fontSize: 12,
    fontWeight: '600',
  },
  typeBadge: {
    // backgroundColor: '#FFC8C9',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderTopLeftRadius: 8,
    borderBottomRightRadius: 8,
    marginLeft: -8,
  },
  typeBadgeText: {
    // color: '#E31F25',
    color: '#059669',
    fontSize: 12,
    fontWeight: '600',
  },
  scoreBadgeContainer: {
    alignItems: 'flex-start',
    marginTop: 8,
  },
  scoreBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFC8C9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderTopRightRadius: 8,
    borderBottomLeftRadius: 8,
  },
  scoreBadgeText: {
    // color: '#059669',
    color: '#E31F25',
    fontSize: 12,
    fontWeight: '600',
  },
  arabicText: {
    fontSize: 24,
    fontFamily: 'noorehuda',
    color: '#1F2937',
    textAlign: 'right',
    lineHeight: 48,
    marginBottom: 12,
    marginHorizontal: 16,
  },
  transliterationText: {
    fontSize: 14,
    fontFamily: 'Montserrat-Italic',
    lineHeight: 25,
    letterSpacing: 0.5,
    color: '#6B7280',
    textAlign: 'left',
    marginBottom: 16,
    marginHorizontal: 16,
  },
  translationText: {
    fontSize: 14,
    color: '#4B5563',
    textAlign: 'left',
    marginBottom: 16,
    lineHeight: 22,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 12,
  },
  chipsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8F1F7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
    borderBottomLeftRadius: 8,
  },
  chipIcon: {
    fontSize: 12,
  },
  chipText: {
    fontSize: 12,
    color: '#1C71B1',
    fontWeight: '500',
  },
  chipOutline: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  chipOutlineText: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '500',
  },
  expandButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  expandIcon: {
    fontSize: 18,
    color: '#9CA3AF',
  },
});

export default VerseCard;
