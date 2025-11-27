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

export { seedDatabase, rebuildFtsIndex, type ProgressCallback } from './seeder';

import * as verseRepositoryModule from './verseRepository';
export const verseRepository = verseRepositoryModule;
