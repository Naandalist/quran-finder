/**
 * Database seeder for one-time migration from verses.json to SQLite.
 */
import { getDatabase } from './connection';
import { normalizeLatin } from 'lib/quran/normalizeLatin';
import type { VerseRaw } from 'lib/types';

const BATCH_SIZE = 100;

export type ProgressCallback = (progress: number, total: number) => void;

/**
 * Seed database with verse data from JSON.
 * Uses batch inserts for memory efficiency.
 */
export const seedDatabase = async (
  versesData: VerseRaw[],
  onProgress?: ProgressCallback,
): Promise<void> => {
  const db = await getDatabase();
  const total = versesData.length;

  // Process in batches
  for (let i = 0; i < total; i += BATCH_SIZE) {
    const batch = versesData.slice(i, Math.min(i + BATCH_SIZE, total));

    await db.withTransactionAsync(async () => {
      for (const verse of batch) {
        const verseKey = `${verse.surah_id}:${verse.number}`;
        const normalizedTransliteration = normalizeLatin(verse.transliteration);

        // Insert verse
        await db.runAsync(
          `INSERT OR REPLACE INTO verses 
           (id, number, text, juz_id, surah_id, verse_key, transliteration, transliteration_normalized,
            translation_id, translation_en, translation_my, translation_de, translation_tr, translation_fr)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          verse.id,
          verse.number,
          verse.text,
          verse.juz_id,
          verse.surah_id,
          verseKey,
          verse.transliteration,
          normalizedTransliteration,
          verse.translation_id,
          verse.translation_en,
          verse.translation_my,
          verse.translation_de,
          verse.translation_tr,
          verse.translation_fr,
        );

        // Insert tajweed marks if present
        if (verse.tajweed && verse.tajweed.length > 0) {
          for (const mark of verse.tajweed) {
            await db.runAsync(
              `INSERT INTO tajweed_marks (verse_id, class, start_baris, end_baris, start_pojok, end_pojok)
               VALUES (?, ?, ?, ?, ?, ?)`,
              verse.id,
              mark.class,
              mark.start_baris,
              mark.end_baris,
              mark.start_pojok,
              mark.end_pojok,
            );
          }
        }
      }
    });

    // Report progress
    if (onProgress) {
      onProgress(Math.min(i + BATCH_SIZE, total), total);
    }
  }

  // Rebuild FTS index after seeding
  await rebuildFtsIndex();
};

/**
 * Rebuild the FTS5 index.
 * Called after bulk data insertion.
 */
export const rebuildFtsIndex = async (): Promise<void> => {
  const db = await getDatabase();
  await db.execAsync("INSERT INTO verses_fts(verses_fts) VALUES('rebuild')");
};
