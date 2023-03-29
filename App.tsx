import 'react-native-gesture-handler';
import 'react-native-get-random-values';
import { WelcomeStack } from './src/navigator/WelcomeStack';
import { StatusBar } from 'react-native';
import { colors } from './src/theme/style';
import  RNFS, { completeHandlerIOS } from 'react-native-fs';
import RealmContext from './src/database/configDB';
import { LogBox } from "react-native"
import React, { useEffect } from 'react';
import { MainStack } from './src/navigator/MainStack';
import { AppNavigationContainer } from './src/navigator/AppNavigationContainer';
import { SettingsContextContainer } from './src/contexts/SettingsContext';

LogBox.ignoreLogs(["Warning: Each","Non-serializable", "Possible", "`new"]);

const {RealmProvider} = RealmContext; 
const App = () => {
 
  
  console.log(RealmProvider )
  
  StatusBar.setBackgroundColor(colors.white);
  StatusBar.setBarStyle("dark-content");


  return (
    <RealmProvider>
      <SettingsContextContainer/>
    </RealmProvider>
  );
};

export default App;
