import { useState, useEffect, useRef } from 'react';
import { SearchResult, QueryMode, SEARCH_DEBOUNCE_MS } from 'lib/types';
import { searchPhonetic } from 'lib/quran/phoneticSearch';

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
    debounceRef.current = setTimeout(() => {
      if (mode === 'lafaz') {
        const results = searchPhonetic(query);
        setSuggestions(results);
      } else {
        // TODO: Implement semantic search
        setSuggestions([]);
      }
      setIsLoading(false);
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
