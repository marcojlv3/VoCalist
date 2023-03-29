import React, { createContext, useState } from 'react'
import RealmContext from '../database/configDB';
import { UserConfig } from '../database/classes/UserConfig';
import { AppNavigationContainer } from '../navigator/AppNavigationContainer';
import { PermissionsAndroid, Platform } from 'react-native';

export const SettingsContext = createContext({
    Welcome: false,
    VoiceCommands: false,
    AudioWorkout: false,
    MovementDetection: false,
    Notifications: false,
    toggleVoiceCommands: () => {},
    toggleAudioWorkout: () => {},
    toggleMovementDetection: () => {},
    toggleNotificacions: () => {},
});
  

export const SettingsContextContainer = () => {

    const realm = RealmContext.useRealm();
    const configDB = RealmContext.useQuery(UserConfig)[0];

    const Welcome = configDB.welcome;
    const [VoiceCommands, setVoiceCommands] = useState(configDB.voiceCommands);
    const [AudioWorkout, setAudioWorkout] = useState(configDB.audioWorkout);
    const [MovementDetection, setMovementDetection] = useState(configDB.movementDetection);
    const [Notifications, setNotifications] = useState(configDB.notifications);

    const toggleVoiceCommands = () => {

        //pedir permisos
        if(!VoiceCommands)
            if (Platform.OS == 'android') {
                PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.RECORD_AUDIO
                );
            } 
        
        
        setVoiceCommands(!VoiceCommands);
      
        realm.write(() => {
            configDB.voiceCommands = !VoiceCommands;
        });
    }
    const toggleAudioWorkout = () => {

        //permisos
        
        setAudioWorkout(!AudioWorkout);
      
        realm.write(() => {
            configDB.audioWorkout = !AudioWorkout;
        });

    }
    const toggleMovementDetection = () => {
     

        //permisos
        setMovementDetection(!MovementDetection)
      
        realm.write(() => {
            configDB.movementDetection = !MovementDetection;
        });

    }
    const toggleNotificacions = () => {

        //permisos


        setNotifications(!Notifications);
      
        realm.write(() => {
            configDB.notifications = !Notifications;
        });
    }
    

    return (
        <SettingsContext.Provider
            value = {{
                Welcome,
                VoiceCommands,
                AudioWorkout,
                MovementDetection,
                Notifications,
                toggleVoiceCommands,
                toggleAudioWorkout,
                toggleMovementDetection,
                toggleNotificacions,
            }}
        >
            <AppNavigationContainer/>
        </SettingsContext.Provider>
    )
}
