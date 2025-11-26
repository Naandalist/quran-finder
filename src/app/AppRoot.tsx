import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from 'lib/theme/ThemeProvider';
import { RootNavigator } from 'app/navigation/RootNavigator';
import { colors } from 'lib/theme/colors';
import { DatabaseProvider } from 'app/DatabaseProvider';

const AppRoot: React.FC = () => {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <DatabaseProvider>
          <NavigationContainer
          theme={{
            dark: false,
            colors: {
              primary: colors.primary,
              background: colors.background,
              card: colors.surface,
              text: colors.text,
              border: colors.border,
              notification: colors.primary,
            },
            fonts: {
              regular: {
                fontFamily: 'System',
                fontWeight: '400',
              },
              medium: {
                fontFamily: 'System',
                fontWeight: '500',
              },
              bold: {
                fontFamily: 'System',
                fontWeight: '700',
              },
              heavy: {
                fontFamily: 'System',
                fontWeight: '800',
              },
            },
          }}>
          <RootNavigator />
        </NavigationContainer>
        </DatabaseProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
};

export default AppRoot;
