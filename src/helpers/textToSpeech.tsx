import TTS from 'react-native-tts';

let speaking = false;

export const textToSpeech = (text:string) => {
    TTS.stop();
    speaking = true;
    TTS.speak(text);
    TTS.addEventListener('tts-finish', () => {
        speaking = false;
    });
}

export const stopTextToSpeech = () => {
    TTS.stop();
}

export const getTTSState = () => {
    return speaking;
}