import { storage } from './storage';

const BOOKMARKS_KEY = storage.keys.BOOKMARKS;

export const bookmarksStorage = {
  getAll(): string[] {
    try {
      const saved = storage.get<string[]>(BOOKMARKS_KEY);
      return saved || [];
    } catch {
      return [];
    }
  },

  add(verseKey: string): void {
    try {
      const current = this.getAll();
      if (!current.includes(verseKey)) {
        const updated = [...current, verseKey];
        storage.set(BOOKMARKS_KEY, updated);
      }
    } catch {
      console.error('Failed to add bookmark');
    }
  },

  remove(verseKey: string): void {
    try {
      const current = this.getAll();
      const updated = current.filter((key) => key !== verseKey);
      storage.set(BOOKMARKS_KEY, updated);
    } catch {
      console.error('Failed to remove bookmark');
    }
  },

  clear(): void {
    try {
      storage.remove(BOOKMARKS_KEY);
    } catch {
      console.error('Failed to clear bookmarks');
    }
  },
};

export default bookmarksStorage;
