/**
 * Database provider component.
 * Initializes the pre-bundled SQLite database on app start.
 */
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { initializeDatabase, isDatabasePopulated } from 'lib/database';
import { useTheme } from 'lib/theme/ThemeProvider';

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

  useEffect(() => {
    const initDb = async () => {
      try {
        // Initialize database connection
        await initializeDatabase();

        // Verify database has data
        const populated = await isDatabasePopulated();
        if (!populated) {
          throw new Error(
            'Database is empty. Please rebuild with: pnpm build:quran-db',
          );
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
        ]}
      >
        <Text style={[typography.h3, { color: colors.error }]}>
          {__DEV__ ? 'SQLite Error' : 'Error'}
        </Text>
        <Text
          style={[
            typography.body,
            { color: colors.textMuted, marginTop: spacing.md },
          ]}
        >
          {__DEV__ ? error : 'Uninstall and reinstall app to fix this issue.'}
        </Text>
      </View>
    );
  }

  if (!isReady) {
    return (
      <View
        style={[
          styles.container,
          { backgroundColor: colors.background, padding: spacing.lg },
        ]}
      >
        <ActivityIndicator size="large" color={colors.primary} />
        <Text
          style={[
            typography.body,
            { color: colors.text, marginTop: spacing.md },
          ]}
        >
          Memuat database...
        </Text>
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
