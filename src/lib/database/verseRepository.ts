/**
 * Verse repository for data access layer.
 * Provides methods to query verses from pre-bundled SQLite database.
 */
import { getDatabase } from './connection';
import type { Verse, SearchResult } from 'lib/types';
import { normalizeLatin, stripVowels } from 'lib/quran/normalizeLatin';
import { fuzzyScoreForVerse } from 'lib/quran/fuzzyScore';

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
 * Uses Indonesian-friendly phonetic normalization with fuzzy scoring:
 * 1. Exact/substring match on normalized transliteration (high weight)
 * 2. Skeleton match for vowel-tolerant matching (medium weight)
 * 3. Levenshtein similarity for typo tolerance (low-medium weight)
 * 4. Length ratio adjustment (bonus/penalty)
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

  // Require at least 2 characters for meaningful search
  if (!qNorm || qNorm.length < 2) {
    return [];
  }

  const qSkel = stripVowels(qNorm);

  // Fetch candidate verses using SQLite LIKE on both normalized and skeleton
  // Limit to 200 candidates to keep JS scoring fast
  const result = db.execute(
    `SELECT
      id, number, surah_id, juz_id,
      text, transliteration, translation_id,
      transliteration_normalized,
      transliteration_skeleton
    FROM verses
    WHERE transliteration_normalized LIKE '%' || ? || '%'
       OR transliteration_skeleton LIKE '%' || ? || '%'
    LIMIT 200`,
    [qNorm, qSkel],
  );

  const rows = (result.rows?._array ?? []) as unknown as VerseRow[];

  // Apply fuzzy scoring to each candidate
  const scored = rows.map((row) => {
    const verseNorm = row.transliteration_normalized;
    const verseSkel = row.transliteration_skeleton;

    const score = fuzzyScoreForVerse(verseNorm, verseSkel, qNorm, qSkel);

    return {
      verse: mapRowToVerse(row),
      score,
    };
  });

  // Filter out zero/negative scores and sort by score descending
  const filtered = scored.filter((r) => r.score > 0);
  filtered.sort((a, b) => b.score - a.score);

  // Return top results
  return filtered.slice(0, limit);
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
