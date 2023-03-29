import React, { useContext, useEffect } from 'react'
import { BigLabel } from './Texts';
import { useState } from 'react';
import { formateTime } from '../helpers/formateTime';
import { View } from 'react-native';
import { CountdownCircleTimer } from 'react-native-countdown-circle-timer';
import { colors, styles } from '../theme/style';
import { CircularButton } from './Buttons';
import { WorkoutContext } from '../screens/WorkoutScreen';
import { WorkoutComps } from '../enums/Enums';
import { EventRegister } from 'react-native-event-listeners';
import { playSound, stopSound } from '../helpers/playSound';

interface Props {
    initialSeconds: number;
    size:number;
}


export const CountDown = ({initialSeconds, size}:Props) => {

    let addListener:any;
    let removeListener:any;
    useEffect(() => {

        addListener = EventRegister.addEventListener('addSeconds', (data) => {
            addSeconds(data);
        });
        removeListener = EventRegister.addEventListener('removeSeconds', (data) => {
            removeSeconds(data);
        });
    
      return () => {
        stopSound();
        EventRegister.removeEventListener(addListener);
        EventRegister.removeEventListener(removeListener);
      }
    }, [])
    const [Seconds, setSeconds] = useState(initialSeconds);
    
    const workoutContext = useContext(WorkoutContext);


    const addSeconds = (seconds?:number) => {

        setSeconds(prevSeconds => {
            let newSeconds = prevSeconds + (seconds || 10);
            console.log
            if(newSeconds > 3600)
                newSeconds = 3600
            return newSeconds;
        });
    }
    
    const removeSeconds = (seconds?:number) => {

        setSeconds(prevSeconds => {
            let newSeconds = prevSeconds - (seconds || 10);
            if(newSeconds <= 1){
                newSeconds=1;
                //setSeconds(1);
                EventRegister.emit('closeModal');
                workoutContext.setCurrentComponent(WorkoutComps.Exercise);
            }
            return newSeconds;
        });
    }

    return (
        <>  
            <CountdownCircleTimer
                isPlaying
                duration={Seconds}
                colors='#6405FF'
                size = {size}
                onUpdate={(remainingTime) => {
                    if(remainingTime == 3)
                        playSound('countdown.mp3')
                }}
                onComplete={() => {


                    setSeconds(0);
                    EventRegister.emit('closeModal');
                    workoutContext.setCurrentComponent(WorkoutComps.Exercise);
                }}
            >
                {({remainingTime}) => <BigLabel style={{fontSize:size*0.25}}text={formateTime(remainingTime)}/>}
            </CountdownCircleTimer>

            <View style={[styles.rowContainer, {justifyContent:'space-between', width:'80%'}]}>
                <CircularButton
                    onPress={() => { 
                        removeSeconds();       
                    }}
                    color={colors.primary}
                    iconName='minus-thick'
                    iconStyle={{fontWeight:'bold'}}
                    style={{width:64, height:64}}
                />
                
                <CircularButton
                    onPress={() => {
                        addSeconds();
                    }}
                    color={colors.primary}
                    iconName='plus-thick'
                    iconStyle={{fontWeight:'bold'}}
                    style={{width:64, height:64}}
                />
            </View>
        </>

    )
}
