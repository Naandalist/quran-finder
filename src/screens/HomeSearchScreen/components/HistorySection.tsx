import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { QueryMode } from 'lib/types';
import { CloseIcon } from 'components/icons';
import { colors } from 'lib/theme/colors';
import { styles } from '../styles';
import { MODE_LABELS, RecentQuery } from '../hooks';

interface HistorySectionProps {
  recentSearches: RecentQuery[];
  onSelectItem: (query: string, mode: QueryMode) => void;
  onDeleteItem: (query: string) => void;
  onViewAll: () => void;
}

export function HistorySection({
  recentSearches,
  onSelectItem,
  onDeleteItem,
  onViewAll,
}: HistorySectionProps) {
  if (recentSearches.length === 0) {
    return null;
  }

  return (
    <View style={styles.historySectionWithPadding}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Riwayat Pencarian</Text>
        <TouchableOpacity onPress={onViewAll}>
          <Text style={styles.sectionAction}>Lihat semua</Text>
        </TouchableOpacity>
      </View>

      {recentSearches.slice(0, 3).map((item, index) => (
        <View key={`history-${item.query}-${index}`} style={styles.historyItem}>
          <TouchableOpacity
            style={styles.historyContent}
            onPress={() => onSelectItem(item.query, item.mode)}
          >
            <Text style={styles.historyQuery}>{item.query}</Text>
            <Text style={styles.historyMode}>{MODE_LABELS[item.mode]}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => onDeleteItem(item.query)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <CloseIcon size={20} color={colors.gray400} />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}
