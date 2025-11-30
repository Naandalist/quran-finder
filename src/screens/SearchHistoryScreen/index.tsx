import React from 'react';
import { View } from 'react-native';

import { styles } from './styles';
import { useSearchHistory } from './hooks';
import { Header, HistoryList } from './components';

export default function SearchHistoryScreen() {
  const {
    recentSearches,
    handleSelectItem,
    handleDeleteItem,
    handleClearAll,
    goBack,
  } = useSearchHistory();

  return (
    <View style={styles.container}>
      <Header
        onBackPress={goBack}
        showClearAll={recentSearches.length > 0}
        onClearAll={handleClearAll}
      />

      <HistoryList
        data={recentSearches}
        onSelectItem={handleSelectItem}
        onDeleteItem={handleDeleteItem}
      />
    </View>
  );
}
