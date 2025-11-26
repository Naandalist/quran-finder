/**
 * Normalize Latin text for phonetic search.
 * - Lowercase
 * - Remove diacritics/accents
 * - Remove spaces and punctuation
 */
export const normalizeLatin = (text: string): string => {
  return text
    .toLowerCase()
    // Remove diacritics
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    // Remove common punctuation and spaces
    .replace(/[^\w]/g, '')
    // Remove underscores
    .replace(/_/g, '');
};

export default normalizeLatin;
