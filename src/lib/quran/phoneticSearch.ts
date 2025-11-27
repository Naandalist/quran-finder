import { SearchResult } from 'lib/types';
import { verseRepository } from 'lib/database';

/**
 * Search verses by transliteration using the SQLite database.
 * Returns results with a basic relevance score.
 */
export const searchPhonetic = async (query: string): Promise<SearchResult[]> => {
  return verseRepository.searchByTransliteration(query);
};

export default searchPhonetic;
