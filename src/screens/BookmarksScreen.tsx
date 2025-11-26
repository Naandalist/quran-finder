import React from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Screen } from 'components/layout/Screen';
import { AppBar } from 'components/layout/AppBar';
import { IconButton } from 'components/common/IconButton';
import { EmptyState } from 'components/common/EmptyState';
import { useTheme } from 'lib/theme/ThemeProvider';
import { RootStackParamList } from 'app/navigation/types';

import { useBookmarks } from 'lib/hooks/useBookmarks';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Bookmarks'>;

export default function BookmarksScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { colors, spacing, typography } = useTheme();
  const { bookmarks, removeBookmark } = useBookmarks();

  const handleVersePress = (verseKey: string) => {
    navigation.navigate('VerseDetail', { verseKey });
  };

  return (
    <Screen>
      <AppBar
        title="Bookmark"
        left={
          <IconButton icon="←" onPress={() => navigation.goBack()} />
        }
      />

      <FlatList
        data={bookmarks}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.bookmarkItem,
              {
                backgroundColor: colors.surface,
                padding: spacing.md,
                marginHorizontal: spacing.md,
                marginBottom: spacing.sm,
              },
            ]}
            onPress={() => handleVersePress(item)}>
            <View style={styles.bookmarkContent}>
              <Text style={[typography.body, { color: colors.text }]}>
                {item}
              </Text>
              <Text style={[typography.caption, { color: colors.textMuted }]}>
                Tap untuk melihat detail
              </Text>
            </View>
            <TouchableOpacity onPress={() => removeBookmark(item)}>
              <Text style={{ color: colors.error }}>🗑️</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <EmptyState
            icon="🔖"
            title="Belum ada bookmark"
            message="Tandai ayat favorit untuk menyimpannya di sini"
          />
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  listContent: {
    flexGrow: 1,
    paddingTop: 8,
  },
  bookmarkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 12,
  },
  bookmarkContent: {
    flex: 1,
  },
});
