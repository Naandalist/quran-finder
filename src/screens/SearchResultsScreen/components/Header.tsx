import React from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ArrowLeft } from 'components/icons';
import { colors } from 'lib/theme/colors';

import { styles } from '../styles';

interface HeaderProps {
  onBackPress: () => void;
}

export function Header({ onBackPress }: HeaderProps) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.headerContainer, { paddingTop: insets.top }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.teal} />
      <View style={styles.headerContent}>
        <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
          <ArrowLeft size={24} color={colors.white} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Hasil Pencarian</Text>
        <View style={styles.headerSpacer} />
      </View>
    </View>
  );
}
