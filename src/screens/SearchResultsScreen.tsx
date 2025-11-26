import React from 'react';
import { View, FlatList, StyleSheet, Text } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Screen } from 'components/layout/Screen';
import { AppBar } from 'components/layout/AppBar';
import { IconButton } from 'components/common/IconButton';
import { useTheme } from 'lib/theme/ThemeProvider';
import { RootStackParamList } from 'app/navigation/types';
import { Verse } from 'lib/types';
import { searchPhonetic } from 'lib/quran/phoneticSearch';

import { VerseCard } from 'components/verses/VerseCard';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SearchResults'>;
type SearchResultsRouteProp = RouteProp<RootStackParamList, 'SearchResults'>;

export default function SearchResultsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<SearchResultsRouteProp>();
  const { colors, spacing, typography } = useTheme();

  const { query, mode } = route.params;

  // Get search results
  const results = mode === 'lafaz' ? searchPhonetic(query) : [];

  const handleVersePress = (verse: Verse) => {
    navigation.navigate('VerseDetail', { verseKey: verse.verse_key });
  };

  return (
    <Screen>
      <AppBar
        title={`"${query}"`}
        left={
          <IconButton
            icon="←"
            onPress={() => navigation.goBack()}
          />
        }
      />

      <View style={[styles.resultsInfo, { paddingHorizontal: spacing.md }]}>
        <Text style={[typography.bodySmall, { color: colors.textMuted }]}>
          {results.length} hasil ditemukan • Mode: {mode === 'lafaz' ? 'Lafaz' : 'Makna'}
        </Text>
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.verse.verse_key}
        renderItem={({ item }) => (
          <VerseCard
            verse={item.verse}
            onPress={() => handleVersePress(item.verse)}
            highlightText={query}
          />
        )}
        contentContainerStyle={[
          styles.listContent,
          { padding: spacing.md, gap: spacing.md },
        ]}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={[typography.h3, { color: colors.text }]}>
              Tidak ada hasil
            </Text>
            <Text style={[typography.body, { color: colors.textMuted, marginTop: spacing.sm }]}>
              Coba kata kunci lain atau ubah mode pencarian
            </Text>
          </View>
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  resultsInfo: {
    paddingVertical: 8,
  },
  listContent: {
    flexGrow: 1,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
});
