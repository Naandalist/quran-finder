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
  Animated,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from 'app/navigation/types';
import { QueryMode } from 'lib/types';
import storage from 'lib/storage/storage';
import { ChevronDown } from 'components/icons/ChevronDown';
import { CloseIcon } from 'components/icons/CloseIcon';
import { ArrowUpRight } from 'components/icons/ArrowUpRight';
import * as yup from 'yup';

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
  lafaz: 'Contoh: qulhuallahu...',
  makna: 'Contoh: balasan orang sabar...',
};

const EXAMPLE_SEARCHES: Array<{ query: string; mode: QueryMode }> = [
  { query: 'Bismillah', mode: 'lafaz' },
  { query: 'yaayuhalkafirun', mode: 'lafaz' },
  { query: 'surga', mode: 'makna' },
];

const MAX_QUERY_LENGTH = 30;

// Yup validation schema
const querySchema = yup
  .string()
  .required('Kata kunci tidak boleh kosong')
  .max(MAX_QUERY_LENGTH, `Maksimal ${MAX_QUERY_LENGTH} karakter`)
  .matches(/^[a-zA-Z\s']+$/, 'Hanya huruf yang diperbolehkan');

// ============================================================================
// Home Search Screen
// ============================================================================

export default function HomeSearchScreen() {
  const navigation = useNavigation<NavigationProp>();

  // Existing state - reused without modification
  const [query, setQuery] = useState('');
  const [mode, setMode] = useState<QueryMode>('lafaz');

  // UI state for dropdown
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);

  // History state
  const [recentSearches, setRecentSearches] = useState<RecentQuery[]>([]);

  // Error state for validation (empty string = no error)
  const [queryError, setQueryError] = useState<string>('');

  // Ref for input focus
  const inputRef = useRef<TextInput>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const shakeAnimation = useRef(new Animated.Value(0)).current;

  // Shake animation function
  const triggerShake = useCallback(() => {
    Animated.sequence([
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: -10,
        duration: 50,
        useNativeDriver: true,
      }),
      Animated.timing(shakeAnimation, {
        toValue: 0,
        duration: 50,
        useNativeDriver: true,
      }),
    ]).start();
  }, [shakeAnimation]);

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
    const trimmedQuery = query.trim();

    // Validate using Yup
    try {
      querySchema.validateSync(trimmedQuery);
    } catch (error) {
      if (error instanceof yup.ValidationError) {
        setQueryError(error.message);
        triggerShake();
      }
      return;
    }

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
  }, [query, mode, navigation, recentSearches, triggerShake]);

  // Clear error when user types
  const handleQueryChange = useCallback(
    (text: string) => {
      setQuery(text);
      if (queryError && text.trim()) {
        setQueryError('');
      }
    },
    [queryError],
  );

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

  // Dynamic styles based on error state
  const inputFieldStyle = queryError
    ? styles.inputFieldError
    : styles.inputFieldNormal;
  const fieldLabelStyle = queryError
    ? styles.fieldLabelError
    : styles.fieldLabelNormal;

  return (
    <>
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
      >
        {/* Hero Section - Teal Background */}
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Cari Ayat</Text>
          <Text style={styles.heroSubtitleBold}>
            Temukan ayat Al-Qur'an dari lafaz atau terjemahan yang kamu ingat.
          </Text>
          <Text style={styles.heroSubtitle}>
            Ketik lafaz latin atau kata kunci bahasa Indonesia, lalu pilih mode
            pencarian yang sesuai.
          </Text>

          {/* Search Card */}
          <View style={styles.searchCardWrapper}>
            <View style={styles.searchCard}>
              {/* Query Input Field */}
              <Animated.View
                style={[
                  styles.inputField,
                  inputFieldStyle,
                  { transform: [{ translateX: shakeAnimation }] },
                ]}
              >
                <Text style={[styles.fieldLabel, fieldLabelStyle]}>
                  Kata kunci
                </Text>
                <TextInput
                  ref={inputRef}
                  value={query}
                  onChangeText={handleQueryChange}
                  onSubmitEditing={handleSubmit}
                  placeholder={placeholder}
                  placeholderTextColor="#9CA3AF"
                  returnKeyType="search"
                  autoCapitalize="none"
                  autoCorrect={false}
                  maxLength={MAX_QUERY_LENGTH}
                  style={styles.fieldInput}
                />
              </Animated.View>
              {queryError && <Text style={styles.errorText}>{queryError}</Text>}

              {/* Mode Dropdown Field */}
              <TouchableOpacity
                style={[styles.inputField, styles.inputFieldNormal]}
                onPress={() => setIsDropdownVisible(true)}
              >
                <Text style={[styles.fieldLabel, styles.fieldLabelNormal]}>
                  Pilih mode pencarian
                </Text>
                <View style={styles.dropdownRow}>
                  <Text style={styles.fieldValue}>{MODE_LABELS[mode]}</Text>
                  <ChevronDown size={20} color={TEAL_COLOR} />
                </View>
              </TouchableOpacity>

              {/* Cari Button */}
              <TouchableOpacity
                onPress={handleSubmit}
                style={styles.searchButton}
              >
                <Text style={styles.searchButtonText}>Cari</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* History Section */}
        {recentSearches.length > 0 && (
          <View style={styles.historySectionWithPadding}>
            <Text style={styles.sectionTitle}>Riwayat Pencarian</Text>
            {recentSearches.slice(0, 3).map((item, index) => (
              <View
                key={`history-${item.query}-${index}`}
                style={styles.historyItem}
              >
                <TouchableOpacity
                  style={styles.historyContent}
                  onPress={() => handleSelectItem(item.query, item.mode)}
                >
                  <Text style={styles.historyQuery}>{item.query}</Text>
                  <Text style={styles.historyMode}>
                    {MODE_LABELS[item.mode]}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteHistoryItem(item.query)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <CloseIcon size={20} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {/* Examples Section */}
        <View style={styles.historySection}>
          <Text style={styles.sectionTitle}>Contoh Pencarian</Text>
          {EXAMPLE_SEARCHES.map((item, index) => (
            <TouchableOpacity
              key={`example-${item.query}-${index}`}
              style={styles.historyItem}
              onPress={() => handleSelectItem(item.query, item.mode)}
            >
              <View style={styles.historyContent}>
                <Text style={styles.historyQuery}>{item.query}</Text>
                <Text style={styles.historyMode}>{MODE_LABELS[item.mode]}</Text>
              </View>
              <View style={styles.arrowButton}>
                <ArrowUpRight size={18} color="#9CA3AF" />
              </View>
            </TouchableOpacity>
          ))}
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
            style={styles.modalContent}
            onPress={e => e.stopPropagation()}
          >
            <Text style={styles.modalTitle}>Pilih mode pencarian</Text>
            {(Object.keys(MODE_LABELS) as QueryMode[]).map(modeKey => (
              <TouchableOpacity
                key={modeKey}
                style={[
                  styles.modalOption,
                  mode === modeKey && styles.modalOptionSelected,
                ]}
                onPress={() => {
                  setMode(modeKey);
                  setIsDropdownVisible(false);
                }}
              >
                <Text
                  style={[
                    styles.modalOptionText,
                    mode === modeKey && styles.modalOptionTextSelected,
                  ]}
                >
                  {MODE_LABELS[modeKey]}
                </Text>
                <View
                  style={[
                    styles.radioOuter,
                    mode === modeKey && styles.radioOuterSelected,
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
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  heroSection: {
    backgroundColor: TEAL_COLOR,
    paddingHorizontal: 16,
    paddingTop: 32,
    paddingBottom: 16,
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
    backgroundColor: '#FFFFFF',
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
  inputFieldNormal: {
    borderColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  inputFieldError: {
    borderColor: '#DC2626',
    backgroundColor: '#FFFFFF',
  },
  errorText: {
    color: '#DC2626',
    fontSize: 12,
    marginTop: -12,
    marginBottom: 16,
  },
  fieldLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  fieldLabelNormal: {
    color: '#9CA3AF',
  },
  fieldLabelError: {
    color: '#DC2626',
  },
  fieldInput: {
    fontSize: 15,
    padding: 0,
    margin: 0,
    color: '#1F2937',
  },
  fieldValue: {
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
    color: TEAL_COLOR,
  },
  dropdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchButton: {
    backgroundColor: TEAL_COLOR,
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
    backgroundColor: '#FFFFFF',
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  historySectionWithPadding: {
    backgroundColor: '#FFFFFF',
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 0,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
    color: '#1F2937',
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderLeftWidth: 4,
    borderLeftColor: TEAL_COLOR,
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  historyContent: {
    flex: 1,
  },
  historyQuery: {
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
    color: '#1F2937',
  },
  historyMode: {
    fontSize: 13,
    color: '#9CA3AF',
  },
  deleteButton: {
    padding: 4,
    marginLeft: 8,
  },
  arrowButton: {
    padding: 4,
    marginLeft: 8,
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
    backgroundColor: '#FFFFFF',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
    color: '#1F2937',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: 8,
    padding: 14,
    marginBottom: 4,
    backgroundColor: 'transparent',
  },
  modalOptionSelected: {
    backgroundColor: '#F3F4F6',
  },
  modalOptionText: {
    fontSize: 15,
    flex: 1,
    color: '#1F2937',
    fontWeight: '400',
  },
  modalOptionTextSelected: {
    color: TEAL_COLOR,
    fontWeight: '600',
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 12,
  },
  radioOuterSelected: {
    borderColor: TEAL_COLOR,
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: TEAL_COLOR,
  },
});
