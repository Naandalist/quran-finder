import { SearchResult, Verse } from 'lib/types';

/**
 * Stub: Generate embeddings for verse translations.
 * This will be implemented with a proper embedding model later.
 */
export const embedTranslations = async (_verses: Verse[]): Promise<number[][]> => {
  // Placeholder implementation
  console.warn('embedTranslations: Not implemented yet');
  return [];
};

/**
 * Stub: Search verses by semantic similarity to the query.
 * This will be implemented with vector search later.
 */
export const searchSemantic = async (_query: string): Promise<SearchResult[]> => {
  // Placeholder implementation
  console.warn('searchSemantic: Not implemented yet');
  return [];
};

export default searchSemantic;
