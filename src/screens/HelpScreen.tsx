import React from 'react';
import { SettingsToggle } from '../components/SettingsToggle';
import { Screens, HeaderType } from '../enums/Enums';
import { HeaderBar } from '../components/HeaderBar';
import { Strings } from '../data/Strings';
import { View } from 'react-native';

export const HelpScreen = () => {
  return (
    <>
      <View>
        <HeaderBar
            text={Strings.help}
            headerType={HeaderType.Details}
        />
        <SettingsToggle screen={Screens.HelpScreen}/>
      </View>
    </>
  )
}
