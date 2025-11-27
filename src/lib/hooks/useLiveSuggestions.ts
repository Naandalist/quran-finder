import { useState, useEffect, useRef } from 'react';
import { SearchResult, QueryMode, SEARCH_DEBOUNCE_MS } from 'lib/types';
import { verseRepository } from 'lib/database';

interface LiveSuggestionsState {
  suggestions: SearchResult[];
  isLoading: boolean;
}

export const useLiveSuggestions = (
  query: string,
  mode: QueryMode
): LiveSuggestionsState => {
  const [suggestions, setSuggestions] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // Clear previous debounce
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Don't search for empty queries
    if (!query.trim()) {
      setSuggestions([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // Debounce the search
    debounceRef.current = setTimeout(async () => {
      try {
        const results =
          mode === 'lafaz'
            ? await verseRepository.searchByTransliteration(query, 20)
            : await verseRepository.searchByMeaning(query, 20);
        setSuggestions(results);
      } catch (error) {
        console.error('Search error:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, mode]);

  return { suggestions, isLoading };
};

export default useLiveSuggestions;
