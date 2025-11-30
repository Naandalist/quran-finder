import { useState, useCallback, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from 'app/navigation/types';
import { QueryMode } from 'lib/types';
import storage from 'lib/storage';

// ============================================================================
// Types
// ============================================================================

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'SearchHistory'
>;

export interface RecentQuery {
  query: string;
  mode: QueryMode;
  timestamp: number;
}

// ============================================================================
// Constants
// ============================================================================

export const MODE_LABELS: Record<QueryMode, string> = {
  lafaz: 'Lafaz (latin)',
  terjemahan: 'Terjemahan (Indonesia)',
};

// ============================================================================
// useSearchHistory Hook
// ============================================================================

export function useSearchHistory() {
  const navigation = useNavigation<NavigationProp>();
  const [recentSearches, setRecentSearches] = useState<RecentQuery[]>([]);

  useEffect(() => {
    const loadRecentSearches = () => {
      const stored = storage.get<RecentQuery[]>(storage.keys.RECENT_QUERIES);
      if (stored) {
        setRecentSearches(stored);
      }
    };
    loadRecentSearches();
  }, []);

  const handleSelectItem = useCallback(
    (item: RecentQuery) => {
      navigation.navigate('SearchResults', {
        query: item.query,
        mode: item.mode,
      });
    },
    [navigation],
  );

  const handleDeleteItem = useCallback(
    (itemQuery: string) => {
      const updated = recentSearches.filter(s => s.query !== itemQuery);
      setRecentSearches(updated);
      storage.set(storage.keys.RECENT_QUERIES, updated);
    },
    [recentSearches],
  );

  const handleClearAll = useCallback(() => {
    setRecentSearches([]);
    storage.set(storage.keys.RECENT_QUERIES, []);
  }, []);

  const goBack = useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  return {
    recentSearches,
    handleSelectItem,
    handleDeleteItem,
    handleClearAll,
    goBack,
  };
}
