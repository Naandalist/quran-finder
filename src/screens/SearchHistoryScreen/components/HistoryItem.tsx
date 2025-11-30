import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { CloseIcon } from 'components/icons';
import { colors } from 'lib/theme/colors';

import { styles } from '../styles';
import { RecentQuery, MODE_LABELS } from '../hooks';

interface HistoryItemProps {
  item: RecentQuery;
  onSelect: (item: RecentQuery) => void;
  onDelete: (query: string) => void;
}

export function HistoryItem({ item, onSelect, onDelete }: HistoryItemProps) {
  return (
    <View style={styles.historyItem}>
      <TouchableOpacity
        style={styles.historyContent}
        onPress={() => onSelect(item)}
      >
        <Text style={styles.historyQuery}>{item.query}</Text>
        <Text style={styles.historyMode}>{MODE_LABELS[item.mode]}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(item.query)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <CloseIcon size={20} color={colors.gray400} />
      </TouchableOpacity>
    </View>
  );
}
