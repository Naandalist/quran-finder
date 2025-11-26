/**
 * Database provider component.
 * Initializes SQLite database and seeds data on app start.
 */
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import {
  initializeDatabase,
  isDatabasePopulated,
  seedDatabase,
  type ProgressCallback,
} from 'lib/database';
import { useTheme } from 'lib/theme/ThemeProvider';
import versesData from 'lib/quran/verses.json';
import type { VerseRaw } from 'lib/types';

interface DatabaseContextValue {
  isReady: boolean;
}

const DatabaseContext = createContext<DatabaseContextValue>({ isReady: false });

export const useDatabase = () => useContext(DatabaseContext);

interface DatabaseProviderProps {
  children: ReactNode;
}

export const DatabaseProvider: React.FC<DatabaseProviderProps> = ({
  children,
}) => {
  const { colors, spacing, typography } = useTheme();
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState({ current: 0, total: 0 });

  useEffect(() => {
    const initDb = async () => {
      try {
        // Initialize schema
        await initializeDatabase();

        // Check if seeding is needed
        const populated = await isDatabasePopulated();

        if (!populated) {
          const onProgress: ProgressCallback = (current, total) => {
            setProgress({ current, total });
          };

          // Seed database from JSON
          await seedDatabase(versesData as VerseRaw[], onProgress);
        }

        setIsReady(true);
      } catch (err) {
        console.error('Database initialization error:', err);
        setError(
          err instanceof Error ? err.message : 'Failed to initialize database',
        );
      }
    };

    initDb();
  }, []);

  if (error) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background, padding: spacing.lg },
        ]}>
        <Text style={[typography.h3, { color: colors.error }]}>
          Database Error
        </Text>
        <Text
          style={[
            typography.body,
            { color: colors.textMuted, marginTop: spacing.md },
          ]}>
          {error}
        </Text>
      </View>
    );
  }

  if (!isReady) {
    const progressPercent =
      progress.total > 0
        ? Math.round((progress.current / progress.total) * 100)
        : 0;

    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background, padding: spacing.lg },
        ]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text
          style={[
            typography.body,
            { color: colors.text, marginTop: spacing.md },
          ]}>
          {progress.total > 0
            ? `Memuat data ayat... ${progressPercent}%`
            : 'Menginisialisasi database...'}
        </Text>
        {progress.total > 0 && (
          <Text
            style={[
              typography.caption,
              { color: colors.textMuted, marginTop: spacing.sm },
            ]}>
            {progress.current} / {progress.total} ayat
          </Text>
        )}
      </View>
    );
  }

  return (
    <DatabaseContext.Provider value={{ isReady }}>
      {children}
    </DatabaseContext.Provider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
