/**
 * Fuzzy-ranked search for Quran verses by transliteration (lafaz).
 *
 * Uses SQLite LIKE to fetch candidate verses, then applies
 * fuzzy scoring in TypeScript for accurate ranking.
 */

import { getDatabase } from '../database/connection';
import { normalizeLatin, stripVowels } from './normalizeLatin';
import { fuzzyScoreForVerse } from './fuzzyScore';
import type { Verse, SearchResult } from '../types';

/**
 * Database row structure for verse query results.
 */
export interface VerseRow {
  id: number;
  number: number | null;
  surah_id: number;
  juz_id: number | null;
  text: string;
  transliteration: string;
  translation_id: string | null;
  transliteration_normalized: string;
  transliteration_skeleton: string;
}

/**
 * Ranked search result with verse and computed score.
 */
export interface RankedResult {
  verse: Verse;
  score: number;
}

/**
 * Map database row to Verse type.
 */
const mapRowToVerse = (row: VerseRow): Verse => ({
  id: row.id,
  number: row.number ?? 0,
  text: row.text,
  juz_id: row.juz_id ?? 0,
  surah_id: row.surah_id,
  verse_key: `${row.surah_id}:${row.number}`,
  transliteration: row.transliteration,
  translation_id: row.translation_id ?? '',
});

/**
 * Search verses by transliteration with fuzzy scoring.
 *
 * This function:
 * 1. Normalizes the raw query using Indonesian phonetic rules
 * 2. Fetches candidate verses from SQLite using LIKE on normalized + skeleton
 * 3. Applies fuzzy scoring to rank candidates
 * 4. Returns top results sorted by score
 *
 * Examples:
 * - "yaayyuhalkafirun" → finds 109:1 with high score
 * - "kaafrun" → finds verses with "kafirun" via skeleton
 * - "kulyaayuhalkafirun" → finds 109:1 via q→k mapping + skeleton
 *
 * @param queryRaw - Raw user query string
 * @param maxResults - Maximum number of results to return (default 50)
 * @returns Array of ranked search results
 */
export function searchByLafazRanked(
  queryRaw: string,
  maxResults: number = 50,
): RankedResult[] {
  const qNorm = normalizeLatin(queryRaw);

  // Require at least 2 characters for meaningful search
  if (!qNorm || qNorm.length < 2) {
    return [];
  }

  const qSkel = stripVowels(qNorm);
  const db = getDatabase();

  // Fetch candidate verses using SQLite LIKE
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
  return filtered.slice(0, maxResults);
}

/**
 * Async wrapper for searchByLafazRanked for consistency with other repository methods.
 *
 * @param query - Raw user query string
 * @param limit - Maximum number of results
 * @returns Promise resolving to array of SearchResult
 */
export async function searchByTransliterationRanked(
  query: string,
  limit: number = 50,
): Promise<SearchResult[]> {
  const results = searchByLafazRanked(query, limit);

  return results.map((r) => ({
    verse: r.verse,
    score: r.score,
  }));
}

export default searchByLafazRanked;
