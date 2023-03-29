import React from 'react';

import { NavigationContainer } from '@react-navigation/native';
import { WelcomeStack } from './WelcomeStack';
import { MainStack } from './MainStack';
import { SettingsContext } from '../contexts/SettingsContext';
import { useContext } from 'react';

export const AppNavigationContainer = () => {
      
  const sC = useContext(SettingsContext);
 
  return (
    <NavigationContainer>
        { !sC.Welcome ?
          <WelcomeStack />
          :
          <MainStack />
        } 
    </NavigationContainer>
  )
}
