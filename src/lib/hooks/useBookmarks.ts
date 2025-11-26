import { useState, useEffect, useCallback } from 'react';
import { bookmarksStorage } from 'lib/storage/bookmarksStorage';

interface UseBookmarksReturn {
  bookmarks: string[];
  isLoading: boolean;
  addBookmark: (verseKey: string) => void;
  removeBookmark: (verseKey: string) => void;
  isBookmarked: (verseKey: string) => boolean;
  toggleBookmark: (verseKey: string) => void;
}

export const useBookmarks = (): UseBookmarksReturn => {
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadBookmarks();
  }, []);

  const loadBookmarks = () => {
    setIsLoading(true);
    const saved = bookmarksStorage.getAll();
    setBookmarks(saved);
    setIsLoading(false);
  };

  const addBookmark = useCallback((verseKey: string) => {
    bookmarksStorage.add(verseKey);
    setBookmarks((prev) => [...prev, verseKey]);
  }, []);

  const removeBookmark = useCallback((verseKey: string) => {
    bookmarksStorage.remove(verseKey);
    setBookmarks((prev) => prev.filter((key) => key !== verseKey));
  }, []);

  const isBookmarked = useCallback(
    (verseKey: string) => bookmarks.includes(verseKey),
    [bookmarks]
  );

  const toggleBookmark = useCallback(
    (verseKey: string) => {
      if (isBookmarked(verseKey)) {
        removeBookmark(verseKey);
      } else {
        addBookmark(verseKey);
      }
    },
    [isBookmarked, addBookmark, removeBookmark]
  );

  return {
    bookmarks,
    isLoading,
    addBookmark,
    removeBookmark,
    isBookmarked,
    toggleBookmark,
  };
};

export default useBookmarks;
