import React, {useEffect, useState, useRef, useContext} from 'react'
import { accelerometer, setUpdateIntervalForType, SensorTypes  } from "react-native-sensors";
import { SettingsContext } from '../contexts/SettingsContext';
import { getTTSState, textToSpeech } from '../helpers/textToSpeech';
import { WorkoutContext } from '../screens/WorkoutScreen';
import { AudioResponeses } from '../data/AudioText';


export const MovementDetector = () => {

    setUpdateIntervalForType(SensorTypes.accelerometer, 200);
    const setAcceleration = useState([9, 9])[1];
    const setReps = useState(0)[1];
    const toggle = useRef(true);
    const activityTimeOut = useRef(0);

    const settingsContext = useContext(SettingsContext);
    const workoutContext = useContext(WorkoutContext);



    const askForActivity = () => {
        clearTimeout(activityTimeOut.current);

        if(settingsContext.AudioWorkout){
            activityTimeOut.current = setTimeout(() => {
                if(!getTTSState())
                    textToSpeech(AudioResponeses.askForActivity);
            }, 30000);
        }
    } 

    useEffect(() => {
            
        workoutContext.removeRep(99);
    
        askForActivity();

        const subscription = accelerometer.subscribe(({x, y, z}) => {
           
            setAcceleration(prevState => {

                let acelerando = false;
                let frenando = false;

                prevState.forEach(element => {
                    if(element > 12)
                        acelerando = true

                    if(acelerando && element<8){
                        frenando = true
                    }
                });

                let realPrev = prevState.slice();
                prevState.shift();
                prevState.push(Math.max(Math.abs(x), Math.abs(y), Math.abs(z)));

                if(acelerando && frenando && toggle.current && prevState != realPrev){
                    prevState = [9, 9];
                    
                    workoutContext.addRep(1);
                    setReps(prevState => {
                        if(settingsContext.AudioWorkout){
                            textToSpeech((prevState + 1) + '');
                            askForActivity();
                        }
                        return prevState + 1
                    });
                    toggle.current = false;

                } else {
                    toggle.current = true;
                }

                return prevState;
            });
        });

    
        return () => {
            clearTimeout(activityTimeOut.current);
            subscription.unsubscribe();
        }
    }, []);
    
    return ( 
        <>
        </>
    )
}
