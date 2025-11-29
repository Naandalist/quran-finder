/**
 * Indonesian text normalization helpers for translation search.
 *
 * Handles common spelling variants and legacy Indonesian orthography
 * to improve fuzzy matching in translation search.
 */

/**
 * Normalize an Indonesian word for comparison.
 *
 * Handles:
 * - Common spelling variants (sy → s, dj → j, oe → u)
 * - Diacritics removal
 * - Punctuation stripping
 *
 * Examples:
 * - "syurga" → "surga"
 * - "djarak" → "jarak" (ejaan lama)
 * - "doea" → "dua" (ejaan lama)
 *
 * @param word - The word to normalize
 * @returns Normalized word for comparison
 */
export function normalizeIdWord(word: string): string {
  let s = word.toLowerCase().trim();

  // Simple rules to handle common spelling / legacy variants
  s = s.replace(/sy/g, 's'); // syurga -> surga
  s = s.replace(/dj/g, 'j'); // djarak -> jarak (ejaan lama)
  s = s.replace(/oe/g, 'u'); // doea -> dua (ejaan lama)
  s = s.replace(/tj/g, 'c'); // tjari -> cari (ejaan lama)
  s = s.replace(/nj/g, 'ny'); // njanji -> nyanyi (ejaan lama)
  s = s.replace(/ch/g, 'kh'); // achir -> akhir

  // Strip diacritics if any
  s = s.normalize('NFD').replace(/[\u0300-\u036f]/g, '');

  // Remove trailing punctuation
  s = s.replace(/[.,;:!?)"'«»""']+$/g, '');
  s = s.replace(/^[("«»""']+/g, '');

  return s;
}

export default normalizeIdWord;
