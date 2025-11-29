/**
 * Ranked search for Quran verses by Indonesian translation (terjemahan).
 *
 * Uses SQLite FTS5 or LIKE to fetch candidate verses, then applies
 * scoring in TypeScript for ranking.
 */

import { getDatabase } from '../database/connection';
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
}

/**
 * Ranked search result with verse and computed score.
 */
export interface TranslationRankedResult {
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
 * Normalize Indonesian text for searching.
 * - Converts to lowercase
 * - Removes extra whitespace
 */
function normalizeIndonesian(text: string): string {
  return text.toLowerCase().trim().replace(/\s+/g, ' ');
}

/**
 * Calculate a simple relevance score for translation matches.
 *
 * Scoring factors:
 * - Exact phrase match: highest score
 * - All words present: medium score
 * - Partial word matches: lower score
 * - Word order matters
 *
 * @param translation - The verse's translation text
 * @param query - The search query
 * @returns Score between 0-100
 */
function calculateTranslationScore(translation: string, query: string): number {
  const normTranslation = normalizeIndonesian(translation);
  const normQuery = normalizeIndonesian(query);

  if (!normQuery || !normTranslation) {
    return 0;
  }

  let score = 0;

  // Exact phrase match bonus (highest priority)
  if (normTranslation.includes(normQuery)) {
    score += 60;

    // Additional bonus if it's at the start
    if (normTranslation.startsWith(normQuery)) {
      score += 20;
    }

    // Bonus for shorter translations (more focused match)
    const lengthRatio = normQuery.length / normTranslation.length;
    score += lengthRatio * 20;
  } else {
    // Check for individual word matches
    const queryWords = normQuery.split(/\s+/).filter((w) => w.length > 1);
    const translationWords = normTranslation.split(/\s+/);

    if (queryWords.length === 0) {
      return 0;
    }

    let matchedWords = 0;
    let consecutiveMatches = 0;
    let maxConsecutive = 0;
    let lastMatchIndex = -2;

    for (const qWord of queryWords) {
      const matchIndex = translationWords.findIndex(
        (tWord) => tWord.includes(qWord) || qWord.includes(tWord),
      );

      if (matchIndex !== -1) {
        matchedWords++;

        // Track consecutive matches
        if (matchIndex === lastMatchIndex + 1) {
          consecutiveMatches++;
          maxConsecutive = Math.max(maxConsecutive, consecutiveMatches);
        } else {
          consecutiveMatches = 1;
        }
        lastMatchIndex = matchIndex;
      }
    }

    // Score based on matched word ratio
    const wordMatchRatio = matchedWords / queryWords.length;
    score += wordMatchRatio * 50;

    // Bonus for consecutive word matches (phrase-like)
    score += (maxConsecutive / queryWords.length) * 30;
  }

  return Math.min(100, Math.max(0, score));
}

/**
 * Search verses by Indonesian translation with ranking.
 *
 * This function:
 * 1. Fetches candidate verses from SQLite using LIKE on translation_id
 * 2. Applies scoring to rank candidates
 * 3. Returns top results sorted by score
 *
 * @param queryRaw - Raw user query string
 * @param maxResults - Maximum number of results to return (default 50)
 * @returns Array of ranked search results
 */
export function searchByTranslationRanked(
  queryRaw: string,
  maxResults: number = 50,
): TranslationRankedResult[] {
  const query = normalizeIndonesian(queryRaw);

  // Require at least 2 characters for meaningful search
  if (!query || query.length < 2) {
    return [];
  }

  const db = getDatabase();

  // Split query into words for more flexible matching
  const words = query.split(/\s+/).filter((w) => w.length > 1);

  // Build WHERE clause for word matching
  // Match verses containing any of the query words
  const likeConditions = words.map(() => "translation_id LIKE '%' || ? || '%'").join(' OR ');
  const params = words.length > 0 ? words : [query];

  const sql = `
    SELECT
      id, number, surah_id, juz_id,
      text, transliteration, translation_id
    FROM verses
    WHERE ${likeConditions || "translation_id LIKE '%' || ? || '%'"}
    LIMIT 300
  `;

  const result = db.execute(sql, params);
  const rows = (result.rows?._array ?? []) as unknown as VerseRow[];

  // Apply scoring to each candidate
  const scored = rows.map((row) => {
    const translation = row.translation_id ?? '';
    const score = calculateTranslationScore(translation, query);

    return {
      verse: mapRowToVerse(row),
      score,
    };
  });

  // Filter out zero/low scores and sort by score descending
  const filtered = scored.filter((r) => r.score > 10);
  filtered.sort((a, b) => b.score - a.score);

  // Return top results
  return filtered.slice(0, maxResults);
}

/**
 * Async wrapper for searchByTranslationRanked for consistency with other repository methods.
 *
 * @param query - Raw user query string
 * @param limit - Maximum number of results
 * @returns Promise resolving to array of SearchResult
 */
export async function searchByTranslationAsync(
  query: string,
  limit: number = 50,
): Promise<SearchResult[]> {
  const results = searchByTranslationRanked(query, limit);

  return results.map((r) => ({
    verse: r.verse,
    score: r.score,
  }));
}

export default searchByTranslationRanked;
