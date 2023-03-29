import React, {useEffect, useState} from 'react'
import { Dimensions } from 'react-native';
import { EventRegister } from 'react-native-event-listeners';
import YoutubePlayer from 'react-native-youtube-iframe';
import { textToSpeech } from '../helpers/textToSpeech';
import { AudioResponeses } from '../data/AudioText';

interface Props {
    videoId: string
}

export const Video = ({videoId}:Props) => {

    let playListener:any;
    let stopListener:any;
        
    const screenWidth = Dimensions.get('screen').width;
    const [Play, setPlay] = useState(false);

    useEffect(() => {
        playListener = EventRegister.addEventListener('playVideo', () => {  
            setPlay(true);
        });
        stopListener = EventRegister.addEventListener('stopVideo', () => {
            setPlay(false);
        });
    
        return () => {
            EventRegister.removeEventListener(playListener);
            EventRegister.removeEventListener(stopListener);
        }
    }, [])
  
    return (
        <YoutubePlayer
            play={Play}
            height={screenWidth*9/16}
            videoId={videoId}
        />
    )
}
