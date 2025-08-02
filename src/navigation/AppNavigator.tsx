import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { NavigationParams } from '../types';
import { HomeScreen } from '../screens/HomeScreen';
import { LessonScreen } from '../screens/LessonScreen';
import { PracticeScreen } from '../screens/PracticeScreen';
import { BRANDING } from '../constants/app';

const Stack = createStackNavigator<NavigationParams>();

export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor={BRANDING.primaryColor} />
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: BRANDING.backgroundColor },
          animationEnabled: true,
          gestureEnabled: true,
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Gelato',
          }}
        />
        <Stack.Screen
          name="Lesson"
          component={LessonScreen}
          options={{
            title: 'Lesson',
            gestureDirection: 'horizontal',
          }}
        />
        <Stack.Screen
          name="Practice"
          component={PracticeScreen}
          options={{
            title: 'Practice',
            gestureDirection: 'horizontal',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};