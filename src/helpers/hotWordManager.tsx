import {PorcupineManager, BuiltInKeywords} from '@picovoice/porcupine-react-native';
import { EventRegister } from 'react-native-event-listeners';
import  RNFS from 'react-native-fs';
//import { setRecognitioning } from '../components/VoiceCommands';

export let detectionCallback = async (keywordIndex: number) => {
    stopSearchingHotWord().then(() => {
        EventRegister.emit('startRecognition');
    })
};
let processErrorCallback = async () => {
    
};

export let porcupineManager: any;

const initializeManager = async () => {
    
    // try{
        
    //     return porcupineManager = await PorcupineManager.fromBuiltInKeywords(
    //         "IB2mDvKpIxwJQmwg/0pJDNK7vTLfrvDa/+F5oVvGc01xkxRtxRx3SA==",
    //         [BuiltInKeywords.JARVIS, BuiltInKeywords.PORCUPINE, BuiltInKeywords.BUMBLEBEE],
    //         detectionCallback,
            
    //       );
       
    // } catch (e:any) {
    //     console.log(e)
    // }

    return porcupineManager = await PorcupineManager.fromKeywordPaths(
        "IB2mDvKpIxwJQmwg/0DNK7vTLfrvDa/+F5oVvGc01xkxxRx3SA==",
        [RNFS.DocumentDirectoryPath + '/vocalist_en_android_v2_1_0.ppn'],
        detectionCallback,
        processErrorCallback,
        //RNFS.DocumentDirectoryPath + '/porcupine_params_es.pv'
      );
}

export const startSearchingHotWord = async () =>{
    try{
     
        if(porcupineManager == undefined || porcupineManager._porcupine == null)
            await initializeManager();
        await porcupineManager.start()
    } catch (e:any) {
        console.log(e)
    }
}

export const stopSearchingHotWord = async () =>{
    if(porcupineManager != undefined)
        await porcupineManager.stop();
}
export const deleteHotWordManager = async () =>{
    if(porcupineManager != undefined)
        await porcupineManager.delete();

}
