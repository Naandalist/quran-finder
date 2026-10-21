import React from 'react';
import { View, FlatList } from 'react-native';

import { EmptyState } from 'components/common';
import { NativeAdCard } from 'lib/ads';
import { Verse } from 'lib/types';
import { VerseCard } from './VerseCard';

import { styles } from '../styles';
import { SearchResultItem } from '../hooks';

const AD_EVERY = 3;

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
      renderItem={({ item, index }) => {
        const highlightText =
          mode === 'terjemahan' &&
          'highlightToken' in item &&
          item.highlightToken
            ? item.highlightToken
            : query;

        return (
          <View>
            <VerseCard
              verse={item.verse}
              onPress={() => onVersePress(item.verse)}
              highlightText={highlightText}
              highlightMode={mode}
              score={item.score}
            />
            {(index + 1) % AD_EVERY === 0 ? <NativeAdCard /> : null}
          </View>
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
            title="Tidak Ditemukan"
            message={`Tidak ada ayat yang cocok dengan "${query}"`}
          />
        </View>
      }
    />
  );
}
