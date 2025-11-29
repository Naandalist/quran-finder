import React, { useState, useEffect } from 'react';
import { View, FlatList, StyleSheet, Text, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Screen } from 'components/layout/Screen';
import { AppBar } from 'components/layout/AppBar';
import { IconButton } from 'components/common/IconButton';
import { EmptyState } from 'components/common/EmptyState';
import { VerseCard } from 'components/verses/VerseCard';
import { useTheme } from 'lib/theme/ThemeProvider';
import { RootStackParamList } from 'app/navigation/types';
import { Verse } from 'lib/types';
import { searchByLafazRanked, RankedResult } from 'lib/quran/searchByLafaz';
import {
  searchByTranslationRanked,
  TranslationRankedResult,
} from 'lib/quran/searchByTranslation';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'SearchResults'>;
type SearchResultsRouteProp = RouteProp<RootStackParamList, 'SearchResults'>;

/** Union type for search results from both modes */
type SearchResultItem = RankedResult | TranslationRankedResult;

export default function SearchResultsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<SearchResultsRouteProp>();
  const { colors, spacing, typography } = useTheme();

  const { query, mode } = route.params;
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchResults = () => {
      try {
        setIsLoading(true);
        setError(null);

        const searchResults =
          mode === 'lafaz'
            ? searchByLafazRanked(query)
            : searchByTranslationRanked(query);

        setResults(searchResults);
      } catch (err) {
        console.error('Search error:', err);
        setError(err instanceof Error ? err.message : 'Search failed');
      } finally {
        setIsLoading(false);
      }
    };

    fetchResults();
  }, [query, mode]);

  const handleVersePress = (verse: Verse) => {
    navigation.navigate('VerseDetail', { verseKey: verse.verse_key });
  };

  const getModeLabel = () => {
    return mode === 'lafaz' ? 'Lafaz (Latin)' : 'Terjemahan (ID)';
  };

  if (isLoading) {
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
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[typography.body, { color: colors.textMuted, marginTop: spacing.md }]}>
            Mencari ayat...
          </Text>
        </View>
      </Screen>
    );
  }

  if (error) {
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
        <View style={styles.errorContainer}>
          <EmptyState
            icon="⚠️"
            title="Terjadi Kesalahan"
            message={error}
          />
        </View>
      </Screen>
    );
  }

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

      <View style={[styles.resultsInfo, { paddingHorizontal: spacing.md, paddingVertical: spacing.sm }]}>
        <Text style={[typography.bodySmall, { color: colors.textMuted }]}>
          {results.length} hasil ditemukan • Mode: {getModeLabel()}
        </Text>
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => String(item.verse.id)}
        renderItem={({ item }) => {
          // For terjemahan mode, prefer highlightToken (the actual word from translation)
          // Fall back to raw query if highlightToken is not available
          const highlightText =
            mode === 'terjemahan' && 'highlightToken' in item && item.highlightToken
              ? item.highlightToken
              : query;

          return (
            <VerseCard
              verse={item.verse}
              onPress={() => handleVersePress(item.verse)}
              highlightText={highlightText}
              highlightMode={mode}
              score={item.score}
            />
          );
        }}
        contentContainerStyle={[
          styles.listContent,
          { paddingHorizontal: spacing.md, paddingBottom: spacing.lg, gap: spacing.sm },
        ]}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <EmptyState
              icon="📖"
              title="Tidak Ditemukan"
              message={`Tidak ada ayat yang cocok dengan "${query}"`}
            />
          </View>
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  resultsInfo: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
});
