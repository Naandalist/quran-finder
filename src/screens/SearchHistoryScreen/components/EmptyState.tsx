import React from 'react';
import { View, Text } from 'react-native';

import { styles } from '../styles';

export function EmptyState() {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyStateText}>Belum ada riwayat pencarian</Text>
    </View>
  );
}
