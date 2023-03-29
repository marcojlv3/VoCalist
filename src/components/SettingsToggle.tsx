import { useContext } from 'react';
import React, { Switch, StyleSheet, ScrollView } from 'react-native';
import { View } from 'react-native';
import { Subtitle, BaseText } from './Texts';
import { Strings } from '../data/Strings';
import { Screens } from '../enums/Enums';
import { colors, styles } from '../theme/style';
import { SettingsContext } from '../contexts/SettingsContext';
import { stopTextToSpeech } from '../helpers/textToSpeech';
import { EventRegister } from 'react-native-event-listeners';

interface Props{
    screen: Screens;
}
export const SettingsToggle = ({screen}:Props) => {

    const sC = useContext(SettingsContext);

    return (
        
        <ScrollView style={{backgroundColor:colors.white}}>
            <View style={lStyle.settingsContainer}>
                <View style={[styles.rowContainer, lStyle.titleContainer]}>
                    <Subtitle
                        text={Strings.voiceTitle}
                        style={{color:colors.black}}
                    />
                    <Switch
                            trackColor={{ false: colors.lightBlack, true: colors.primary }}
                            thumbColor={sC.VoiceCommands ? colors.primary : colors.lightGrey}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={()=>{
                                sC.toggleVoiceCommands();
                                if(!sC.VoiceCommands){
                                    EventRegister.emit('startSearching');
                                } else {
                                    EventRegister.emit('stopSearching');
                                }
                            }}
                            value={sC.VoiceCommands}
                    />
                </View>
                <BaseText
                    text={screen == Screens.HelpScreen ? Strings.voiceTutorial : Strings.voiceText}
                />
            </View>

            <View style={styles.separator}></View>

            <View style={lStyle.settingsContainer}>
                <View style={[styles.rowContainer, lStyle.titleContainer]}>
                    <Subtitle
                        text={Strings.audioTitle}
                        style={{color:colors.black}}
                    />
                    <Switch
                            trackColor={{ false: colors.lightBlack, true: colors.primary }}
                            thumbColor={sC.AudioWorkout ? colors.primary : colors.lightGrey}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={() => {
                                EventRegister.emit('cancelAudioWorkout');
                                sC.toggleAudioWorkout();
                                stopTextToSpeech();
                            }}
                            value={sC.AudioWorkout}
                    />
                </View>
                <BaseText
                    text={Strings.audioText}
                />
            </View>

            <View style={styles.separator}></View>

            <View style={lStyle.settingsContainer}>
                <View style={[styles.rowContainer, lStyle.titleContainer]}>
                    <Subtitle
                        text={Strings.movementTitle}
                        style={{color:colors.black}}
                    />
                    <Switch
                            trackColor={{ false: colors.lightBlack, true: colors.primary }}
                            thumbColor={sC.MovementDetection ? colors.primary : colors.lightGrey}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={() => {
                                sC.toggleMovementDetection();
                            }}
                            value={sC.MovementDetection}
                    />
                </View>
                <BaseText
                    text={Strings.movementText}
                />
            </View>

            <View style={[styles.separator, {marginBottom:100}]}></View>
{/* 
            <View style={lStyle.settingsContainer}>
                <View style={[styles.rowContainer, lStyle.titleContainer]}>
                    <Subtitle
                        text={Strings.notificationsTitle}
                        style={{color:colors.black}}
                    />
                    <Switch
                            trackColor={{ false: colors.lightBlack, true: colors.primary }}
                            thumbColor={sC.Notifications ? colors.primary : colors.lightGrey}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={() => {
                                sC.toggleNotificacions();
                                if(!sC.Notifications){
                                    EventRegister.emit('sendNotification');
                                } else {
                                    EventRegister.emit('cancelNotification');
                                }
                            }}
                            value={sC.Notifications}
                    />
                </View>
                <BaseText
                    text={Strings.notificationsText}
                />
            </View> 

            <View style={styles.separator}></View> */}
      </ScrollView>
    )

}

const lStyle = StyleSheet.create({
    settingsContainer: {
        
        padding:'2%',
        margin:'3%',
        marginBottom:'4%'
    },
    titleContainer: {
        justifyContent:'space-between',
    }
});
