import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from 'lib/theme/ThemeProvider';

interface IconButtonProps {
  icon: string;
  onPress: () => void;
  size?: number;
  color?: string;
  style?: ViewStyle;
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  onPress,
  size = 24,
  color,
  style,
}) => {
  const { colors } = useTheme();

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.button, style]}
      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
      <Text style={{ fontSize: size, color: color || colors.text }}>{icon}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default IconButton;
