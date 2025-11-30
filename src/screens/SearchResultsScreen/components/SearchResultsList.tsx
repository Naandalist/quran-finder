import React from 'react';
import { View, FlatList } from 'react-native';

import { EmptyState } from 'components/common/EmptyState';
import { VerseCard } from 'components/verses/VerseCard';
import { Verse } from 'lib/types';

import { styles } from '../styles';
import { SearchResultItem } from '../hooks';

interface SearchResultsListProps {
  results: SearchResultItem[];
  query: string;
  mode: 'lafaz' | 'terjemahan';
  hasPlayer: boolean;
  onVersePress: (verse: Verse) => void;
}

export function SearchResultsList({
  results,
  query,
  mode,
  hasPlayer,
  onVersePress,
}: SearchResultsListProps) {
  return (
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
            onPress={() => onVersePress(item.verse)}
            highlightText={highlightText}
            highlightMode={mode}
            score={item.score}
          />
        );
      }}
      style={styles.listContainer}
      contentContainerStyle={[
        styles.listContent,
        hasPlayer && styles.listContentWithPlayer,
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
  );
}
