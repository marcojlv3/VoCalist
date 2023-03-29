import React, { useEffect } from 'react'
import { StyleSheet, View, Image, useWindowDimensions, Alert, BackHandler } from 'react-native';
import { Title, Subtitle } from '../components/Texts';
import { Strings } from '../data/Strings';
import { Images } from '../data/Images';
import { colors } from '../theme/style';
import CIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { redirectPlayStore } from '../helpers/redirectPlayStore';
import { BigRectangularButton } from '../components/Buttons';
import { useNavigation } from '@react-navigation/native';

export const EndOfTrialScreen = () => {
    const navigation = useNavigation();
    useEffect(
        () =>
          navigation.addListener('beforeRemove', (e) => {
    
            e.preventDefault();
            //falta mostrar la alerta para salir
            Alert.alert(
                Strings.leftMsg,
                "",
                [
                  {
                    text: Strings.cancel,
                    style: "cancel"
                  },
                  { text: Strings.acept, onPress: () => BackHandler.exitApp() }
                ]
              );
          }),[navigation]
    );

    const screenWitdh = useWindowDimensions().width;

    return (
            <>
                <View 
                    style={[lStyle.container,{backgroundColor:colors.white}]}
                >
                    <Image
                        source={Images.get('logo')}
                        style={{width: 100, height:100}}
                    />
                    <Title 
                        text={Strings.endOfTrial}
                        style={[lStyle.text,{fontSize:30, marginBottom:'20%'}]}
                    />
                
                    <View style={{display:'flex', justifyContent:'center', alignItems:'center'}}>
                        <CIcon
                            name={'clock-remove'}
                            color={colors.primary}
                            size={64}
                            style={{marginBottom:'5%'}}
                        />
                        <Title
                            text={Strings.endOfTrial1}
                            style={lStyle.text}
                        />
                    </View>
                    <Subtitle
                        text={Strings.endOfTrial2}
                        style={lStyle.text}
                    />
                    <BigRectangularButton
                        text={Strings.obtainPremium}
                        onPress={() => redirectPlayStore()}
                        style={{width:screenWitdh*0.98}}
                    />
                </View>

           
            </>
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
        alignItems:'center',
        justifyContent:'space-between'
      }
    });
    