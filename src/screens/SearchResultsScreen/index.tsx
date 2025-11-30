import React from 'react';
import { View } from 'react-native';

import { styles } from './styles';
import { FloatingAudioPlayer } from './components/FloatingAudioPlayer';
import { useSearchResults } from './hooks';
import {
  Header,
  QueryHeader,
  SearchResultsList,
  LoadingState,
  ErrorState,
} from './components';

export default function SearchResultsScreen() {
  const {
    query,
    mode,
    results,
    isLoading,
    error,
    currentVerse,
    modeLabel,
    handleVersePress,
    handleClosePlayer,
    goBack,
  } = useSearchResults();

  if (isLoading) {
    return (
      <View style={styles.screenContainer}>
        <Header onBackPress={goBack} />
        <LoadingState />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.screenContainer}>
        <Header onBackPress={goBack} />
        <ErrorState error={error} />
      </View>
    );
  }

  return (
    <View style={styles.screenContainer}>
      <Header onBackPress={goBack} />

      <QueryHeader
        query={query}
        resultsCount={results.length}
        modeLabel={modeLabel}
      />

      <SearchResultsList
        results={results}
        query={query}
        mode={mode}
        hasPlayer={!!currentVerse}
        onVersePress={handleVersePress}
      />

      <FloatingAudioPlayer verse={currentVerse} onClose={handleClosePlayer} />
    </View>
  );
}
