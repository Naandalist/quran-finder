import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { ArrowLeft } from 'components/icons';
import { colors } from 'lib/theme/colors';

import { styles } from '../styles';

interface HeaderProps {
  onBackPress: () => void;
  showClearAll: boolean;
  onClearAll: () => void;
}

export function Header({ onBackPress, showClearAll, onClearAll }: HeaderProps) {
  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.backButton} onPress={onBackPress}>
        <ArrowLeft size={24} color={colors.gray800} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Riwayat Pencarian</Text>
      {showClearAll && (
        <TouchableOpacity onPress={onClearAll}>
          <Text style={styles.clearAllText}>Hapus semua</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
