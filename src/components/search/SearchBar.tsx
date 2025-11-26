import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useTheme } from 'lib/theme/ThemeProvider';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onClear: () => void;
  onSubmit: () => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  placeholder = 'Ketik lafaz latin bebas, mis. yaayuhalkafirun',
  onClear,
  onSubmit,
}) => {
  const { colors, spacing } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surfaceElevated,
          borderColor: colors.border,
          paddingHorizontal: spacing.md,
        },
      ]}>
      <Text style={[styles.icon, { color: colors.textMuted }]}>🔍</Text>
      <TextInput
        style={[
          styles.input,
          {
            color: colors.text,
            marginHorizontal: spacing.sm,
          },
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        returnKeyType="search"
        onSubmitEditing={onSubmit}
        autoCorrect={false}
        autoCapitalize="none"
      />
      {value.length > 0 && (
        <TouchableOpacity onPress={onClear}>
          <Text style={[styles.clearIcon, { color: colors.textMuted }]}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    height: 48,
  },
  icon: {
    fontSize: 18,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: '100%',
  },
  clearIcon: {
    fontSize: 16,
    padding: 4,
  },
});

export default SearchBar;
