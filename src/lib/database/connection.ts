/**
 * SQLite database connection manager.
 * Provides singleton database connection with WAL mode for better performance.
 */
import { open, type NitroSQLiteConnection } from 'react-native-nitro-sqlite';
import {
  VERSES_TABLE,
  TAJWEED_MARKS_TABLE,
  INDEXES,
  FTS_TABLE,
  FTS_TRIGGERS,
} from './schema';

const DATABASE_NAME = 'quran_verses.db';

let database: NitroSQLiteConnection | null = null;

/**
 * Get singleton database connection.
 * Opens database with WAL mode for better concurrent performance.
 */
export const getDatabase = (): NitroSQLiteConnection => {
  if (!database) {
    database = open({ name: DATABASE_NAME });
    // Enable WAL mode for better performance
    database.execute('PRAGMA journal_mode = WAL;');
  }
  return database;
};

/**
 * Initialize database schema.
 * Creates tables, indexes, FTS virtual table, and triggers.
 */
export const initializeDatabase = async (): Promise<void> => {
  const db = getDatabase();

  // Create main tables
  await db.executeAsync(VERSES_TABLE);
  await db.executeAsync(TAJWEED_MARKS_TABLE);

  // Create indexes
  for (const index of INDEXES) {
    await db.executeAsync(index);
  }

  // Create FTS5 virtual table
  await db.executeAsync(FTS_TABLE);

  // Create triggers for FTS sync
  for (const trigger of FTS_TRIGGERS) {
    await db.executeAsync(trigger);
  }
};

/**
 * Check if database is populated with verse data.
 */
export const isDatabasePopulated = async (): Promise<boolean> => {
  const db = getDatabase();
  const result = await db.executeAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM verses',
  );
  return (result.rows?._array[0]?.count ?? 0) > 0;
};

/**
 * Get total verse count from database.
 */
export const getVerseCount = async (): Promise<number> => {
  const db = getDatabase();
  const result = await db.executeAsync<{ count: number }>(
    'SELECT COUNT(*) as count FROM verses',
  );
  return result.rows?._array[0]?.count ?? 0;
};

/**
 * Close database connection.
 * Should be called when app is shutting down.
 */
export const closeDatabase = (): void => {
  if (database) {
    database.close();
    database = null;
  }
};
