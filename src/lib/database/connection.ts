/**
 * SQLite database connection manager.
 * Provides singleton database connection with WAL mode for better performance.
 */
import * as SQLite from 'expo-sqlite';
import {
  VERSES_TABLE,
  TAJWEED_MARKS_TABLE,
  INDEXES,
  FTS_TABLE,
  FTS_TRIGGERS,
} from './schema';

const DATABASE_NAME = 'quran_verses.db';

let database: SQLite.SQLiteDatabase | null = null;

/**
 * Get singleton database connection.
 * Opens database with WAL mode for better concurrent performance.
 */
export const getDatabase = async (): Promise<SQLite.SQLiteDatabase> => {
  if (!database) {
    database = await SQLite.openDatabaseAsync(DATABASE_NAME);
    // Enable WAL mode for better performance
    await database.execAsync('PRAGMA journal_mode = WAL;');
  }
  return database;
};

/**
 * Initialize database schema.
 * Creates tables, indexes, FTS virtual table, and triggers.
 */
export const initializeDatabase = async (): Promise<void> => {
  const db = await getDatabase();

  // Create main tables
  await db.execAsync(VERSES_TABLE);
  await db.execAsync(TAJWEED_MARKS_TABLE);

  // Create indexes
  for (const index of INDEXES) {
    await db.execAsync(index);
  }

  // Create FTS5 virtual table
  await db.execAsync(FTS_TABLE);

  // Create triggers for FTS sync
  for (const trigger of FTS_TRIGGERS) {
    await db.execAsync(trigger);
  }
};

/**
 * Check if database is populated with verse data.
 */
export const isDatabasePopulated = async (): Promise<boolean> => {
  const db = await getDatabase();
  const result = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM verses',
  );
  return (result?.count ?? 0) > 0;
};

/**
 * Get total verse count from database.
 */
export const getVerseCount = async (): Promise<number> => {
  const db = await getDatabase();
  const result = await db.getFirstAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM verses',
  );
  return result?.count ?? 0;
};

/**
 * Close database connection.
 * Should be called when app is shutting down.
 */
export const closeDatabase = async (): Promise<void> => {
  if (database) {
    await database.closeAsync();
    database = null;
  }
};
