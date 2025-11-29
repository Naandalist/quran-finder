import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { Screen } from 'components/layout/Screen';
import { AppBar } from 'components/layout/AppBar';
import { IconButton } from 'components/common/IconButton';
import { EmptyState } from 'components/common/EmptyState';
import { useTheme } from 'lib/theme/ThemeProvider';
import { RootStackParamList } from 'app/navigation/types';
import { APP_NAME } from 'lib/types';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'HomeSearch'>;

const Tab = createMaterialTopTabNavigator();

// ============================================================================
// Lafaz Search Tab
// ============================================================================

function LafazSearchTab() {
  const navigation = useNavigation<NavigationProp>();
  const { colors, spacing, typography } = useTheme();
  const [query, setQuery] = useState('');

  const handleSubmit = () => {
    if (query.trim()) {
      navigation.navigate('SearchResults', {
        query: query.trim(),
        mode: 'lafaz',
      });
    }
  };

  return (
    <View style={[styles.tabContainer, { backgroundColor: colors.background }]}>
      {/* Search Input */}
      <View style={[styles.searchInputContainer, { padding: spacing.md }]}>
        <View style={styles.searchRow}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSubmit}
            placeholder="Cari ayat berdasarkan lafaz (latin)…"
            placeholderTextColor={colors.textMuted}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
            style={[
              styles.searchInput,
              typography.body,
              {
                flex: 1,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
                borderColor: colors.border,
                backgroundColor: colors.surface,
                color: colors.text,
              },
            ]}
          />
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!query.trim()}
            style={[
              styles.submitButton,
              {
                backgroundColor: query.trim() ? colors.primary : colors.border,
                marginLeft: spacing.sm,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
              },
            ]}>
            <Text
              style={[
                typography.body,
                {
                  color: query.trim() ? '#FFFFFF' : colors.textMuted,
                  fontWeight: '600',
                },
              ]}>
              Cari
            </Text>
          </TouchableOpacity>
        </View>
        <Text
          style={[
            typography.caption,
            { color: colors.textMuted, marginTop: spacing.xs },
          ]}>
          Contoh: yaayyuhalkafirun, alhamdulillah, bismillah
        </Text>
      </View>

      {/* Empty State */}
      <View style={styles.centerContainer}>
        <EmptyState
          icon="🔍"
          title="Cari Ayat dengan Lafaz"
          message="Ketik transliterasi latin dari ayat yang ingin Anda cari"
        />
      </View>
    </View>
  );
}

// ============================================================================
// Terjemahan Search Tab
// ============================================================================

function TerjemahanSearchTab() {
  const navigation = useNavigation<NavigationProp>();
  const { colors, spacing, typography } = useTheme();
  const [query, setQuery] = useState('');

  const handleSubmit = () => {
    if (query.trim()) {
      navigation.navigate('SearchResults', {
        query: query.trim(),
        mode: 'terjemahan',
      });
    }
  };

  return (
    <View style={[styles.tabContainer, { backgroundColor: colors.background }]}>
      {/* Search Input */}
      <View style={[styles.searchInputContainer, { padding: spacing.md }]}>
        <View style={styles.searchRow}>
          <TextInput
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSubmit}
            placeholder="Cari ayat berdasarkan terjemahan (Indonesia)…"
            placeholderTextColor={colors.textMuted}
            returnKeyType="search"
            autoCapitalize="none"
            autoCorrect={false}
            style={[
              styles.searchInput,
              typography.body,
              {
                flex: 1,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
                borderColor: colors.border,
                backgroundColor: colors.surface,
                color: colors.text,
              },
            ]}
          />
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={!query.trim()}
            style={[
              styles.submitButton,
              {
                backgroundColor: query.trim() ? colors.primary : colors.border,
                marginLeft: spacing.sm,
                paddingHorizontal: spacing.md,
                paddingVertical: spacing.sm,
              },
            ]}>
            <Text
              style={[
                typography.body,
                {
                  color: query.trim() ? '#FFFFFF' : colors.textMuted,
                  fontWeight: '600',
                },
              ]}>
              Cari
            </Text>
          </TouchableOpacity>
        </View>
        <Text
          style={[
            typography.caption,
            { color: colors.textMuted, marginTop: spacing.xs },
          ]}>
          Contoh: sabar, bersyukur, tuhan semesta alam
        </Text>
      </View>

      {/* Empty State */}
      <View style={styles.centerContainer}>
        <EmptyState
          icon="🔍"
          title="Cari Ayat dengan Terjemahan"
          message="Ketik kata kunci dalam bahasa Indonesia untuk mencari ayat"
        />
      </View>
    </View>
  );
}

// ============================================================================
// Home Search Screen (Top Tab Navigator)
// ============================================================================

export default function HomeSearchScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { colors } = useTheme();

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

      <Tab.Navigator
        screenOptions={{
          tabBarIndicatorStyle: {
            backgroundColor: colors.primary,
            height: 3,
          },
          tabBarStyle: {
            backgroundColor: colors.surface,
            elevation: 0,
            shadowOpacity: 0,
            borderBottomWidth: 1,
            borderBottomColor: colors.border,
          },
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textMuted,
          tabBarLabelStyle: {
            fontWeight: '600',
            textTransform: 'none',
            fontSize: 14,
          },
          tabBarPressColor: colors.surfaceElevated,
        }}>
        <Tab.Screen
          name="LafazTab"
          component={LafazSearchTab}
          options={{ title: 'Lafaz (Latin)' }}
        />
        <Tab.Screen
          name="TerjemahanTab"
          component={TerjemahanSearchTab}
          options={{ title: 'Terjemahan (ID)' }}
        />
      </Tab.Navigator>
    </Screen>
  );
}

const styles = StyleSheet.create({
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tabContainer: {
    flex: 1,
  },
  searchInputContainer: {},
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    borderRadius: 999,
    borderWidth: 1,
  },
  submitButton: {
    borderRadius: 999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
});
