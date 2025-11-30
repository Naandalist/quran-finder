import React from 'react';
import {
  View,
  Text,
  Image,
  ImageSourcePropType,
  StyleSheet,
} from 'react-native';
import { useTheme } from 'lib/theme/ThemeProvider';

interface EmptyStateProps {
  icon?: string;
  image?: ImageSourcePropType;
  title: string;
  message?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  image,
  title,
  message,
}) => {
  const { colors, spacing, typography } = useTheme();

  return (
    <View style={[styles.container, { padding: spacing.xl }]}>
      {image ? (
        <Image source={image} style={styles.image} resizeMode="contain" />
      ) : null}
      <Text
        style={[typography.h3, { color: colors.text, marginTop: spacing.md }]}
      >
        {title}
      </Text>
      {message && (
        <Text
          style={[
            typography.body,
            styles.message,
            { color: colors.textMuted, marginTop: spacing.sm },
          ]}
        >
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
  image: {
    width: 120,
    height: 120,
  },
  message: {
    textAlign: 'center',
  },
});

export default EmptyState;
