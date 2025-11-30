import { useState, useEffect, useCallback } from 'react';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from 'app/navigation/types';
import { Verse } from 'lib/types';
import { searchByLafazRanked, RankedResult } from 'lib/quran/searchByLafaz';
import {
  searchByTranslationRanked,
  TranslationRankedResult,
} from 'lib/quran/searchByTranslation';

// ============================================================================
// Types
// ============================================================================

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'SearchResults'
>;
type SearchResultsRouteProp = RouteProp<RootStackParamList, 'SearchResults'>;

/** Union type for search results from both modes */
export type SearchResultItem = RankedResult | TranslationRankedResult;

// ============================================================================
// useSearchResults Hook
// ============================================================================

export function useSearchResults() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<SearchResultsRouteProp>();

  const { query, mode } = route.params;

  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentVerse, setCurrentVerse] = useState<Verse | null>(null);

  // Fetch search results
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

  // Handlers
  const handleVersePress = useCallback((verse: Verse) => {
    console.log('Verse pressed:', verse.verse_key);
    setCurrentVerse(verse);
  }, []);

  const handleClosePlayer = useCallback(() => {
    setCurrentVerse(null);
  }, []);

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  // Computed values
  const modeLabel = mode === 'lafaz' ? 'Mode lafaz' : 'Mode terjemahan';

  return {
    // Route params
    query,
    mode,

    // State
    results,
    isLoading,
    error,
    currentVerse,

    // Computed
    modeLabel,

    // Handlers
    handleVersePress,
    handleClosePlayer,
    goBack,
  };
}
