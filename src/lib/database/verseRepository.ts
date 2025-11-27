/**
 * Verse repository for data access layer.
 * Provides methods to query verses from pre-bundled SQLite database.
 */
import { getDatabase } from './connection';
import type { Verse, SearchResult } from 'lib/types';
import { normalizeLatin, stripVowels } from 'lib/quran/normalizeLatin';

/**
 * Database row structure matching our schema.
 */
interface VerseRow {
  id: number;
  number: number;
  surah_id: number;
  juz_id: number | null;
  text: string;
  transliteration: string;
  transliteration_normalized: string;
  transliteration_skeleton: string;
  translation_id: string | null;
}

/**
 * Extended row with computed score for search results.
 */
interface VerseRowWithScore extends VerseRow {
  score: number;
}

/**
 * Map database row to Verse type.
 */
const mapRowToVerse = (row: VerseRow): Verse => ({
  id: row.id,
  number: row.number,
  text: row.text,
  juz_id: row.juz_id ?? 0,
  surah_id: row.surah_id,
  verse_key: `${row.surah_id}:${row.number}`,
  transliteration: row.transliteration,
  translation_id: row.translation_id ?? '',
});

/**
 * Search verses by transliteration (lafaz mode).
 * Uses Indonesian-friendly phonetic normalization with two-tier matching:
 * 1. Exact normalized match (score: 2) - handles q→k, diacritics, double vowels
 * 2. Skeleton match (score: 1) - strips vowels for fuzzy matching
 *
 * Examples:
 * - "yaayyuhalkafirun" → finds 109:1 (exact normalized)
 * - "kaafrun" → finds 109:1 (skeleton match)
 * - "kulyaayuhalkafirun" → finds 109:1 (q→k + skeleton)
 */
export const searchByTransliteration = async (
  query: string,
  limit: number = 50,
): Promise<SearchResult[]> => {
  const db = getDatabase();
  const qNorm = normalizeLatin(query);
  const qSkel = stripVowels(qNorm);

  if (!qNorm) {
    return [];
  }

  // Two-tier search: normalized match (score 2) or skeleton match (score 1)
  // SQLite doesn't allow alias in WHERE, so we duplicate the CASE conditions
  const result = db.execute(
    `SELECT
      id, number, surah_id, juz_id,
      text, transliteration, translation_id,
      transliteration_normalized,
      transliteration_skeleton,
      CASE
        WHEN transliteration_normalized LIKE '%' || ? || '%' THEN 2
        WHEN transliteration_skeleton LIKE '%' || ? || '%' THEN 1
        ELSE 0
      END AS score
    FROM verses
    WHERE transliteration_normalized LIKE '%' || ? || '%'
       OR transliteration_skeleton LIKE '%' || ? || '%'
    ORDER BY score DESC, id ASC
    LIMIT ?`,
    [qNorm, qSkel, qNorm, qSkel, limit],
  );

  const rows = (result.rows?._array ?? []) as unknown as VerseRowWithScore[];

  return rows.map((row) => ({
    verse: mapRowToVerse(row),
    score: row.score,
  }));
};

/**
 * Search verses by meaning (makna mode).
 * Searches in Indonesian translation.
 */
export const searchByMeaning = async (
  query: string,
  limit: number = 100,
): Promise<SearchResult[]> => {
  const db = getDatabase();

  if (!query.trim()) {
    return [];
  }

  const result = db.execute(
    `SELECT * FROM verses 
     WHERE translation_id LIKE ? 
     ORDER BY id 
     LIMIT ?`,
    [`%${query.trim()}%`, limit],
  );

  const rows = (result.rows?._array ?? []) as unknown as VerseRow[];

  return rows.map((row) => ({
    verse: mapRowToVerse(row),
    score: 1,
  }));
};

/**
 * Get verse by verse key (e.g., "1:1").
 */
export const getByKey = async (verseKey: string): Promise<Verse | null> => {
  const [surahId, number] = verseKey.split(':').map(Number);
  const db = getDatabase();
  const result = db.execute(
    'SELECT * FROM verses WHERE surah_id = ? AND number = ?',
    [surahId, number],
  );
  const row = result.rows?._array[0] as unknown as VerseRow | undefined;
  return row ? mapRowToVerse(row) : null;
};

/**
 * Get verse by ID.
 */
export const getById = async (id: number): Promise<Verse | null> => {
  const db = getDatabase();
  const result = db.execute('SELECT * FROM verses WHERE id = ?', [id]);
  const row = result.rows?._array[0] as unknown as VerseRow | undefined;
  return row ? mapRowToVerse(row) : null;
};

/**
 * Get all verses for a surah.
 */
export const getBySurah = async (surahId: number): Promise<Verse[]> => {
  const db = getDatabase();
  const result = db.execute(
    'SELECT * FROM verses WHERE surah_id = ? ORDER BY number',
    [surahId],
  );
  const rows = (result.rows?._array ?? []) as unknown as VerseRow[];
  return rows.map(mapRowToVerse);
};

/**
 * Get all verses for a juz.
 */
export const getByJuz = async (juzId: number): Promise<Verse[]> => {
  const db = getDatabase();
  const result = db.execute(
    'SELECT * FROM verses WHERE juz_id = ? ORDER BY id',
    [juzId],
  );
  const rows = (result.rows?._array ?? []) as unknown as VerseRow[];
  return rows.map(mapRowToVerse);
};

/**
 * Get total verse count.
 */
export const getCount = async (): Promise<number> => {
  const db = getDatabase();
  const result = db.execute('SELECT COUNT(*) as count FROM verses');
  return (result.rows?._array[0] as { count: number })?.count ?? 0;
};
