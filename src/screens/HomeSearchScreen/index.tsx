import React from 'react';
import { View, ScrollView } from 'react-native';

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
    <>
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section */}
        <View style={styles.heroSection}>
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
      </ScrollView>

      {/* Mode Selection Modal */}
      <ModeSelectionModal
        visible={isDropdownVisible}
        currentMode={mode}
        onClose={closeDropdown}
        onSelectMode={selectMode}
      />
    </>
  );
}
