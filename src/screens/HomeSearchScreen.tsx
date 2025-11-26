import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Screen } from 'components/layout/Screen';
import { AppBar } from 'components/layout/AppBar';
import { IconButton } from 'components/common/IconButton';
import { useTheme } from 'lib/theme/ThemeProvider';
import { RootStackParamList } from 'app/navigation/types';
import { APP_NAME } from 'lib/types';

import { SearchBar } from 'components/search/SearchBar';
import { ExampleChips } from 'components/search/ExampleChips';
import { RecentQueries } from 'components/search/RecentQueries';
import { useSearchQuery } from 'lib/hooks/useSearchQuery';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'HomeSearch'>;

export default function HomeSearchScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { colors, spacing, typography } = useTheme();
  const { text, mode, setText, clear } = useSearchQuery();

  // Mock recent queries for now
  const recentQueries = [
    { query: 'alhamdulillah', mode: 'lafaz' as const, timestamp: Date.now() - 3600000 },
    { query: 'sabar', mode: 'makna' as const, timestamp: Date.now() - 7200000 },
  ];

  const handleSearch = () => {
    if (text.trim()) {
      navigation.navigate('SearchResults', { query: text.trim(), mode });
    }
  };

  const handleExamplePress = (query: string) => {
    navigation.navigate('SearchResults', { query, mode });
  };

  const handleRecentPress = (query: string, queryMode: 'lafaz' | 'makna') => {
    navigation.navigate('SearchResults', { query, mode: queryMode });
  };

  return (
    <Screen>
      <AppBar
        title={APP_NAME}
        right={
          <View style={styles.headerActions}>
            <IconButton
              icon="🔖"
              onPress={() => navigation.navigate('Bookmarks')}
            />
            <IconButton
              icon="⚙️"
              onPress={() => navigation.navigate('Settings')}
            />
          </View>
        }
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[styles.content, { gap: spacing.lg }]}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <SearchBar
          value={text}
          onChangeText={setText}
          onClear={clear}
          onSubmit={handleSearch}
        />

        {/* Hint Text */}
        <Text style={[typography.bodySmall, { color: colors.textMuted }]}>
          Contoh: yaayuhalkafirun, alhamdulillah
        </Text>

        {/* Example Chips Section */}
        <View style={[styles.section, { gap: spacing.sm }]}>
          <Text style={[typography.h3, { color: colors.text }]}>
            Coba cari ayat
          </Text>
          <ExampleChips onChipPress={handleExamplePress} />
        </View>

        {/* Recent Queries Section */}
        <View style={[styles.section, { gap: spacing.sm }]}>
          <Text style={[typography.h3, { color: colors.text }]}>
            Terakhir dicari
          </Text>
          <RecentQueries
            queries={recentQueries}
            onQueryPress={handleRecentPress}
          />
        </View>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingBottom: 32,
  },
  section: {},
});
