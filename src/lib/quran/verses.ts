/**
 * Verse data access functions.
 * All data is now retrieved from the pre-bundled SQLite database.
 */
import { Verse } from 'lib/types';
import { verseRepository } from 'lib/database';

/**
 * Get verse by key (e.g., "1:1").
 */
export const getVerseByKey = async (verseKey: string): Promise<Verse | null> => {
  return verseRepository.getByKey(verseKey);
};

/**
 * Get all verses for a surah.
 */
export const getVersesBySurah = async (surahId: number): Promise<Verse[]> => {
  return verseRepository.getBySurah(surahId);
};

/**
 * Get verse by ID.
 */
export const getVerseById = async (id: number): Promise<Verse | null> => {
  return verseRepository.getById(id);
};

/**
 * Get total verse count.
 */
export const getVerseCount = async (): Promise<number> => {
  return verseRepository.getCount();
};
