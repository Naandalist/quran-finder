/**
 * Shared normalization module for phonetic search.
 *
 * Indonesian-friendly phonetic normalization for Quran transliteration search.
 */

/**
 * Normalize Latin text for phonetic search.
 * - Lowercase
 * - Remove diacritics/accents
 * - Apply Indonesian phonetic mappings (q→k, sy→sh, dz→z, ts→s)
 * - Compress double vowels (aa→a, ii→i, uu→u)
 * - Remove non-alphanumeric characters
 */
export const normalizeLatin = (text: string): string => {
  let s = text.toLowerCase();

  // Decompose + remove diacritics (á → a, etc.)
  s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // Indonesian-first phonetic mappings:
  // - sy -> sh (syukur ≈ shukr)
  // - dz -> z  (dzikir ≈ zikr)
  // - ts -> s  (tsabit ≈ sabit)
  // - q -> k   (qul ≈ kul)
  s = s.replace(/sy/g, 'sh');
  s = s.replace(/dz/g, 'z');
  s = s.replace(/ts/g, 's');
  s = s.replace(/q/g, 'k');

  // Remove all non-alphanumeric characters
  s = s.replace(/[^a-z0-9]/g, '');

  // Compress double vowels (kaafir → kafir, etc.)
  s = s.replace(/aa/g, 'a').replace(/ii/g, 'i').replace(/uu/g, 'u');

  return s;
};

/**
 * Strip all vowels from a string to create a consonant skeleton.
 * Used for fuzzy matching when vowels differ (kafirun vs kafrun).
 */
export const stripVowels = (s: string): string => {
  return s.replace(/[aeiou]/g, '');
};

export default normalizeLatin;
