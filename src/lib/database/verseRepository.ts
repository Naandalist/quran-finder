/**
 * Verse repository for data access layer.
 * Provides methods to query verses from SQLite database.
 */
import { getDatabase } from './connection';
import type { Verse, TajweedMark, SearchResult } from 'lib/types';
import { normalizeLatin } from 'lib/quran/normalizeLatin';

interface VerseRow {
  [key: string]: string | number | undefined;
  id: number;
  number: number;
  text: string;
  juz_id: number;
  surah_id: number;
  verse_key: string;
  transliteration: string;
  transliteration_normalized: string;
  translation_id: string;
  translation_en: string;
  translation_my: string;
  translation_de: string;
  translation_tr: string;
  translation_fr: string;
}

interface TajweedMarkRow {
  [key: string]: string | number | undefined;
  id: number;
  verse_id: number;
  class: string;
  start_baris: number;
  end_baris: number;
  start_pojok: number;
  end_pojok: number;
}

/**
 * Map database row to Verse type.
 */
const mapRowToVerse = (row: VerseRow): Verse => ({
  id: row.id,
  number: row.number,
  text: row.text,
  juz_id: row.juz_id,
  surah_id: row.surah_id,
  verse_key: row.verse_key,
  transliteration: row.transliteration,
  translation_id: row.translation_id,
  translation_en: row.translation_en,
  translation_my: row.translation_my,
  translation_de: row.translation_de,
  translation_tr: row.translation_tr,
  translation_fr: row.translation_fr,
});

/**
 * Escape special characters in FTS5 query.
 * FTS5 uses special characters: " ' * - + ( ) : ^
 * We escape them by wrapping the query in double quotes for phrase matching.
 */
const escapeFts5Query = (query: string): string => {
  // Remove any existing quotes and escape special characters
  // by treating the entire query as a phrase (wrap in double quotes)
  // and escape any internal double quotes
  const escaped = query.replace(/"/g, '""');
  return `"${escaped}"`;
};

/**
 * Search verses by transliteration (lafaz mode).
 * Uses FTS5 for prefix matching.
 */
export const searchByTransliteration = async (
  query: string,
  limit: number = 100,
): Promise<SearchResult[]> => {
  const db = getDatabase();
  const normalizedQuery = normalizeLatin(query);

  if (!normalizedQuery) {
    return [];
  }

  // Use FTS5 with escaped query and prefix matching
  const escapedQuery = escapeFts5Query(normalizedQuery);
  const ftsQuery = `${escapedQuery}*`;
  const result = await db.executeAsync<VerseRow>(
    `SELECT v.* FROM verses v
     JOIN verses_fts fts ON v.id = fts.rowid
     WHERE verses_fts MATCH ?
     ORDER BY rank
     LIMIT ?`,
    [ftsQuery, limit],
  );

  const rows = result.rows?._array ?? [];

  // Calculate score based on query match
  return rows.map((row) => {
    const normalizedTranslit = row.transliteration_normalized;
    const score = normalizedQuery.length / normalizedTranslit.length;
    return {
      verse: mapRowToVerse(row),
      score,
    };
  });
};

/**
 * Search verses by meaning (makna mode).
 * Uses FTS5 to search across translations.
 */
export const searchByMeaning = async (
  query: string,
  limit: number = 100,
): Promise<SearchResult[]> => {
  const db = getDatabase();

  if (!query.trim()) {
    return [];
  }

  // Use FTS5 with escaped query and prefix matching across translation columns
  const escapedQuery = escapeFts5Query(query.trim());
  const ftsQuery = `${escapedQuery}*`;
  const result = await db.executeAsync<VerseRow>(
    `SELECT v.* FROM verses v
     JOIN verses_fts fts ON v.id = fts.rowid
     WHERE verses_fts MATCH ?
     ORDER BY rank
     LIMIT ?`,
    [ftsQuery, limit],
  );

  const rows = result.rows?._array ?? [];

  return rows.map((row) => ({
    verse: mapRowToVerse(row),
    score: 1, // FTS already ranks results
  }));
};

/**
 * Get verse by verse key (e.g., "1:1").
 */
export const getByKey = async (verseKey: string): Promise<Verse | null> => {
  const db = getDatabase();
  const result = await db.executeAsync<VerseRow>(
    'SELECT * FROM verses WHERE verse_key = ?',
    [verseKey],
  );
  const row = result.rows?._array[0];
  return row ? mapRowToVerse(row) : null;
};

/**
 * Get verse by ID.
 */
export const getById = async (id: number): Promise<Verse | null> => {
  const db = getDatabase();
  const result = await db.executeAsync<VerseRow>(
    'SELECT * FROM verses WHERE id = ?',
    [id],
  );
  const row = result.rows?._array[0];
  return row ? mapRowToVerse(row) : null;
};

/**
 * Get all verses for a surah.
 */
export const getBySurah = async (surahId: number): Promise<Verse[]> => {
  const db = getDatabase();
  const result = await db.executeAsync<VerseRow>(
    'SELECT * FROM verses WHERE surah_id = ? ORDER BY number',
    [surahId],
  );
  const rows = result.rows?._array ?? [];
  return rows.map(mapRowToVerse);
};

/**
 * Get all verses for a juz.
 */
export const getByJuz = async (juzId: number): Promise<Verse[]> => {
  const db = getDatabase();
  const result = await db.executeAsync<VerseRow>(
    'SELECT * FROM verses WHERE juz_id = ? ORDER BY id',
    [juzId],
  );
  const rows = result.rows?._array ?? [];
  return rows.map(mapRowToVerse);
};

/**
 * Get tajweed marks for a verse.
 */
export const getTajweedMarks = async (
  verseId: number,
): Promise<TajweedMark[]> => {
  const db = getDatabase();
  const result = await db.executeAsync<TajweedMarkRow>(
    'SELECT * FROM tajweed_marks WHERE verse_id = ?',
    [verseId],
  );
  const rows = result.rows?._array ?? [];
  return rows.map((row) => ({
    class: row.class,
    start_baris: row.start_baris,
    end_baris: row.end_baris,
    start_pojok: row.start_pojok,
    end_pojok: row.end_pojok,
  }));
};

/**
 * Get total verse count.
 */
export const getCount = async (): Promise<number> => {
  const db = getDatabase();
  const result = await db.executeAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM verses',
  );
  return result.rows?._array[0]?.count ?? 0;
};
