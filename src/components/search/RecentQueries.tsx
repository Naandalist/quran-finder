import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTheme } from 'lib/theme/ThemeProvider';

interface RecentQuery {
  query: string;
  mode: 'lafaz' | 'makna';
  timestamp: number;
}

interface RecentQueriesProps {
  queries: RecentQuery[];
  onQueryPress: (query: string, mode: 'lafaz' | 'makna') => void;
  onClearAll?: () => void;
}

export const RecentQueries: React.FC<RecentQueriesProps> = ({
  queries,
  onQueryPress,
  onClearAll,
}) => {
  const { colors, spacing, typography } = useTheme();

  if (queries.length === 0) {
    return (
      <View style={[styles.emptyContainer, { padding: spacing.md }]}>
        <Text style={[typography.bodySmall, { color: colors.textMuted }]}>
          Belum ada pencarian terbaru
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {queries.map((item, index) => (
        <TouchableOpacity
          key={`${item.query}-${index}`}
          style={[
            styles.queryItem,
            {
              paddingVertical: spacing.sm,
              borderBottomColor: colors.border,
            },
          ]}
          onPress={() => onQueryPress(item.query, item.mode)}>
          <Text style={[styles.clockIcon, { color: colors.textMuted }]}>🕐</Text>
          <View style={styles.queryContent}>
            <Text style={[typography.body, { color: colors.text }]}>
              {item.query}
            </Text>
            <Text style={[typography.caption, { color: colors.textMuted }]}>
              {item.mode === 'lafaz' ? 'Lafaz' : 'Makna'}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
      {onClearAll && (
        <TouchableOpacity
          style={[styles.clearButton, { marginTop: spacing.sm }]}
          onPress={onClearAll}>
          <Text style={[typography.bodySmall, { color: colors.primary }]}>
            Hapus semua
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {},
  emptyContainer: {
    alignItems: 'center',
  },
  queryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  clockIcon: {
    fontSize: 16,
    marginRight: 12,
  },
  queryContent: {
    flex: 1,
  },
  clearButton: {
    alignItems: 'center',
  },
});

export default RecentQueries;
