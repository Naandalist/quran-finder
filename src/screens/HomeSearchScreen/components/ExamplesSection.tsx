import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { QueryMode } from 'lib/types';
import { ArrowUpRight } from 'components/icons';
import { colors } from 'lib/theme/colors';
import { styles } from '../styles';
import { MODE_LABELS, EXAMPLE_SEARCHES } from '../hooks';

interface ExamplesSectionProps {
  onSelectItem: (query: string, mode: QueryMode) => void;
}

export function ExamplesSection({ onSelectItem }: ExamplesSectionProps) {
  return (
    <View style={styles.historySection}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Contoh Kata Kunci</Text>
      </View>
      {EXAMPLE_SEARCHES.map((item, index) => (
        <TouchableOpacity
          key={`example-${item.query}-${index}`}
          style={styles.historyItem}
          onPress={() => onSelectItem(item.query, item.mode)}
        >
          <View style={styles.historyContent}>
            <Text style={styles.historyQuery}>{item.query}</Text>
            <Text style={styles.historyMode}>{MODE_LABELS[item.mode]}</Text>
          </View>
          <View style={styles.arrowButton}>
            <ArrowUpRight size={18} color={colors.gray400} />
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
}
