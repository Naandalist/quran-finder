import React, { ReactNode } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from 'lib/theme/ThemeProvider';

interface AppBarProps {
  title: string;
  right?: ReactNode;
  left?: ReactNode;
}

export const AppBar: React.FC<AppBarProps> = ({ title, right, left }) => {
  const { colors, spacing, typography } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          paddingHorizontal: spacing.md,
          paddingVertical: spacing.sm,
          backgroundColor: colors.background,
        },
      ]}>
      <View style={styles.leftContainer}>{left}</View>
      <Text
        style={[
          typography.h2,
          styles.title,
          { color: colors.text },
        ]}>
        {title}
      </Text>
      <View style={styles.rightContainer}>{right}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 56,
  },
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    flex: 1,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});

export default AppBar;
