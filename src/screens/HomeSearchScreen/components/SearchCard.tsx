import React, { RefObject } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Animated,
} from 'react-native';

import { QueryMode } from 'lib/types';
import { ChevronDown } from 'components/icons/ChevronDown';
import { colors } from 'lib/theme/colors';
import { styles, TEAL_COLOR } from '../styles';
import { MODE_LABELS, MAX_QUERY_LENGTH } from '../hooks';

interface SearchCardProps {
  query: string;
  mode: QueryMode;
  queryError: string;
  placeholder: string;
  inputRef: RefObject<TextInput | null>;
  shakeAnimation: Animated.Value;
  onQueryChange: (text: string) => void;
  onSubmit: () => void;
  onOpenDropdown: () => void;
}

export function SearchCard({
  query,
  mode,
  queryError,
  placeholder,
  inputRef,
  shakeAnimation,
  onQueryChange,
  onSubmit,
  onOpenDropdown,
}: SearchCardProps) {
  const inputFieldStyle = queryError
    ? styles.inputFieldError
    : styles.inputFieldNormal;

  const fieldLabelStyle = queryError
    ? styles.fieldLabelError
    : styles.fieldLabelNormal;

  return (
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
          <Text style={[styles.fieldLabel, fieldLabelStyle]}>Kata kunci</Text>
          <TextInput
            ref={inputRef}
            value={query}
            onChangeText={onQueryChange}
            onSubmitEditing={onSubmit}
            placeholder={placeholder}
            placeholderTextColor={colors.gray400}
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
          onPress={onOpenDropdown}
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
        <TouchableOpacity onPress={onSubmit} style={styles.searchButton}>
          <Text style={styles.searchButtonText}>Cari</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
