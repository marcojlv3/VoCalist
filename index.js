/**
 * @format
 */

import {AppRegistry, View, ActivityIndicator} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import  RNFS from 'react-native-fs';
import React, { useEffect, useRef, useState } from 'react';
import  { realmName } from './src/database/configDB';
import  { createChannel } from './src/helpers/notificactionsManager';


const initialize = () => {
    //createChannel();

    const [iniciado,setIniciado] = useState(false);

    RNFS.exists(RNFS.DocumentDirectoryPath + '/vocalist_en_android_v2_1_0.ppn').then((value) => {
        if(!value){
            RNFS.copyFileAssets('vocalist_en_android_v2_1_0.ppn', RNFS.DocumentDirectoryPath + '/vocalist_en_android_v2_1_0.ppn');
        }
    });
    RNFS.exists(RNFS.DocumentDirectoryPath + '/porcupine_params_es.pv').then((value) => {
        if(!value){
            RNFS.copyFileAssets('porcupine_params_es.pv', RNFS.DocumentDirectoryPath + '/porcupine_params_es.pv');
        }
    });

    RNFS.exists(RNFS.DocumentDirectoryPath + '/'+realmName).then((value) => {
        if(!value){
            RNFS.copyFileAssets(realmName, RNFS.DocumentDirectoryPath + '/'+realmName).then((result) => {
                //initializeRealmContext();
                setIniciado(true)
            }).catch((err) => {console.log(err)});
        } else {
            //initializeRealmContext();
            setIniciado(true)
        }
    });

    return !iniciado ? <View></View>:<App/>;
}

AppRegistry.registerComponent(appName, () => initialize);