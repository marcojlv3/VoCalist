import React from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { WelcomeScreen } from '../screens/WelcomeScreen';
import { MainStack } from './MainStack';

export type RootStackParamsWel = {
  WelcomeScreen: undefined;
  MainStack: undefined;
}

const Stack = createStackNavigator<RootStackParamsWel>();

export const WelcomeStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown:false}}
    >
        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
        <Stack.Screen name="MainStack" component={MainStack} />
    </Stack.Navigator>
  );
}