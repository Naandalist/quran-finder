/**
 * Ranked search for Quran verses by Indonesian translation (terjemahan).
 *
 * Two-stage search:
 * 1. Primary: keyword-based using SQL LIKE
 * 2. Fallback: fuzzy token-level search using Levenshtein distance
 */

import { getDatabase } from '../database/connection';
import { levenshtein } from './levenshtein';
import { normalizeIdWord } from './normalizeId';
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
  /** The actual word from translation to highlight (for fuzzy matches) */
  highlightToken?: string;
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
 * Calculate keyword-based score for translation matches.
 *
 * Scoring rules:
 * - Each token match: +10
 * - Full query substring match: +20
 * - Length bonus (shorter translations score higher): 0-5
 *
 * @param translation - The verse's translation text (lowercase)
 * @param query - The search query (lowercase)
 * @param tokens - Query tokens (words >= 3 chars)
 * @returns Score (higher is better)
 */
function calculateKeywordScore(
  translation: string,
  query: string,
  tokens: string[],
): number {
  let score = 0;

  // Token matches: +10 per token found
  for (const token of tokens) {
    if (translation.includes(token)) {
      score += 10;
    }
  }

  // Full query substring match: +20
  if (translation.includes(query)) {
    score += 20;
  }

  // Length bonus: shorter translations get slightly higher score
  const len = translation.length;
  const lenPenalty = Math.min(len / 200, 1); // 0..1
  score += (1 - lenPenalty) * 5;

  return score;
}

/**
 * Calculate fuzzy score based on Levenshtein distance.
 *
 * @param bestDist - Best (minimum) Levenshtein distance found
 * @param translationLength - Length of translation text
 * @returns Score (higher is better)
 */
function calculateFuzzyScore(bestDist: number, translationLength: number): number {
  let score = 0;

  // Base score from distance
  if (bestDist === 0) {
    score += 80;
  } else if (bestDist === 1) {
    score += 60;
  }

  // Length bonus: shorter translations get slightly higher score
  const lenPenalty = Math.min(translationLength / 200, 1);
  score += (1 - lenPenalty) * 5;

  return score;
}

/**
 * Find the actual word in translation that best matches the query.
 * Used to determine what to highlight in the UI.
 *
 * @param translation - The verse's translation text
 * @param queryRaw - The raw user query
 * @returns The original word from translation to highlight, or undefined
 */
function findHighlightToken(
  translation: string,
  queryRaw: string,
): string | undefined {
  const qNorm = normalizeIdWord(queryRaw);
  if (!qNorm || qNorm.length < 3) {
    return undefined;
  }

  const words = translation.split(/\s+/);

  for (const w of words) {
    const wNorm = normalizeIdWord(w);
    if (!wNorm) {
      continue;
    }

    // If normalized forms overlap, consider it a match
    if (wNorm.includes(qNorm) || qNorm.includes(wNorm)) {
      // Return the ORIGINAL word as it appears in translation, e.g. "surga"
      // Strip punctuation for cleaner highlighting
      return w.replace(/^[("«»""']+/, '').replace(/[.,;:!?)"'«»""']+$/, '');
    }
  }

  return undefined;
}

/**
 * Primary search: keyword-based using SQL LIKE.
 *
 * @param query - Normalized search query
 * @param queryRaw - Original raw query for highlight token computation
 * @returns Array of ranked results, or empty if no matches
 */
function primaryKeywordSearch(
  query: string,
  queryRaw: string,
): TranslationRankedResult[] {
  const db = getDatabase();

  // Query using LIKE on lowercase translation_id
  const sql = `
    SELECT id, number, surah_id, juz_id,
           text, transliteration, translation_id
    FROM verses
    WHERE lower(translation_id) LIKE '%' || ? || '%'
    LIMIT 300
  `;

  const result = db.execute(sql, [query]);
  const rows = (result.rows?._array ?? []) as unknown as VerseRow[];

  if (rows.length === 0) {
    return [];
  }

  // Split query into tokens (words >= 3 chars)
  const tokens = query.split(/\s+/).filter((t) => t.length >= 3);

  // Score each row
  const scored: TranslationRankedResult[] = [];

  for (const row of rows) {
    const translation = row.translation_id ?? '';
    const translationLower = translation.toLowerCase();
    const score = calculateKeywordScore(translationLower, query, tokens);

    if (score > 0) {
      // Find the actual word to highlight
      const highlightToken = findHighlightToken(translation, queryRaw);

      scored.push({
        verse: mapRowToVerse(row),
        score,
        highlightToken,
      });
    }
  }

  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);

  // Return top 50
  return scored.slice(0, 50);
}

/**
 * Fallback search: fuzzy token-level using Levenshtein distance.
 * Scans all verses and finds matches with edit distance <= 1.
 *
 * @param query - Normalized search query
 * @param queryRaw - Original raw query for highlight token computation
 * @returns Array of ranked results
 */
function fallbackFuzzySearch(
  query: string,
  queryRaw: string,
): TranslationRankedResult[] {
  const db = getDatabase();

  // Load all verses for fuzzy matching
  const sql = `
    SELECT id, number, surah_id, juz_id,
           text, transliteration, translation_id
    FROM verses
  `;

  const result = db.execute(sql);
  const rows = (result.rows?._array ?? []) as unknown as VerseRow[];

  const candidates: TranslationRankedResult[] = [];

  for (const row of rows) {
    const translation = row.translation_id ?? '';
    const translationLower = translation.toLowerCase();

    // Split translation into words
    const words = translationLower.split(/\W+/).filter(Boolean);

    // Find minimum Levenshtein distance across all words
    let bestDist = Infinity;

    for (const word of words) {
      const dist = levenshtein(word, query);
      if (dist < bestDist) {
        bestDist = dist;
      }

      // Early exit if exact match found
      if (bestDist === 0) {
        break;
      }
    }

    // Only include if distance <= 1 (tolerate small typos)
    if (bestDist <= 1) {
      const score = calculateFuzzyScore(bestDist, translationLower.length);

      // Find the actual word to highlight
      const highlightToken = findHighlightToken(translation, queryRaw);

      candidates.push({
        verse: mapRowToVerse(row),
        score,
        highlightToken,
      });
    }
  }

  // Sort by score descending
  candidates.sort((a, b) => b.score - a.score);

  // Return top 50
  return candidates.slice(0, 50);
}

/**
 * Search verses by Indonesian translation with ranking.
 *
 * Two-stage search:
 * 1. Primary: keyword-based using SQL LIKE - fast and handles exact/substring matches
 * 2. Fallback: fuzzy token-level search - handles typos like "syurga" vs "surga"
 *
 * @param queryRaw - Raw user query string
 * @param maxResults - Maximum number of results to return (default 50)
 * @returns Array of ranked search results
 */
export function searchByTranslationRanked(
  queryRaw: string,
  maxResults: number = 50,
): TranslationRankedResult[] {
  // Normalize query
  const query = queryRaw.trim().toLowerCase();

  // Require at least 2 characters for meaningful search
  if (!query || query.length < 2) {
    return [];
  }

  // Stage 1: Primary keyword search using LIKE
  const primaryResults = primaryKeywordSearch(query, queryRaw);

  if (primaryResults.length > 0) {
    return primaryResults.slice(0, maxResults);
  }

  // Stage 2: Fallback fuzzy search when LIKE gives 0 results
  const fuzzyResults = fallbackFuzzySearch(query, queryRaw);

  return fuzzyResults.slice(0, maxResults);
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
