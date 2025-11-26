/**
 * Database schema definitions for SQLite verses database.
 */

export const VERSES_TABLE = `
CREATE TABLE IF NOT EXISTS verses (
  id INTEGER PRIMARY KEY,
  number INTEGER NOT NULL,
  text TEXT NOT NULL,
  juz_id INTEGER NOT NULL,
  surah_id INTEGER NOT NULL,
  verse_key TEXT NOT NULL,
  transliteration TEXT NOT NULL,
  transliteration_normalized TEXT NOT NULL,
  translation_id TEXT NOT NULL,
  translation_en TEXT NOT NULL,
  translation_my TEXT NOT NULL,
  translation_de TEXT NOT NULL,
  translation_tr TEXT NOT NULL,
  translation_fr TEXT NOT NULL
);
`;

export const TAJWEED_MARKS_TABLE = `
CREATE TABLE IF NOT EXISTS tajweed_marks (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  verse_id INTEGER NOT NULL,
  class TEXT NOT NULL,
  start_baris INTEGER NOT NULL,
  end_baris INTEGER NOT NULL,
  start_pojok INTEGER NOT NULL,
  end_pojok INTEGER NOT NULL,
  FOREIGN KEY (verse_id) REFERENCES verses(id)
);
`;

export const INDEXES = [
  'CREATE INDEX IF NOT EXISTS idx_verses_surah_id ON verses(surah_id);',
  'CREATE INDEX IF NOT EXISTS idx_verses_juz_id ON verses(juz_id);',
  'CREATE INDEX IF NOT EXISTS idx_verses_verse_key ON verses(verse_key);',
  'CREATE INDEX IF NOT EXISTS idx_verses_transliteration_normalized ON verses(transliteration_normalized);',
  'CREATE INDEX IF NOT EXISTS idx_tajweed_marks_verse_id ON tajweed_marks(verse_id);',
];

export const FTS_TABLE = `
CREATE VIRTUAL TABLE IF NOT EXISTS verses_fts USING fts5(
  verse_key,
  transliteration_normalized,
  translation_id,
  translation_en,
  translation_my,
  translation_de,
  translation_tr,
  translation_fr,
  content='verses',
  content_rowid='id'
);
`;

export const FTS_TRIGGERS = [
  `CREATE TRIGGER IF NOT EXISTS verses_ai AFTER INSERT ON verses BEGIN
    INSERT INTO verses_fts(rowid, verse_key, transliteration_normalized, translation_id, translation_en, translation_my, translation_de, translation_tr, translation_fr)
    VALUES (new.id, new.verse_key, new.transliteration_normalized, new.translation_id, new.translation_en, new.translation_my, new.translation_de, new.translation_tr, new.translation_fr);
  END;`,
  `CREATE TRIGGER IF NOT EXISTS verses_ad AFTER DELETE ON verses BEGIN
    INSERT INTO verses_fts(verses_fts, rowid, verse_key, transliteration_normalized, translation_id, translation_en, translation_my, translation_de, translation_tr, translation_fr)
    VALUES ('delete', old.id, old.verse_key, old.transliteration_normalized, old.translation_id, old.translation_en, old.translation_my, old.translation_de, old.translation_tr, old.translation_fr);
  END;`,
  `CREATE TRIGGER IF NOT EXISTS verses_au AFTER UPDATE ON verses BEGIN
    INSERT INTO verses_fts(verses_fts, rowid, verse_key, transliteration_normalized, translation_id, translation_en, translation_my, translation_de, translation_tr, translation_fr)
    VALUES ('delete', old.id, old.verse_key, old.transliteration_normalized, old.translation_id, old.translation_en, old.translation_my, old.translation_de, old.translation_tr, old.translation_fr);
    INSERT INTO verses_fts(rowid, verse_key, transliteration_normalized, translation_id, translation_en, translation_my, translation_de, translation_tr, translation_fr)
    VALUES (new.id, new.verse_key, new.transliteration_normalized, new.translation_id, new.translation_en, new.translation_my, new.translation_de, new.translation_tr, new.translation_fr);
  END;`,
];
