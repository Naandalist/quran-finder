/**
 * Levenshtein distance implementation for fuzzy string matching.
 * Uses standard O(n*m) dynamic programming algorithm.
 */

/**
 * Compute the Levenshtein (edit) distance between two strings.
 * This is the minimum number of single-character edits (insertions,
 * deletions, or substitutions) needed to transform string `a` into `b`.
 *
 * @param a - First string
 * @param b - Second string
 * @returns The edit distance (0 = identical strings)
 */
export function levenshtein(a: string, b: string): number {
  // Early exits for edge cases
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  // Ensure a is the shorter string for space optimization
  if (a.length > b.length) {
    [a, b] = [b, a];
  }

  const aLen = a.length;
  const bLen = b.length;

  // Use two rows instead of full matrix for O(min(n,m)) space
  let prevRow = new Array<number>(aLen + 1);
  let currRow = new Array<number>(aLen + 1);

  // Initialize first row (distance from empty string to prefixes of a)
  for (let i = 0; i <= aLen; i++) {
    prevRow[i] = i;
  }

  // Fill in the matrix row by row
  for (let j = 1; j <= bLen; j++) {
    currRow[0] = j;

    for (let i = 1; i <= aLen; i++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;

      currRow[i] = Math.min(
        prevRow[i] + 1,      // deletion
        currRow[i - 1] + 1,  // insertion
        prevRow[i - 1] + cost // substitution
      );
    }

    // Swap rows
    [prevRow, currRow] = [currRow, prevRow];
  }

  return prevRow[aLen];
}

/**
 * Compute normalized similarity score from Levenshtein distance.
 * Returns a value between 0 (completely different) and 1 (identical).
 *
 * @param a - First string
 * @param b - Second string
 * @returns Similarity score in [0, 1]
 */
export function levenshteinSimilarity(a: string, b: string): number {
  if (a === b) return 1;
  if (a.length === 0 && b.length === 0) return 1;

  const maxLen = Math.max(a.length, b.length);
  if (maxLen === 0) return 1;

  const dist = levenshtein(a, b);
  return 1 - dist / maxLen;
}

export default levenshtein;
