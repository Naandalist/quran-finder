/**
 * Fuzzy scoring function for Quran transliteration search.
 * Combines multiple signals (exact match, substring, skeleton, Levenshtein)
 * to produce a relevance score for each verse candidate.
 */

import { levenshtein } from './levenshtein';

/**
 * Compute a fuzzy relevance score for a verse against a query.
 *
 * Scoring rules:
 * 1. Exact/substring match on normalized transliteration (high weight)
 * 2. Skeleton match for vowel-tolerant matching (medium weight)
 * 3. Levenshtein similarity for typo tolerance (low-medium weight)
 * 4. Length ratio adjustment (bonus/penalty)
 *
 * @param verseNorm - Normalized transliteration of the verse
 * @param verseSkel - Skeleton (consonants only) of the verse, may be undefined
 * @param qNorm - Normalized query string
 * @param qSkel - Skeleton of the query string
 * @returns Relevance score (higher = better match)
 */
export function fuzzyScoreForVerse(
  verseNorm: string,
  verseSkel: string | undefined,
  qNorm: string,
  qSkel: string,
): number {
  let score = 0;

  // ===========================================
  // 1. Exact / substring match on normalized
  // ===========================================
  if (verseNorm === qNorm) {
    // Perfect exact match (rare but possible for short queries)
    score += 50;
  } else if (verseNorm.includes(qNorm)) {
    // Query appears as substring in verse
    score += 35;

    // Bonus for query appearing at the start (more relevant)
    if (verseNorm.startsWith(qNorm)) {
      score += 5;
    }
  } else if (qNorm.includes(verseNorm)) {
    // Verse is contained within query (less common)
    score += 20;
  }

  // ===========================================
  // 2. Skeleton match (vowel-agnostic)
  // ===========================================
  if (verseSkel && qSkel) {
    if (verseSkel === qSkel) {
      // Exact skeleton match
      score += 25;
    } else if (verseSkel.includes(qSkel)) {
      // Query skeleton appears in verse skeleton
      score += 15;

      // Bonus for skeleton appearing at start
      if (verseSkel.startsWith(qSkel)) {
        score += 3;
      }
    } else if (qSkel.includes(verseSkel)) {
      // Verse skeleton is contained within query skeleton
      score += 10;
    }
  }

  // ===========================================
  // 3. Levenshtein similarity
  // ===========================================
  // For performance, only compute if strings aren't too different in length
  const lenDiffRatio = Math.abs(verseNorm.length - qNorm.length) / Math.max(qNorm.length, 1);

  if (lenDiffRatio < 3) {
    // Only compute Levenshtein for reasonably similar-length strings
    const dist = levenshtein(verseNorm, qNorm);
    const maxLen = Math.max(qNorm.length, verseNorm.length, 1);
    const sim = Math.max(0, 1 - dist / maxLen);

    if (sim > 0) {
      score += sim * 20;
    }
  }

  // ===========================================
  // 4. Length ratio adjustment
  // ===========================================
  if (qNorm.length > 0) {
    const lenRatio = verseNorm.length / qNorm.length;
    const lenDiff = Math.abs(1 - lenRatio);

    if (lenDiff < 0.5) {
      // Similar lengths: bonus
      score += (1 - lenDiff) * 10;
    } else if (lenDiff > 2) {
      // Very different lengths: penalty
      score -= 5;
    }
  }

  return score;
}

/**
 * Quick check if a verse is a potential match worth scoring.
 * Used as a pre-filter before expensive scoring.
 *
 * @param verseNorm - Normalized transliteration of the verse
 * @param verseSkel - Skeleton of the verse
 * @param qNorm - Normalized query
 * @param qSkel - Skeleton of the query
 * @returns true if the verse should be scored
 */
export function isPotentialMatch(
  verseNorm: string,
  verseSkel: string | undefined,
  qNorm: string,
  qSkel: string,
): boolean {
  // Check normalized match
  if (verseNorm.includes(qNorm) || qNorm.includes(verseNorm)) {
    return true;
  }

  // Check skeleton match
  if (verseSkel && qSkel) {
    if (verseSkel.includes(qSkel) || qSkel.includes(verseSkel)) {
      return true;
    }
  }

  return false;
}

export default fuzzyScoreForVerse;
