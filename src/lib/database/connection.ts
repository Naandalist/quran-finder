/**
 * SQLite database connection manager.
 * Uses pre-bundled quran.sqlite copied from assets.
 */
import { open, type NitroSQLiteConnection } from 'react-native-nitro-sqlite';
import { DATABASE_NAME, ensureDatabaseExists } from './assets';

let database: NitroSQLiteConnection | null = null;

/**
 * Get singleton database connection.
 * Opens the database with WAL mode for better read performance.
 * Note: ensureDatabaseExists() must be called before this.
 */
export const getDatabase = (): NitroSQLiteConnection => {
  if (!database) {
    database = open({ name: DATABASE_NAME });
    // Enable WAL mode for better read performance
    database.execute('PRAGMA journal_mode = WAL;');
  }
  return database;
};

/**
 * Initialize database - copies from assets if needed, then opens connection.
 */
export const initializeDatabase = async (): Promise<void> => {
  // First, ensure database is copied from assets to files directory
  await ensureDatabaseExists();
  // Then open the connection
  getDatabase();
};

/**
 * Check if database has verse data.
 */
export const isDatabasePopulated = async (): Promise<boolean> => {
  try {
    const db = getDatabase();
    const result = db.execute('SELECT COUNT(*) as count FROM verses');
    const count = Number(result.rows?._array[0]?.count ?? 0);
    return count > 0;
  } catch {
    return false;
  }
};

/**
 * Get total verse count from database.
 */
export const getVerseCount = async (): Promise<number> => {
  const db = getDatabase();
  const result = db.execute('SELECT COUNT(*) as count FROM verses');
  return Number(result.rows?._array[0]?.count ?? 0);
};

/**
 * Close database connection.
 */
export const closeDatabase = (): void => {
  if (database) {
    database.close();
    database = null;
  }
};
