import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

import { useTheme } from 'lib/theme/ThemeProvider';

import { styles } from '../styles';

export function LoadingState() {
  const { colors, typography } = useTheme();

  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={[typography.body, styles.loadingText]}>Mencari ayat...</Text>
    </View>
  );
}
