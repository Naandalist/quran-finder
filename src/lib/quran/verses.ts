import { Verse, VerseRaw } from 'lib/types';
import versesData from './verses.json';

// Transform raw verses to include computed verse_key
const transformVerses = (raw: VerseRaw[]): Verse[] => {
  return raw.map(v => ({
    ...v,
    verse_key: `${v.surah_id}:${v.number}`,
  }));
};

let cachedVerses: Verse[] | null = null;

export const loadVerses = (): Verse[] => {
  if (!cachedVerses) {
    cachedVerses = transformVerses(versesData as VerseRaw[]);
  }
  return cachedVerses;
};

export const getVerseByKey = (verseKey: string): Verse | undefined => {
  return loadVerses().find(v => v.verse_key === verseKey);
};

export const getVersesBySurah = (surahId: number): Verse[] => {
  return loadVerses().filter(v => v.surah_id === surahId);
};

export const getVerseById = (id: number): Verse | undefined => {
  return loadVerses().find(v => v.id === id);
};

export const getAllVerses = loadVerses;
