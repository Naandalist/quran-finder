import { SearchResult, Verse } from 'lib/types';
import { loadVerses } from './verses';
import { normalizeLatin } from './normalizeLatin';

export interface PhoneticIndex {
  normalized: string;
  verse: Verse;
}

/**
 * Build a phonetic index from verses for faster searching.
 */
export const buildIndex = (verses: Verse[]): PhoneticIndex[] => {
  return verses.map(verse => ({
    normalized: normalizeLatin(verse.transliteration),
    verse,
  }));
};

/**
 * Search verses by transliteration using simple substring matching.
 * Returns results with a basic relevance score.
 */
export const searchPhonetic = (query: string): SearchResult[] => {
  const verses = loadVerses();
  const normalizedQuery = normalizeLatin(query);

  if (!normalizedQuery) {
    return [];
  }

  const results: SearchResult[] = [];

  for (const verse of verses) {
    const normalizedTranslit = normalizeLatin(verse.transliteration);

    if (normalizedTranslit.includes(normalizedQuery)) {
      // Simple scoring: higher score for closer match length
      const score = normalizedQuery.length / normalizedTranslit.length;
      results.push({ verse, score });
    }
  }

  // Sort by score descending
  return results.sort((a, b) => b.score - a.score);
};

export default searchPhonetic;
