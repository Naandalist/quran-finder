import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from 'lib/theme/ThemeProvider';
import { QueryMode } from 'lib/types';

interface ModeToggleProps {
  mode: QueryMode;
  onModeChange: (mode: QueryMode) => void;
}

export const ModeToggle: React.FC<ModeToggleProps> = ({ mode, onModeChange }) => {
  const { colors, spacing } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surfaceElevated,
          padding: spacing.xs,
        },
      ]}>
      <TouchableOpacity
        style={[
          styles.pill,
          {
            backgroundColor: mode === 'lafaz' ? colors.primary : 'transparent',
            paddingVertical: spacing.sm,
            paddingHorizontal: spacing.md,
          },
        ]}
        onPress={() => onModeChange('lafaz')}>
        <Text
          style={[
            styles.pillText,
            {
              color: mode === 'lafaz' ? colors.background : colors.textMuted,
            },
          ]}>
          Lafaz (Latin)
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.pill,
          {
            backgroundColor: mode === 'makna' ? colors.primary : 'transparent',
            paddingVertical: spacing.sm,
            paddingHorizontal: spacing.md,
          },
        ]}
        onPress={() => onModeChange('makna')}>
        <Text
          style={[
            styles.pillText,
            {
              color: mode === 'makna' ? colors.background : colors.textMuted,
            },
          ]}>
          Makna (Indonesia)
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 12,
  },
  pill: {
    flex: 1,
    alignItems: 'center',
    borderRadius: 10,
  },
  pillText: {
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ModeToggle;
