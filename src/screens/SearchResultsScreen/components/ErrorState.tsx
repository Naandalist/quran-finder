import React from 'react';
import { View } from 'react-native';

import { EmptyState } from 'components/common';

import { styles } from '../styles';

interface ErrorStateProps {
  error: string;
}

export function ErrorState({ error }: ErrorStateProps) {
  return (
    <View style={styles.errorContainer}>
      <EmptyState icon="⚠️" title="Terjadi Kesalahan" message={error} />
    </View>
  );
}
