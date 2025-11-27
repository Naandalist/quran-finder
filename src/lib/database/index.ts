/**
 * Barrel export for database module.
 */
export {
  getDatabase,
  initializeDatabase,
  isDatabasePopulated,
  getVerseCount,
  closeDatabase,
} from './connection';

export { DATABASE_NAME, DATABASE_VERSION } from './assets';

import * as verseRepositoryModule from './verseRepository';
export const verseRepository = verseRepositoryModule;
