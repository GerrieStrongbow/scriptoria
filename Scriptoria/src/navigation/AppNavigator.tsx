import React, { type ReactElement } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen';
import ScanScreen from '../screens/ScanScreen';
import DocumentScreen from '../screens/DocumentScreen';
import type { AppStackParamList } from './types';

const Stack = createStackNavigator<AppStackParamList>();

export default function AppNavigator(): ReactElement {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          presentation: 'card',
          animationEnabled: true,
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'My Documents' }}
        />
        <Stack.Screen
          name="Scan"
          component={ScanScreen}
          options={{ title: 'Scan Document' }}
        />
        <Stack.Screen
          name="Document"
          component={DocumentScreen}
          options={{ title: 'View Document' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
