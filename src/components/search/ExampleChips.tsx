import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useTheme } from 'lib/theme/ThemeProvider';
import { Chip } from 'components/common/Chip';
import { EXAMPLE_QUERIES } from 'lib/types';

interface ExampleChipsProps {
  onChipPress: (query: string) => void;
}

export const ExampleChips: React.FC<ExampleChipsProps> = ({ onChipPress }) => {
  const { spacing } = useTheme();

  return (
    <View style={[styles.container, { gap: spacing.sm }]}>
      {EXAMPLE_QUERIES.map((query) => (
        <Chip
          key={query}
          label={query}
          onPress={() => onChipPress(query)}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default ExampleChips;
