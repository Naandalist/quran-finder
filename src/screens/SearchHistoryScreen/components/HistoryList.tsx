import React from 'react';
import { FlatList } from 'react-native';

import { styles } from '../styles';
import { RecentQuery } from '../hooks';
import { HistoryItem } from './HistoryItem';
import { EmptyState } from './EmptyState';

interface HistoryListProps {
  data: RecentQuery[];
  onSelectItem: (item: RecentQuery) => void;
  onDeleteItem: (query: string) => void;
}

export function HistoryList({
  data,
  onSelectItem,
  onDeleteItem,
}: HistoryListProps) {
  return (
    <FlatList
      data={data}
      keyExtractor={(item, index) => `${item.query}-${index}`}
      renderItem={({ item }) => (
        <HistoryItem
          item={item}
          onSelect={onSelectItem}
          onDelete={onDeleteItem}
        />
      )}
      contentContainerStyle={styles.listContent}
      ListEmptyComponent={EmptyState}
    />
  );
}
