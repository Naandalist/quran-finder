import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from 'app/navigation/types';

import {
  HomeSearchScreen,
  SearchResultsScreen,
  SearchHistoryScreen,
} from 'screens';

const Stack = createNativeStackNavigator<RootStackParamList>();

export const RootNavigator: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="HomeSearch"
      screenOptions={{
        headerShown: false,
        animation: 'fade',
      }}
    >
      <Stack.Screen name="HomeSearch" component={HomeSearchScreen} />
      <Stack.Screen name="SearchResults" component={SearchResultsScreen} />
      <Stack.Screen name="SearchHistory" component={SearchHistoryScreen} />
    </Stack.Navigator>
  );
};

export default RootNavigator;
