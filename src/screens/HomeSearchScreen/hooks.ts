import { useState, useCallback, useRef } from 'react';
import { TextInput, ScrollView, Animated } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as yup from 'yup';

import { RootStackParamList } from 'app/navigation/types';
import { QueryMode } from 'lib/types';
import storage from 'lib/storage';

// ============================================================================
// Types
// ============================================================================

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'HomeSearch'
>;

export interface RecentQuery {
  query: string;
  mode: QueryMode;
  timestamp: number;
}

// ============================================================================
// Constants
// ============================================================================

export const MAX_QUERY_LENGTH = 15;

export const MODE_LABELS: Record<QueryMode, string> = {
  lafaz: 'Lafaz (latin)',
  terjemahan: 'Terjemahan (Indonesia)',
};

export const MODE_PLACEHOLDERS: Record<QueryMode, string> = {
  lafaz: 'Contoh: qulhuallahu...',
  terjemahan: 'Contoh: buah-buahan...',
};

export const EXAMPLE_SEARCHES: Array<{ query: string; mode: QueryMode }> = [
  { query: 'Bismillah', mode: 'lafaz' },
  { query: 'yaayuhalkafirun', mode: 'lafaz' },
  { query: 'surga', mode: 'terjemahan' },
];

// Yup validation schema
const querySchema = yup
  .string()
  .required('Kata kunci tidak boleh kosong')
  .max(MAX_QUERY_LENGTH, `Maksimal ${MAX_QUERY_LENGTH} karakter`)
  .matches(/^[a-zA-Z\s'-]+$/, 'Hanya huruf yang diperbolehkan');

// ============================================================================
// useShakeAnimation Hook
// ============================================================================

export function useShakeAnimation() {
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  const triggerShake = useCallback(() => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, [shakeAnimation]);

  return { shakeAnimation, triggerShake };
}

// ============================================================================
// useRecentSearches Hook
// ============================================================================

export function useRecentSearches() {
  const [recentSearches, setRecentSearches] = useState<RecentQuery[]>([]);

  // Reload history when screen gains focus (to get newly saved searches)
  useFocusEffect(
    useCallback(() => {
      const stored = storage.get<RecentQuery[]>(storage.keys.RECENT_QUERIES);
      if (stored) {
        setRecentSearches(stored);
      }
    }, []),
  );

  const addRecentSearch = useCallback(
    (query: string, mode: QueryMode) => {
      const newSearch: RecentQuery = {
        query,
        mode,
        timestamp: Date.now(),
      };
      const updated = [
        newSearch,
        ...recentSearches.filter(s => s.query !== query),
      ].slice(0, 10);
      setRecentSearches(updated);
      storage.set(storage.keys.RECENT_QUERIES, updated);
    },
    [recentSearches],
  );

  const deleteRecentSearch = useCallback(
    (itemQuery: string) => {
      const updated = recentSearches.filter(s => s.query !== itemQuery);
      setRecentSearches(updated);
      storage.set(storage.keys.RECENT_QUERIES, updated);
    },
    [recentSearches],
  );

  return { recentSearches, addRecentSearch, deleteRecentSearch };
}

// ============================================================================
// useHomeSearch Hook (Main Hook)
// ============================================================================

export function useHomeSearch() {
  const navigation = useNavigation<NavigationProp>();

  // State
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<QueryMode>('lafaz');
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [queryError, setQueryError] = useState('');

  // Refs
  const inputRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  // Hooks
  const { shakeAnimation, triggerShake } = useShakeAnimation();
  const { recentSearches, deleteRecentSearch } = useRecentSearches();

  // Reset query when screen gains focus (coming back from SearchResults)
  useFocusEffect(
    useCallback(() => {
      setQuery('');
      setQueryError('');
    }, []),
  );

  // Handlers
  const handleQueryChange = useCallback(
    (text: string) => {
      setQuery(text);
      if (queryError && text.trim()) {
        setQueryError('');
      }
    },
    [queryError],
  );

  const handleSubmit = useCallback(() => {
    const trimmedQuery = query.trim();

    try {
      querySchema.validateSync(trimmedQuery);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        setQueryError(error.message);
        triggerShake();
      }
      return;
    }

    navigation.navigate('SearchResults', {
      query: trimmedQuery,
      mode: mode,
    });
  }, [query, mode, navigation, triggerShake]);

  const handleSelectItem = useCallback(
    (itemQuery: string, itemMode: QueryMode) => {
      setQuery(itemQuery);
      setMode(itemMode);
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    },
    [],
  );

  const openDropdown = useCallback(() => setIsDropdownVisible(true), []);
  const closeDropdown = useCallback(() => setIsDropdownVisible(false), []);

  const selectMode = useCallback((newMode: QueryMode) => {
    setMode(newMode);
    setIsDropdownVisible(false);
  }, []);

  const navigateToHistory = useCallback(() => {
    navigation.navigate('SearchHistory');
  }, [navigation]);

  // Computed values
  const placeholder = MODE_PLACEHOLDERS[mode];

  return {
    // State
    query,
    mode,
    queryError,
    isDropdownVisible,
    recentSearches,
    placeholder,

    // Refs
    inputRef,
    scrollViewRef,
    shakeAnimation,

    // Handlers
    handleQueryChange,
    handleSubmit,
    handleSelectItem,
    deleteRecentSearch,
    openDropdown,
    closeDropdown,
    selectMode,
    navigateToHistory,
  };
}
