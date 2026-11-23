import React from 'react';
import { View, ScrollView, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BannerAdSlot } from 'lib/ads';
import { spacing } from 'lib/theme/spacing';

import { styles } from './styles';
import { useHomeSearch } from './hooks';
import {
  HeroSection,
  SearchCard,
  HistorySection,
  ExamplesSection,
  ModeSelectionModal,
} from './components';

export default function HomeSearchScreen() {
  const insets = useSafeAreaInsets();
  const {
    query,
    mode,
    queryError,
    isDropdownVisible,
    recentSearches,
    placeholder,
    inputRef,
    scrollViewRef,
    shakeAnimation,
    handleQueryChange,
    handleSubmit,
    handleSelectItem,
    deleteRecentSearch,
    openDropdown,
    closeDropdown,
    selectMode,
    navigateToHistory,
  } = useHomeSearch();

  return (
    <View style={styles.screenWrap}>
      <StatusBar barStyle="light-content" />
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollContainer}
        contentContainerStyle={{ paddingBottom: insets.bottom }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={[styles.heroSection, { paddingTop: insets.top + spacing.xl }]}>
          <HeroSection />
          <SearchCard
            query={query}
            mode={mode}
            queryError={queryError}
            placeholder={placeholder}
            inputRef={inputRef}
            shakeAnimation={shakeAnimation}
            onQueryChange={handleQueryChange}
            onSubmit={handleSubmit}
            onOpenDropdown={openDropdown}
          />
        </View>

        {/* History Section */}
        <HistorySection
          recentSearches={recentSearches}
          onSelectItem={handleSelectItem}
          onDeleteItem={deleteRecentSearch}
          onViewAll={navigateToHistory}
        />

        {/* Examples Section */}
        <ExamplesSection onSelectItem={handleSelectItem} />

        <View style={styles.homeAdSection}>
          <BannerAdSlot variant="card" />
        </View>
      </ScrollView>

      {/* Mode Selection Modal */}
      <ModeSelectionModal
        visible={isDropdownVisible}
        currentMode={mode}
        onClose={closeDropdown}
        onSelectMode={selectMode}
      />
    </View>
  );
}
