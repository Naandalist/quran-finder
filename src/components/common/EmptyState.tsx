import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from 'lib/theme/ThemeProvider';

interface EmptyStateProps {
  icon?: string;
  title: string;
  message?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon = '📭',
  title,
  message,
}) => {
  const { colors, spacing, typography } = useTheme();

  return (
    <View style={[styles.container, { padding: spacing.xl }]}>
      <Text style={styles.icon}>{icon}</Text>
      <Text style={[typography.h3, { color: colors.text, marginTop: spacing.md }]}>
        {title}
      </Text>
      {message && (
        <Text
          style={[
            typography.body,
            { color: colors.textMuted, marginTop: spacing.sm, textAlign: 'center' },
          ]}>
          {message}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 48,
  },
});

export default EmptyState;
