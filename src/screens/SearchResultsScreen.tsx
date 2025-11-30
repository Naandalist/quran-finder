import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { EmptyState } from 'components/common/EmptyState';
import { VerseCard } from 'components/verses/VerseCard';
import { ArrowLeft } from 'components/icons/ArrowLeft';
import { FloatingAudioPlayer } from 'components/audio/FloatingAudioPlayer';
import { useTheme } from 'lib/theme/ThemeProvider';
import { RootStackParamList } from 'app/navigation/types';
import { Verse } from 'lib/types';
import { searchByLafazRanked, RankedResult } from 'lib/quran/searchByLafaz';
import {
  searchByTranslationRanked,
  TranslationRankedResult,
} from 'lib/quran/searchByTranslation';

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'SearchResults'
>;
type SearchResultsRouteProp = RouteProp<RootStackParamList, 'SearchResults'>;

/** Union type for search results from both modes */
type SearchResultItem = RankedResult | TranslationRankedResult;

export default function SearchResultsScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<SearchResultsRouteProp>();
  const { colors, typography } = useTheme();
  const insets = useSafeAreaInsets();

  const { query, mode } = route.params;
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentVerse, setCurrentVerse] = useState<Verse | null>(null);

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
    // navigation.navigate('VerseDetail', { verseKey: verse.verse_key });
    console.log('Verse pressed:', verse.verse_key);
    setCurrentVerse(verse);
  };

  const handleClosePlayer = () => {
    setCurrentVerse(null);
  };

  const getModeLabel = () => {
    return mode === 'lafaz' ? 'Mode lafaz' : 'Mode terjemahan';
  };

  const renderHeader = () => (
    <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor="#0D9488" />
      <View style={styles.headerContent}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hasil Pencarian</Text>
        <View style={styles.headerSpacer} />
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.screenContainer}>
        {renderHeader()}
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={[typography.body, styles.loadingText]}>
            Mencari ayat...
          </Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.screenContainer}>
        {renderHeader()}
        <View style={styles.errorContainer}>
          <EmptyState icon="⚠️" title="Terjadi Kesalahan" message={error} />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.screenContainer}>
      {renderHeader()}

      {/* Query Header Block */}
      <View style={styles.queryHeader}>
        <Text style={styles.queryText}>{query}</Text>
        <Text style={styles.queryMeta}>
          {results.length} ditemukan | {getModeLabel()}
        </Text>
      </View>

      <FlatList
        data={results}
        keyExtractor={item => String(item.verse.id)}
        renderItem={({ item }) => {
          const highlightText =
            mode === 'terjemahan' &&
            'highlightToken' in item &&
            item.highlightToken
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
        style={styles.listContainer}
        contentContainerStyle={[
          styles.listContent,
          currentVerse && styles.listContentWithPlayer,
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

      {/* Floating Audio Player */}
      <FloatingAudioPlayer verse={currentVerse} onClose={handleClosePlayer} />
    </View>
  );
}

const styles = StyleSheet.create({
  screenContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    backgroundColor: '#0D9488',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  headerSpacer: {
    width: 40,
  },
  queryHeader: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  queryText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  queryMeta: {
    fontSize: 14,
    color: '#6B7280',
  },
  listContainer: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  listContent: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
  },
  listContentWithPlayer: {
    paddingBottom: 100, // Add padding when audio player is visible
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
  loadingText: {
    color: '#757575',
    marginTop: 16,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
});
