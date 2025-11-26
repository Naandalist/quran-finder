import { useState, useCallback } from 'react';
import { QueryMode } from 'lib/types';

interface SearchQueryState {
  text: string;
  mode: QueryMode;
  setText: (text: string) => void;
  setMode: (mode: QueryMode) => void;
  clear: () => void;
}

export const useSearchQuery = (
  initialText: string = '',
  initialMode: QueryMode = 'lafaz'
): SearchQueryState => {
  const [text, setText] = useState(initialText);
  const [mode, setMode] = useState<QueryMode>(initialMode);

  const clear = useCallback(() => {
    setText('');
  }, []);

  return {
    text,
    mode,
    setText,
    setMode,
    clear,
  };
};

export default useSearchQuery;
