import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  Pressable,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { Screen } from 'components/layout/Screen';
import { AppBar } from 'components/layout/AppBar';
import { IconButton } from 'components/common/IconButton';
import { useTheme } from 'lib/theme/ThemeProvider';
import { RootStackParamList } from 'app/navigation/types';
import { APP_NAME, QueryMode } from 'lib/types';
import storage from 'lib/storage/storage';
import { ChevronDownCircle } from 'components/icons/ChevronDownCircle';
import { ChevronDown } from 'components/icons/ChevronDown';
import { CloseIcon } from 'components/icons/CloseIcon';
import { ArrowUpRight } from 'components/icons/ArrowUpRight';

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  'HomeSearch'
>;

// ============================================================================
// Types
// ============================================================================

interface RecentQuery {
  query: string;
  mode: QueryMode;
  timestamp: number;
}

// ============================================================================
// Constants
// ============================================================================

const TEAL_COLOR = '#006266';

const MODE_LABELS: Record<QueryMode, string> = {
  lafaz: 'Lafaz (latin)',
  makna: 'Terjemahan (Indonesia)',
};

const MODE_PLACEHOLDERS: Record<QueryMode, string> = {
  lafaz: 'Contoh: yaayuhalkafirun, qulhuallahu...',
  makna: 'Contoh: surga yang tinggi, balasan orang sabar...',
};

const EXAMPLE_SEARCHES: Array<{ query: string; mode: QueryMode }> = [
  { query: 'Bismillah', mode: 'lafaz' },
  { query: 'yaayuhalkafirun', mode: 'lafaz' },
  { query: 'surga', mode: 'makna' },
];

// ============================================================================
// Home Search Screen
// ============================================================================

export default function HomeSearchScreen() {
  const navigation = useNavigation<NavigationProp>();
  const { colors, spacing, typography } = useTheme();

  // Existing state - reused without modification
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<QueryMode>('lafaz');

  // UI state for dropdown
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  // History state
  const [recentSearches, setRecentSearches] = useState<RecentQuery[]>([]);

  // Ref for input focus
  const inputRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  // Load recent searches from storage
  useEffect(() => {
    const loadRecentSearches = () => {
      const stored = storage.get<RecentQuery[]>(storage.keys.RECENT_QUERIES);
      if (stored) {
        setRecentSearches(stored);
      }
    };
    loadRecentSearches();
  }, []);

  // Existing handler - logic unchanged
  const handleSubmit = useCallback(() => {
    if (query.trim()) {
      // Save to recent searches
      const newSearch: RecentQuery = {
        query: query.trim(),
        mode,
        timestamp: Date.now(),
      };
      const updated = [
        newSearch,
        ...recentSearches.filter(s => s.query !== query.trim()),
      ].slice(0, 10);
      setRecentSearches(updated);
      storage.set(storage.keys.RECENT_QUERIES, updated);

      navigation.navigate('SearchResults', {
        query: query.trim(),
        mode: mode === 'lafaz' ? 'lafaz' : 'terjemahan',
      });
    }
  }, [query, mode, navigation, recentSearches]);

  // Handler for selecting a history/example item
  const handleSelectItem = useCallback(
    (itemQuery: string, itemMode: QueryMode) => {
      setQuery(itemQuery);
      setMode(itemMode);
      // Scroll to top and focus the input after selection
      scrollViewRef.current?.scrollTo({ y: 0, animated: true });
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    },
    [],
  );

  // Handler for deleting a history item
  const handleDeleteHistoryItem = useCallback(
    (itemQuery: string) => {
      const updated = recentSearches.filter(s => s.query !== itemQuery);
      setRecentSearches(updated);
      storage.set(storage.keys.RECENT_QUERIES, updated);
    },
    [recentSearches],
  );

  // Dynamic placeholder based on mode
  const placeholder = MODE_PLACEHOLDERS[mode];

  return (
    // <Screen>
    <>
      <ScrollView
        ref={scrollViewRef}
        style={[styles.scrollContainer, { backgroundColor: colors.background }]}
        keyboardShouldPersistTaps="handled"
      >
        {/* Hero Section - Teal Background */}
        <View style={styles.heroSection}>
          {/* Title - Italic Script Style */}
          <Text style={styles.heroTitle}>Cari Ayat</Text>

          {/* Subheading Line 1 (Bold) */}
          <Text style={styles.heroSubtitleBold}>
            Temukan ayat Al-Qur'an dari lafaz atau terjemahan yang kamu ingat.
          </Text>

          {/* Subheading Line 2 (Normal) */}
          <Text style={styles.heroSubtitle}>
            Ketik lafaz latin atau kata kunci bahasa Indonesia, lalu pilih mode
            pencarian yang sesuai.
          </Text>

          {/* Search Card - Overlapping Hero */}
          <View style={styles.searchCardWrapper}>
            <View
              style={[
                styles.searchCard,
                {
                  backgroundColor: colors.background,
                },
              ]}
            >
              {/* Query Input Field */}
              <View
                style={[
                  styles.inputField,
                  {
                    borderColor: colors.border,
                    backgroundColor: colors.background,
                  },
                ]}
              >
                <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>
                  Kata kunci
                </Text>
                <TextInput
                  ref={inputRef}
                  value={query}
                  onChangeText={setQuery}
                  onSubmitEditing={handleSubmit}
                  placeholder={placeholder}
                  placeholderTextColor={colors.textMuted}
                  returnKeyType="search"
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={[
                    styles.fieldInput,
                    {
                      color: colors.text,
                    },
                  ]}
                />
              </View>

              {/* Mode Dropdown Field */}
              <TouchableOpacity
                style={[
                  styles.inputField,
                  {
                    borderColor: colors.border,
                    backgroundColor: colors.background,
                  },
                ]}
                onPress={() => setIsDropdownVisible(true)}
              >
                <Text style={[styles.fieldLabel, { color: colors.textMuted }]}>
                  Pilih mode pencarian
                </Text>
                <View style={styles.dropdownRow}>
                  <Text style={[styles.fieldValue, { color: TEAL_COLOR }]}>
                    {MODE_LABELS[mode]}
                  </Text>
                  <ChevronDown size={20} color={TEAL_COLOR} />
                </View>
              </TouchableOpacity>

              {/* Cari Button */}
              <TouchableOpacity
                onPress={handleSubmit}
                style={[
                  styles.searchButton,
                  {
                    backgroundColor: TEAL_COLOR,
                  },
                ]}
              >
                <Text style={styles.searchButtonText}>Cari</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* History or Examples Section */}
        <View
          style={[
            styles.historySection,
            { backgroundColor: colors.background, padding: spacing.md },
          ]}
        >
          {recentSearches.length > 0 ? (
            <>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: colors.text, marginBottom: spacing.sm },
                ]}
              >
                Riwayat Pencarian
              </Text>
              {recentSearches.map((item, index) => (
                <View
                  key={`${item.query}-${index}`}
                  style={[
                    styles.historyItem,
                    {
                      borderColor: colors.border,
                      marginBottom: spacing.sm,
                    },
                  ]}
                >
                  <TouchableOpacity
                    style={styles.historyContent}
                    onPress={() => handleSelectItem(item.query, item.mode)}
                  >
                    <Text style={[styles.historyQuery, { color: colors.text }]}>
                      {item.query}
                    </Text>
                    <Text
                      style={[styles.historyMode, { color: colors.textMuted }]}
                    >
                      {MODE_LABELS[item.mode]}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={() => handleDeleteHistoryItem(item.query)}
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  >
                    <CloseIcon size={20} color={colors.textMuted} />
                  </TouchableOpacity>
                </View>
              ))}
            </>
          ) : (
            <>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: colors.text, marginBottom: spacing.sm },
                ]}
              >
                Contoh Pencarian
              </Text>
              {EXAMPLE_SEARCHES.map((item, index) => (
                <TouchableOpacity
                  key={`${item.query}-${index}`}
                  style={[
                    styles.historyItem,
                    {
                      borderColor: colors.border,
                      marginBottom: spacing.sm,
                    },
                  ]}
                  onPress={() => handleSelectItem(item.query, item.mode)}
                >
                  <View style={styles.historyContent}>
                    <Text style={[styles.historyQuery, { color: colors.text }]}>
                      {item.query}
                    </Text>
                    <Text
                      style={[styles.historyMode, { color: colors.textMuted }]}
                    >
                      {MODE_LABELS[item.mode]}
                    </Text>
                  </View>
                  <View style={styles.arrowButton}>
                    <ArrowUpRight size={18} color={colors.textMuted} />
                  </View>
                </TouchableOpacity>
              ))}
            </>
          )}
        </View>
      </ScrollView>

      {/* Mode Selection Modal */}
      <Modal
        visible={isDropdownVisible}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => setIsDropdownVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsDropdownVisible(false)}
        >
          <Pressable
            style={[
              styles.modalContent,
              { backgroundColor: colors.background },
            ]}
            onPress={e => e.stopPropagation()}
          >
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Pilih mode pencarian
            </Text>
            {(Object.keys(MODE_LABELS) as QueryMode[]).map(modeKey => (
              <TouchableOpacity
                key={modeKey}
                style={[
                  styles.modalOption,
                  {
                    backgroundColor:
                      mode === modeKey ? colors.surface : 'transparent',
                  },
                ]}
                onPress={() => {
                  setMode(modeKey);
                  setIsDropdownVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    {
                      color: mode === modeKey ? TEAL_COLOR : colors.text,
                      fontWeight: mode === modeKey ? '600' : '400',
                    },
                  ]}
                >
                  {MODE_LABELS[modeKey]}
                </Text>
                <View
                  style={[
                    styles.radioOuter,
                    {
                      borderColor:
                        mode === modeKey ? TEAL_COLOR : colors.border,
                    },
                  ]}
                >
                  {mode === modeKey && <View style={styles.radioInner} />}
                </View>
              </TouchableOpacity>
            ))}
          </Pressable>
        </Pressable>
      </Modal>
    </>
    // </Screen>
  );
}

const styles = StyleSheet.create({
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  heroSection: {
    backgroundColor: TEAL_COLOR,
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 16,
    marginHorizontal: 0,
  },
  heroTitle: {
    fontSize: 40,
    fontFamily: 'CrushedStrike',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  heroSubtitleBold: {
    fontSize: 15,
    fontWeight: '600',
    lineHeight: 22,
    color: '#FFFFFF',
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 14,
    lineHeight: 20,
    color: 'rgba(255,255,255,0.85)',
  },
  searchCardWrapper: {
    marginTop: 24,
    marginBottom: 8,
  },
  searchCard: {
    borderRadius: 10,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
  inputField: {
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
    paddingBottom: 12,
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  fieldInput: {
    fontSize: 15,
    padding: 0,
    margin: 0,
  },
  fieldValue: {
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
  },
  dropdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownIcon: {
    fontSize: 12,
    marginLeft: 8,
  },
  searchButton: {
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  historySection: {
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderLeftWidth: 4,
    borderLeftColor: TEAL_COLOR,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
  },
  historyContent: {
    flex: 1,
  },
  historyQuery: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  historyMode: {
    fontSize: 13,
  },
  deleteButton: {
    padding: 4,
    marginLeft: 8,
  },
  arrowButton: {
    padding: 4,
    marginLeft: 8,
  },
  deleteIcon: {
    fontSize: 20,
    fontWeight: '300',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '80%',
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    padding: 14,
    marginBottom: 4,
  },
  modalOptionText: {
    fontSize: 15,
    flex: 1,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: TEAL_COLOR,
  },
});
