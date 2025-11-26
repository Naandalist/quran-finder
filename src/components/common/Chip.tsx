import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from 'lib/theme/ThemeProvider';

interface ChipProps {
  label: string;
  onPress: () => void;
  selected?: boolean;
  style?: ViewStyle;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  onPress,
  selected = false,
  style,
}) => {
  const { colors, spacing } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? colors.primary : colors.surfaceElevated,
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          borderColor: selected ? colors.primary : colors.border,
        },
        style,
      ]}>
      <Text
        style={[
          styles.label,
          { color: selected ? colors.background : colors.text },
        ]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    borderRadius: 20,
    borderWidth: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
  },
});

export default Chip;
