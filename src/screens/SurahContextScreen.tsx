import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Screen } from 'components/layout/Screen';
import { AppBar } from 'components/layout/AppBar';
import { IconButton } from 'components/common/IconButton';
import { useTheme } from 'lib/theme/ThemeProvider';
import { RootStackParamList } from 'app/navigation/types';
import { getVersesBySurah } from 'lib/quran/verses';
import { Verse } from 'lib/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SurahContext'>;
type SurahContextRouteProp = RouteProp<RootStackParamList, 'SurahContext'>;

export default function SurahContextScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<SurahContextRouteProp>();
  const { colors, spacing, typography } = useTheme();

  const { surahId, verseNumber } = route.params;
  const verses = getVersesBySurah(surahId);

  const renderVerse = ({ item }: { item: Verse }) => {
    const [, ayahNum] = item.verse_key.split(':');
    const isHighlighted = verseNumber === Number(ayahNum);

    return (
      <View
        style={[
          styles.verseItem,
          {
            backgroundColor: isHighlighted ? colors.surfaceElevated : 'transparent',
            padding: spacing.md,
            borderRadius: 8,
            borderLeftWidth: isHighlighted ? 3 : 0,
            borderLeftColor: colors.primary,
          },
        ]}>
        <View style={styles.verseHeader}>
          <View
            style={[
              styles.ayahBadge,
              {
                backgroundColor: colors.surface,
                paddingHorizontal: spacing.sm,
                paddingVertical: spacing.xs,
              },
            ]}>
            <Text style={[typography.caption, { color: colors.primary }]}>
              {ayahNum}
            </Text>
          </View>
        </View>

        <Text
          style={[
            typography.arabic,
            styles.arabicText,
            { color: colors.text, marginVertical: spacing.sm },
          ]}>
          {item.text}
        </Text>

        <Text style={[typography.bodySmall, { color: colors.textMuted }]}>
          {item.translation_id}
        </Text>
      </View>
    );
  };

  return (
    <Screen>
      <AppBar
        title={`Surah ${surahId}`}
        left={
          <IconButton icon="←" onPress={() => navigation.goBack()} />
        }
      />

      <FlatList
        data={verses}
        keyExtractor={(item) => item.verse_key}
        renderItem={renderVerse}
        contentContainerStyle={[
          styles.listContent,
          { padding: spacing.md, gap: spacing.sm },
        ]}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={[typography.body, { color: colors.textMuted }]}>
              Tidak ada ayat dalam surah ini (data belum lengkap)
            </Text>
          </View>
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  listContent: {
    flexGrow: 1,
  },
  verseItem: {},
  verseHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  ayahBadge: {
    borderRadius: 6,
  },
  arabicText: {
    textAlign: 'right',
    writingDirection: 'rtl',
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
});
