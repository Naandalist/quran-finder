import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from 'app/navigation/types';

// Screens
import HomeSearchScreen from 'screens/HomeSearchScreen';
import SearchResultsScreen from 'screens/SearchResultsScreen';
import VerseDetailScreen from 'screens/VerseDetailScreen';
import SurahContextScreen from 'screens/SurahContextScreen';
import BookmarksScreen from 'screens/BookmarksScreen';
import SettingsScreen from 'screens/SettingsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="HomeSearch"
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
      }}>
      <Stack.Screen name="HomeSearch" component={HomeSearchScreen} />
      <Stack.Screen name="SearchResults" component={SearchResultsScreen} />
      <Stack.Screen name="VerseDetail" component={VerseDetailScreen} />
      <Stack.Screen name="SurahContext" component={SurahContextScreen} />
      <Stack.Screen name="Bookmarks" component={BookmarksScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
