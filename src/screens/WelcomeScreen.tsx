import React, { useEffect } from 'react'
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { colors } from '../theme/style';
import { Title, Subtitle, BaseText } from '../components/Texts';
import { Strings } from '../data/Strings';
import { CircularButton } from '../components/Buttons';
import { Images } from '../data/Images';
import SplashScreen from 'react-native-splash-screen';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamsWel } from '../navigator/WelcomeStack';
import RealmContext from '../database/configDB';
import { UserConfig } from '../database/classes/UserConfig';

type Props = StackScreenProps<RootStackParamsWel, 'WelcomeScreen'>;

export const WelcomeScreen = ({navigation}:Props) => {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  const realm = RealmContext.useRealm();

  const endWelcome = () => {
    navigation.navigate('MainStack');
    realm.write(() => {
      const config = realm.objects<UserConfig>("config")[0];
      config.welcome = true;
    });
  } 
  
  return (
    <TouchableOpacity 
      delayPressIn={0}
        style={[lStyle.container,{backgroundColor:colors.white}]}
        onPress={() => endWelcome()}
    >
      <View style={{flex:1, alignItems:'center'}}>
        <Title 
          text={Strings.welcome}
          style={[lStyle.text,{fontSize:30}]}
        />
        <Image
          source={Images.get('logo')}
          style={{width:120, height:120}}
        />
        <Subtitle
          text={Strings.welcomeText1}
          style={lStyle.text}
        />
      </View>
      <View style={{flex:1, alignItems:'center'}}>
        <BaseText
          text={Strings.welcomeText2}
          style={[lStyle.text,{marginBottom:10}]}
        />

        <CircularButton
          iconName='help'
          onPress={() => endWelcome()}
          style={{width:100, height:100}}
          iconStyle={{fontSize: 50}}
        />
      </View>

      <BaseText
        text={Strings.welcomeText3}
        style={lStyle.text}
      />
      <Subtitle
        text={Strings.welcomeText4}
        style={lStyle.text}
      />
    </TouchableOpacity>
  )
}

const lStyle = StyleSheet.create({
  text:{
    textAlign:'center'
  },
  container:{
    height:'100%',
    padding:'10%',
    display:'flex',
    flexDirection:'column',
    alignItems:'center'
  }
});
