import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from 'lib/theme/ThemeProvider';

interface ScreenProps {
  children: ReactNode;
  style?: ViewStyle;
  noPadding?: boolean;
}

export const Screen: React.FC<ScreenProps> = ({
  children,
  style,
  noPadding = false,
}) => {
  const { colors, spacing } = useTheme();

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: colors.background }]}
      edges={['top', 'left', 'right']}>
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background },
          !noPadding && { paddingHorizontal: spacing.md },
          style,
        ]}>
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
});

export default Screen;
