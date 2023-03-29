import React, { useState } from 'react';
import { SettingsToggle } from '../components/SettingsToggle';
import { HeaderType, Screens } from '../enums/Enums';
import { Title } from '../components/Texts';
import { Strings } from '../data/Strings';
import { BigRectangularButton } from '../components/Buttons';
import { HeaderBar } from '../components/HeaderBar';
import { View } from 'react-native';
import { colors } from '../theme/style';
import { redirectPlayStore } from '../helpers/redirectPlayStore';
import { getActualDay } from '../helpers/getActualDay';

export const SettingsScreen = () => {

    const [actualDay, setactualDay] = useState(0);

    getActualDay().then((actualDay) =>{
      setactualDay(actualDay)
    });
  

    return (
      <>
        <HeaderBar
          text={Strings.settings}
          headerType={HeaderType.Navigation}      
        />

        <SettingsToggle screen={Screens.SettingsScreen}/>

        <View style={{backgroundColor:colors.white}}>
          <Title 
            text={actualDay+'/30 '+Strings.daysLeft}
            style={{alignSelf:'center', marginTop:0}}
          />
          <BigRectangularButton
            text={Strings.obtainPremium}
            onPress={() => redirectPlayStore()}
          />
        </View>
      </>  
    )
}
