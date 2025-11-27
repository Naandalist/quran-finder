#!/usr/bin/env node

/**
 * Build script to convert verses.json into a compact SQLite database.
 *
 * Usage: node tools/build-quran-db.mjs
 *
 * Reads: src/lib/quran/verses.json
 * Writes: android/app/src/main/assets/quran.sqlite
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Database from 'better-sqlite3';

// Get the project root directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// File paths
const jsonPath = path.join(projectRoot, 'src', 'lib', 'quran', 'verses.json');
const assetsDir = path.join(projectRoot, 'android', 'app', 'src', 'main', 'assets');
const outPath = path.join(assetsDir, 'quran.sqlite');

/**
 * Normalize Latin text for phonetic search.
 * Same logic as src/lib/quran/normalizeLatin.ts
 */
const normalizeLatin = (text) => {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^\w]/g, '')           // Remove non-word chars
    .replace(/_/g, '');              // Remove underscores
};

console.log('🕌 Quran Database Builder');
console.log('='.repeat(40));

// Check if source JSON exists
if (!fs.existsSync(jsonPath)) {
  console.error(`\n❌ Error: Source file not found: ${jsonPath}`);
  console.error('   Please ensure src/lib/quran/verses.json exists before running this script.');
  process.exit(1);
}

console.log(`\n📖 Reading ${jsonPath}...`);
const raw = fs.readFileSync(jsonPath, 'utf8');
const verses = JSON.parse(raw);

if (!Array.isArray(verses)) {
  console.error('\n❌ Error: verses.json must contain an array of verse objects.');
  process.exit(1);
}

console.log(`   Found ${verses.length} verses`);

// Ensure assets directory exists
if (!fs.existsSync(assetsDir)) {
  console.log(`\n📁 Creating assets directory...`);
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Remove existing database if it exists
if (fs.existsSync(outPath)) {
  console.log(`\n🗑️  Removing existing database...`);
  fs.unlinkSync(outPath);
}

console.log(`\n🗃️  Creating SQLite database at ${outPath}...`);
const db = new Database(outPath);

// Configure for fast bulk inserts
db.pragma('journal_mode = WAL');
db.pragma('synchronous = OFF');

// Create the verses table with normalized transliteration column
console.log('\n📋 Creating verses table...');
db.exec(`
  CREATE TABLE verses (
    id                          INTEGER PRIMARY KEY,
    number                      INTEGER,
    surah_id                    INTEGER NOT NULL,
    juz_id                      INTEGER,
    text                        TEXT NOT NULL,
    transliteration             TEXT NOT NULL,
    transliteration_normalized  TEXT NOT NULL,
    translation_id              TEXT
  );
`);

// Prepare insert statement
const insert = db.prepare(`
  INSERT INTO verses (id, number, surah_id, juz_id, text, transliteration, transliteration_normalized, translation_id)
  VALUES (@id, @number, @surah_id, @juz_id, @text, @transliteration, @transliteration_normalized, @translation_id)
`);

// Use a transaction for bulk insert (much faster)
console.log('\n⏳ Inserting verses...');
const startTime = Date.now();

const insertAll = db.transaction((versesData) => {
  let inserted = 0;
  for (const v of versesData) {
    insert.run({
      id: v.id,
      number: v.number ?? null,
      surah_id: v.surah_id,
      juz_id: v.juz_id ?? null,
      text: v.text,
      transliteration: v.transliteration,
      transliteration_normalized: normalizeLatin(v.transliteration),
      translation_id: v.translation_id ?? null,
    });
    inserted++;

    // Log progress every 1000 verses
    if (inserted % 1000 === 0) {
      console.log(`   Inserted ${inserted} / ${versesData.length} verses...`);
    }
  }
  return inserted;
});

const insertedCount = insertAll(verses);
const insertDuration = Date.now() - startTime;

console.log(`   ✅ Inserted ${insertedCount} verses in ${insertDuration}ms`);

// Create indexes for efficient querying
console.log('\n🔍 Creating indexes...');

console.log('   - Creating index on (surah_id, number)...');
db.exec(`
  CREATE INDEX idx_verses_surah_number
    ON verses(surah_id, number);
`);

console.log('   - Creating index on transliteration_normalized...');
db.exec(`
  CREATE INDEX idx_verses_transliteration_normalized
    ON verses(transliteration_normalized);
`);

// Switch back to normal mode and close
db.pragma('synchronous = NORMAL');
db.close();

// Get file size
const stats = fs.statSync(outPath);
const fileSizeKB = (stats.size / 1024).toFixed(2);
const fileSizeMB = (stats.size / 1024 / 1024).toFixed(2);

console.log('\n' + '='.repeat(40));
console.log('✅ Database build complete!');
console.log(`   📁 Output: ${outPath}`);
console.log(`   📊 Size: ${fileSizeKB} KB (${fileSizeMB} MB)`);
console.log(`   📝 Total verses: ${insertedCount}`);
console.log(`   ⏱️  Build time: ${insertDuration}ms`);
