/**
 * Pre-bundled database asset management.
 * Handles copying SQLite from Android assets to app files directory.
 */
import RNFS from 'react-native-fs';
import { mmkv } from 'lib/storage';

export const DATABASE_NAME = 'quran.sqlite';

/**
 * Database version - INCREMENT THIS when schema changes require a fresh copy.
 */
export const DATABASE_VERSION = 2;

const VERSION_KEY = 'quran_db_version';

/**
 * Get the destination path for the database in the app's files directory.
 */
export const getDatabasePath = (): string => {
  return `${RNFS.DocumentDirectoryPath}/${DATABASE_NAME}`;
};

/**
 * Get the stored database version.
 */
const getStoredVersion = (): number => {
  try {
    return mmkv.getNumber(VERSION_KEY) ?? 0;
  } catch {
    return 0;
  }
};

/**
 * Save the current database version.
 */
const saveVersion = (version: number): void => {
  mmkv.set(VERSION_KEY, version);
};

/**
 * Copy the pre-bundled database from Android assets to the files directory.
 * Forces recopy if the database version has changed.
 */
export const copyDatabaseFromAssets = async (): Promise<void> => {
  const destPath = getDatabasePath();
  const storedVersion = getStoredVersion();

  // Check if we need to copy (first time or version changed)
  const exists = await RNFS.exists(destPath);

  if (exists && storedVersion === DATABASE_VERSION) {
    console.log('📦 Database already up to date (v' + DATABASE_VERSION + ')');
    return;
  }

  // Delete old database if exists
  if (exists) {
    console.log('🗑️ Removing old database (v' + storedVersion + ')...');
    await RNFS.unlink(destPath);
  }

  console.log('📦 Copying database from assets (v' + DATABASE_VERSION + ')...');

  // On Android, copy from assets using copyFileAssets
  await RNFS.copyFileAssets(DATABASE_NAME, destPath);

  // Save the new version
  saveVersion(DATABASE_VERSION);

  console.log('✅ Database copied successfully');
};

/**
 * Ensure the database is available in the files directory.
 * Must be called before opening the database.
 */
export const ensureDatabaseExists = async (): Promise<void> => {
  await copyDatabaseFromAssets();
};
