import React, { useState, useEffect, createContext, useContext, useRef } from 'react';
import { WorkoutExerciseComp } from '../components/workoutScreenComps/WorkoutExerciseComp';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamsMain } from '../navigator/MainStack';
import { HeaderBar } from '../components/HeaderBar';
import { HeaderType, WorkoutComps, Modifications, Change } from '../enums/Enums';
import { WorkoutRestComp } from '../components/workoutScreenComps/WorkoutRestComp';
import { WorkoutTimerComp } from '../components/workoutScreenComps/WorkoutTimerComp';
import { TemporaryWorkoutExercise } from '../database/classes/WorkoutExercise';
import { BaseExercise } from '../database/classes/BaseExercise';
import { getTimeBetweenDates } from '../helpers/getTimeBetweenDates';
import { ExerciseVoiceCommands, RestVoiceCommands, CountDownVoiceCommands } from '../components/VoiceCommands';
import { deleteHotWordManager, detectionCallback, startSearchingHotWord, stopSearchingHotWord } from '../helpers/hotWordManager';
import { SettingsContext } from '../contexts/SettingsContext';
import { EventRegister } from 'react-native-event-listeners';
import { getTTSState, stopTextToSpeech, textToSpeech } from '../helpers/textToSpeech';
import { getTimeText } from '../helpers/getTimeText';
import { AudioResponeses } from '../data/AudioText';
import { MovementDetector } from '../components/MovementDetector';
import { recordAudioPermission, recordNotificationPermission } from '../helpers/permissions';
import { notificationHandler, clearNotification } from '../helpers/notificactionsManager';
import { Strings } from '../data/Strings';

export const WorkoutContext = createContext({
    setCurrentComponent: (comp:WorkoutComps) => {},
    changeWorkoutExercise: (change:Change) =>{},
    removeSet: (number:number) =>{},
    addSet: (number:number) =>{},
    removeRep: (number:number) =>{},
    addRep: (number:number) =>{},
    finishWorkout:() => {},
    skipExercise: () => {},
});


type Props = StackScreenProps<RootStackParamsMain, 'WorkoutScreen'>;

export const WorkoutScreen = ({route, navigation}:Props) => {

    let startSearchingListener: any;
    let stopSearchingListener: any;
    let sendNotificationListener: any;
    let cancelNotificationListener: any;
    let cancelAudioWorkout: any;
    let notificationInterval: number;
    const interactionTimeOut = useRef(0);
    const interactionResponseTimeOut = useRef(0);

    const settingsContext = useContext(SettingsContext);
   
    const baseWorkout = route.params;
    const name = baseWorkout.name;

    const initialDate = useState(new Date())[0];

    const initialWorkoutExercises = baseWorkout.workoutExercises.map( item => {
        return new TemporaryWorkoutExercise(item);
    });
    
    const WorkoutExercises = useState(initialWorkoutExercises)[0]
    const [ExerciseIndex, setExerciseIndex] = useState(0);
    const [ExerciseSetIndex, setExerciseSetIndex] = useState(0);
    const [RepsPerSet, setRepsPerSet] = useState(WorkoutExercises[ExerciseIndex].repsPerSet.slice());
    const [RestTime, setRestTime] = useState(WorkoutExercises[ExerciseIndex].restBetweenSets);
    const [CurrentComp, setCurrentComp] = useState(WorkoutComps.Exercise);
    const [CurrentBaseExercise, setCurrentBaseExercise] = useState(WorkoutExercises[ExerciseIndex].baseExercise);
    const CurrentBaseExerciseRef = useRef(WorkoutExercises[ExerciseIndex].baseExercise);
    const [RepsLabel, setRepsLabel] = useState(RepsPerSet[ExerciseSetIndex]+'');
    const [RepsLabelCopy, setRepsLabelCopy] = useState(RepsPerSet[ExerciseSetIndex]+'');
    const [SetsLabel, setSetsLabel] = useState(RepsPerSet.length+'');
    const UserWorkoutData = useState({
        baseWorkout: baseWorkout,
        userWorkoutExercises: [WorkoutExercises[ExerciseIndex]],
        modificatedExercises: [0],
        time: 0
    })[0];
    

    useEffect(() => {

        UserWorkoutData.modificatedExercises = [];
        UserWorkoutData.userWorkoutExercises = [];

        // if(settingsContext.Notifications){
        //     recordNotificationPermission().then(() => {
        //         notificationInterval = setInterval(() => {
        //             notificationHandler(Strings.activeWorkout, name + ' - ' + Strings.segsw + ': ' + getTimeText(getTimeBetweenDates(initialDate, new Date())));
        //         }, 1000);
        //     });
        // }

        if(settingsContext.VoiceCommands){
            recordAudioPermission().then(() => {
                startSearchingHotWord();
            }) 
        }

        if(settingsContext.AudioWorkout){

            let unit:any;
            WorkoutExercises[ExerciseIndex].timeExercise ? unit = ' segundos' : unit = ' repeticiones'

            textToSpeech(AudioResponeses.firstExercise + CurrentBaseExerciseRef.current.name +
                AudioResponeses.execution + CurrentBaseExerciseRef.current.workoutDescription +
                ' . '+ AudioResponeses.toDo + WorkoutExercises[ExerciseIndex].repsPerSet.length + AudioResponeses.sets +
                '. '+ AudioResponeses.first +WorkoutExercises[ExerciseIndex].repsPerSet[0]+unit
            );

            setInteractionTimeOut(WorkoutComps.Exercise);
        }

        //Listeners para activar o desactivar la hotword desde los ajustes o ayuda
        startSearchingListener = EventRegister.addEventListener('startSearching', () => {
            startSearchingHotWord()
        });
        stopSearchingListener = EventRegister.addEventListener('stopSearching', () => {
            stopSearchingHotWord();
        });
        // sendNotificationListener = EventRegister.addEventListener('sendNotification', () => {
        //     clearInterval(notificationInterval);
        //     notificationInterval = setInterval(() => {
        //         notificationHandler(Strings.activeWorkout, name + ' - ' + Strings.segsw + ': ' + getTimeText(getTimeBetweenDates(initialDate, new Date())));
        //     }, 1000);
        // });
        cancelNotificationListener = EventRegister.addEventListener('cancelNotification', () => {
            clearInterval(notificationInterval);
            clearNotification();
        });
        cancelAudioWorkout = EventRegister.addEventListener('cancelAudioWorkout', () => {
            clearTimeout(interactionResponseTimeOut.current);
            clearTimeout(interactionTimeOut.current);
        });

        return () => {
            if(settingsContext.AudioWorkout)
                stopTextToSpeech();
            stopSearchingHotWord();
            deleteHotWordManager();
            clearInterval(notificationInterval);
            clearNotification();
            clearTimeout(interactionResponseTimeOut.current);
            clearTimeout(interactionTimeOut.current);
            EventRegister.removeEventListener(startSearchingListener);
            EventRegister.removeEventListener(stopSearchingListener);
            EventRegister.removeEventListener(sendNotificationListener);
            EventRegister.removeEventListener(cancelNotificationListener);
            EventRegister.removeEventListener(cancelAudioWorkout);
        };

    }, [UserWorkoutData]);

    const removeSet = (number:number) => {
        let finalLenght = RepsPerSet.length - number;
        if(finalLenght < ExerciseSetIndex + 1)
            finalLenght = ExerciseSetIndex + 1;
        RepsPerSet.length = finalLenght;
        setSetsLabel(RepsPerSet.length+'');
        
        
    }

    const addSet = (number:number) => {

        for(let i = 0; i<number && RepsPerSet.length<99; i++){
            RepsPerSet.push(RepsPerSet[RepsPerSet.length-1]);
            setSetsLabel(RepsPerSet.length+'');
        }
    }

    const removeRep = (number:number) => {
        RepsPerSet[ExerciseSetIndex] -= number;
        if(RepsPerSet[ExerciseSetIndex] < 0)
            RepsPerSet[ExerciseSetIndex] = 0;

        setRepsLabel(RepsPerSet[ExerciseSetIndex]+'');
        
    }

    const addRep = (number:number) => {
        RepsPerSet[ExerciseSetIndex] += number;
        if(RepsPerSet[ExerciseSetIndex]>99)
            RepsPerSet[ExerciseSetIndex]=99;
        setRepsLabel(RepsPerSet[ExerciseSetIndex]+'');
        
    }
    
    const getEasierExercise = (baseExercise:BaseExercise) => {
        let newBaseExercise:any;
        if(baseExercise.easierOptions.length > 0){
            let index = Math.floor(Math.random()*baseExercise.easierOptions.length)
            newBaseExercise = baseExercise.easierOptions[index];
            WorkoutExercises[ExerciseIndex].baseExercise = newBaseExercise;
        } else {
            newBaseExercise = baseExercise;
        }
        return newBaseExercise;
        
    }
    const getEqualExercise = (baseExercise:BaseExercise) => {
        let newBaseExercise:any;
        if(baseExercise.equalOptions.length > 0){
            let index = Math.floor(Math.random()*baseExercise.equalOptions.length)
            newBaseExercise = baseExercise.equalOptions[index]
            WorkoutExercises[ExerciseIndex].baseExercise = newBaseExercise;
        } else {
            newBaseExercise = baseExercise;
        }
        return newBaseExercise;
        
    }
    const getHarderExercise = (baseExercise:BaseExercise) => {
        let newBaseExercise:any;
        if(baseExercise.harderOptions.length > 0){
            let index = Math.floor(Math.random()*baseExercise.harderOptions.length)
            newBaseExercise = baseExercise.harderOptions[index];
            WorkoutExercises[ExerciseIndex].baseExercise = newBaseExercise;
        } else {
            newBaseExercise = baseExercise;
        }
        return newBaseExercise;
        
    }

    const changeWorkoutExercise = (change:Change) => {

        WorkoutExercises[ExerciseIndex].repsPerSet = RepsPerSet.slice();
        WorkoutExercises[ExerciseIndex].repsPerSet.length = ExerciseSetIndex;
        UserWorkoutData.userWorkoutExercises.push({...WorkoutExercises[ExerciseIndex]});
        UserWorkoutData.modificatedExercises.push(Modifications.Changed);
        setCurrentBaseExercise(prevState => {

            let newBaseExercise:any;

            switch (change) {
                case Change.Easier:
                    newBaseExercise = getEasierExercise(prevState);
                    break;
                case Change.Equal:
                    newBaseExercise = getEqualExercise(prevState);
                    break;
                case Change.Harder:
                    newBaseExercise = getHarderExercise(prevState);
                    break;
            
                default:
                    break;
            }
            
            CurrentBaseExerciseRef.current = newBaseExercise;
            return newBaseExercise
            
        });
        
        setExerciseSetIndex(0);
        setSetsLabel(RepsPerSet.length+'');
        setRepsLabel(RepsPerSet[ExerciseSetIndex]+'');
    }

    const skipExercise = () => {
        WorkoutExercises[ExerciseIndex].repsPerSet = RepsPerSet.slice();
        WorkoutExercises[ExerciseIndex].repsPerSet.length = ExerciseSetIndex;
        UserWorkoutData.userWorkoutExercises.push({...WorkoutExercises[ExerciseIndex]});
        UserWorkoutData.modificatedExercises.push(Modifications.Skipped);
        
        if(WorkoutExercises.length <= ExerciseIndex + 1) {
            endAndNavigate();
        } else {
            setCurrentComponent(WorkoutComps.Rest, true);
        }
    }

    const finishWorkout = () => {

        if(!(CurrentComp == WorkoutComps.Rest && RepsPerSet.length - 1 == ExerciseSetIndex)){
         
            if(WorkoutExercises[ExerciseIndex].repsPerSet.length != ExerciseSetIndex + 1 
                || WorkoutExercises[ExerciseIndex].repsPerSet.toString() != RepsPerSet.toString()){

                WorkoutExercises[ExerciseIndex].repsPerSet = RepsPerSet.slice();
                WorkoutExercises[ExerciseIndex].repsPerSet.length = ExerciseSetIndex;
    
                UserWorkoutData.modificatedExercises.push(Modifications.Modified);
            } else {
                UserWorkoutData.modificatedExercises.push(Modifications.Unmodified);
            }
    
            UserWorkoutData.userWorkoutExercises.push(WorkoutExercises[ExerciseIndex]);
        }
        endAndNavigate();
    }

    const endAndNavigate = () => {
    
        clearInterval(notificationInterval);
        clearNotification();
        stopSearchingHotWord();
        UserWorkoutData.time = getTimeBetweenDates(initialDate, new Date());
        EventRegister.emit('unsubscribePrevent');
        navigation.navigate('WorkoutCompletedScreen', UserWorkoutData);
    }

    const setInteractionTimeOut = (comp:WorkoutComps) => {

        let intervalTime = 60000;
        if(WorkoutExercises[ExerciseIndex].timeExercise){
            intervalTime += WorkoutExercises[ExerciseIndex].repsPerSet[ExerciseSetIndex]*1000;
        }
        
        if(comp == WorkoutComps.Exercise){
            interactionTimeOut.current = setTimeout(() => {
                if(!getTTSState()){//Si no esta hablando
                    textToSpeech(AudioResponeses.exerciseInteraction);
                    interactionResponseTimeOut.current = setTimeout(() => {
                        EventRegister.emit('setInteractionState');
                        detectionCallback(0);
                    }, 4500);    
                }
            }, intervalTime);
        } else {
            clearTimeout(interactionResponseTimeOut.current);
            clearTimeout(interactionTimeOut.current);
        }
    }

    const setCurrentComponent = (comp:WorkoutComps, skip?:boolean) => {

        skip = skip || false;

        if(settingsContext.AudioWorkout)
            setInteractionTimeOut(comp);
       
        if(CurrentComp == WorkoutComps.Exercise && comp === WorkoutComps.Rest){ //Al pasar de ejercicio a descanso

            if(RepsPerSet.length > ExerciseSetIndex + 1 && !skip) { //Cambio de set
                if(ExerciseSetIndex == 0)//si es el primer set
                    setRestTime(WorkoutExercises[ExerciseIndex].restBetweenSets);

                setExerciseSetIndex(ExerciseSetIndex + 1);
                //AUDIO WORKOUT
                if(settingsContext.AudioWorkout){
                    textToSpeech(AudioResponeses.rest + getTimeText(WorkoutExercises[ExerciseIndex].restBetweenSets, true));
                }

            } else if(WorkoutExercises.length > ExerciseIndex + 1){//cambio de ejercicio
                
                if(!skip) {
                    console.log(WorkoutExercises[ExerciseIndex].repsPerSet.toString(), RepsPerSet.toString())
                    if(WorkoutExercises[ExerciseIndex].repsPerSet.toString() == RepsPerSet.toString())
                        UserWorkoutData.modificatedExercises.push(Modifications.Unmodified);
                    else
                        UserWorkoutData.modificatedExercises.push(Modifications.Modified);

                    WorkoutExercises[ExerciseIndex].repsPerSet = RepsPerSet.slice();
                    UserWorkoutData.userWorkoutExercises.push({...WorkoutExercises[ExerciseIndex]});
                }

                setRestTime(baseWorkout.restBetweenExercises);
                setCurrentBaseExercise(WorkoutExercises[ExerciseIndex+1].baseExercise);
                CurrentBaseExerciseRef.current = WorkoutExercises[ExerciseIndex+1].baseExercise;
                
                setExerciseIndex(ExerciseIndex+1);
                setExerciseSetIndex(0);
                setRepsPerSet(WorkoutExercises[ExerciseIndex+1].repsPerSet);

                //AUDIO WORKOUT
                if(settingsContext.AudioWorkout){
                    textToSpeech(AudioResponeses.rest+getTimeText(baseWorkout.restBetweenExercises, true)+'. '+ AudioResponeses.nextExercise + CurrentBaseExerciseRef.current.name + AudioResponeses.execution + CurrentBaseExerciseRef.current.workoutDescription+
                    ' . '+ AudioResponeses.toDo +WorkoutExercises[ExerciseIndex+1].repsPerSet.length + AudioResponeses.sets)
                }
            }
        } else if (CurrentComp == WorkoutComps.Rest && comp === WorkoutComps.Exercise && settingsContext.AudioWorkout){//Al pasar al descanso AUDIO WORKOUT
            let unit:any;
            WorkoutExercises[ExerciseIndex].timeExercise ? unit = AudioResponeses.seconds : unit = AudioResponeses.reps;
            textToSpeech(AudioResponeses.do + RepsPerSet[ExerciseSetIndex]+unit + AudioResponeses.of + CurrentBaseExerciseRef.current.name);
        }
        setRepsLabelCopy(RepsPerSet[ExerciseSetIndex]+'');
        setSetsLabel(RepsPerSet.length+'');
        setRepsLabel(RepsPerSet[ExerciseSetIndex]+'');

        setCurrentComp(comp);
        //CurrentCompRef.current = comp;
    }

    return (
        
        <WorkoutContext.Provider 
            value={{
                skipExercise, finishWorkout, setCurrentComponent, changeWorkoutExercise, removeSet, addSet, removeRep, addRep,
            }}
        >

            <HeaderBar
                text={name}
                headerType={HeaderType.Workout}      
            />
            {CurrentComp == WorkoutComps.Exercise && 
                <WorkoutExerciseComp
                    repsPerSet = {RepsPerSet}
                    exerciseSetIndex = {ExerciseSetIndex}
                    workoutExercises = {WorkoutExercises}
                    exerciseIndex = {ExerciseIndex}
                    sets = {SetsLabel}
                    reps = {RepsLabel}
                    initialReps = {RepsLabelCopy+''}
                />   
            }
            
            {CurrentComp == WorkoutComps.Rest && CurrentBaseExercise &&
                <WorkoutRestComp
                    nextExercise={CurrentBaseExercise.name}
                    restTime={RestTime}
                /> 
            }
            {CurrentComp == WorkoutComps.CountDown && 
                <WorkoutTimerComp
                    seconds={WorkoutExercises[ExerciseIndex].repsPerSet[ExerciseSetIndex]}
                /> 
                //cuando esten los ajustes habrá que ver si renderizr
            }
            {settingsContext.VoiceCommands && 
                <>
                    {CurrentComp == WorkoutComps.Exercise && 
                        <ExerciseVoiceCommands
                            currentBaseExercise={CurrentBaseExerciseRef} 
                            timeExercise={WorkoutExercises[ExerciseIndex].timeExercise}   
                            lastSet={WorkoutExercises.length <= ExerciseIndex + 1 && RepsPerSet.length <= ExerciseSetIndex + 1}         
                        />
                    }
                    {CurrentComp == WorkoutComps.Rest  &&
                        <RestVoiceCommands
                            currentBaseExercise={CurrentBaseExerciseRef} 
                        />
                    }
                    {CurrentComp == WorkoutComps.CountDown  &&
                        <CountDownVoiceCommands/>
                    }
                </>
            }
            {
                CurrentComp == WorkoutComps.Exercise && !WorkoutExercises[ExerciseIndex].timeExercise && settingsContext.MovementDetection &&
                    <MovementDetector/>
            }
            
        </WorkoutContext.Provider>
    )
}
