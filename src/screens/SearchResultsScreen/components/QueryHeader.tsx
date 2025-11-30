import React from 'react';
import { View, Text } from 'react-native';

import { colors } from 'lib/theme/colors';
import { styles } from '../styles';
import { ResultsIcon } from './ResultsIcon';
import { BookIcon } from './BookIcon';

interface QueryHeaderProps {
  query: string;
  resultsCount: number;
  modeLabel: string;
}

export function QueryHeader({
  query,
  resultsCount,
  modeLabel,
}: QueryHeaderProps) {
  return (
    <View style={styles.queryHeader}>
      <Text style={styles.queryText}>Kata kunci: {query}</Text>
      <View style={styles.queryMetaRow}>
        <ResultsIcon size={16} color={colors.gray500} />
        <Text style={styles.queryMeta}>{resultsCount} ayat ditemukan</Text>
        <Text style={styles.queryMetaSeparator}>◆</Text>
        <BookIcon size={16} color={colors.gray500} />
        <Text style={styles.queryMeta}>{modeLabel}</Text>
      </View>
    </View>
  );
}
