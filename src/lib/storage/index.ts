import { createMMKV } from 'react-native-mmkv';

export const mmkv = createMMKV();

const STORAGE_KEYS = {
  BOOKMARKS: 'quran_finder.bookmarks',
  RECENT_QUERIES: 'quran_finder.recent_queries',
  SETTINGS: 'quran_finder.settings',
};

export const storage = {
  get<T>(key: string): T | null {
    try {
      const value = mmkv.getString(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Storage get error:', error);
      return null;
    }
  },

  set<T>(key: string, value: T): void {
    try {
      mmkv.set(key, JSON.stringify(value));
    } catch (error) {
      console.error('Storage set error:', error);
    }
  },

  remove(key: string): void {
    try {
      mmkv.remove(key);
    } catch (error) {
      console.error('Storage remove error:', error);
    }
  },

  keys: STORAGE_KEYS,
};

export default storage;
