import React, { useEffect, useContext, useState, useRef } from 'react';
import { WorkoutComps, Change } from '../enums/Enums';
import { BaseExercise } from '../database/classes/BaseExercise';
import Voice from '@react-native-voice/voice';
import { VoiceCommand } from '../data/VoiceCommandsText';
import { WorkoutContext } from '../screens/WorkoutScreen';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamsMain } from '../navigator/MainStack';
import { View } from 'react-native';
import { colors,styles } from '../theme/style';
import { startSearchingHotWord, porcupineManager, detectionCallback } from '../helpers/hotWordManager';
import { EventRegister } from 'react-native-event-listeners'
import { Subtitle, BaseText } from './Texts';
import { getNumberAndUnitFromSpeech } from '../helpers/getNumberAndUnitFromSpeech';
import { AudioResponeses } from '../data/AudioText';
import { textToSpeech, stopTextToSpeech } from '../helpers/textToSpeech';
import { Strings } from '../data/Strings';
import {StyleSheet} from 'react-native';
import CIcon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props{
    currentBaseExercise:React.MutableRefObject<BaseExercise>,
    timeExercise?: boolean,
    lastSet?: boolean,
}

const defaultResponse = () => {
    textToSpeech(AudioResponeses.default);
}
const notAvailable = () => {
    textToSpeech(AudioResponeses.notAvailable);
}

//GENERAL FUNCTIONS FROM EXERCISE, REST AND COUNTDOWN

const help = (goBack:React.MutableRefObject<boolean>, navigation:RootStackParamsMain) => {
    if(!goBack.current){
        navigation.navigate('Help');
        goBack.current = true;
        textToSpeech(AudioResponeses.help);
    } else {
        textToSpeech(AudioResponeses.notHelp);
    }
}
const finishWorkout = (goBack:React.MutableRefObject<boolean>, finish:React.MutableRefObject<boolean>,navigation:RootStackParamsMain, wC?:any, lastSet?: Boolean, ) => {
    if(lastSet != undefined && lastSet){
        textToSpeech(AudioResponeses.finishWorkout);
        wC.finishWorkout();
    } else if(!goBack.current && !finish.current){
        finish.current = true;
        textToSpeech(AudioResponeses.saveDontOrCancel);
        setTimeout(() => {
            detectionCallback(0);
            setTimeout( async () => {
                finish.current = false;    
            }, 5000);
        }, 3000);
    } else {
        textToSpeech(AudioResponeses.notAvailableTryOther);
    }
}
const save = (finish:React.MutableRefObject<boolean>, wC:any) => {
    if(finish.current){
        EventRegister.emit('closeModal');
        textToSpeech(AudioResponeses.saving);
        wC.finishWorkout();
    } else {
        textToSpeech(AudioResponeses.cantSave);
    }
}
const dontSave = ( finish:React.MutableRefObject<boolean>, navigation:RootStackParamsMain) => {
    if(finish.current){
        EventRegister.emit('unsubscribePrevent');
        EventRegister.emit('closeModal');
        textToSpeech(AudioResponeses.dontSaving);
        navigation.navigate('Home');
    } else
        textToSpeech(AudioResponeses.cantDontSaving);
}
const cancel = (finish:React.MutableRefObject<boolean>) => {
    if(finish.current){
        finish.current = false;
        textToSpeech(AudioResponeses.canceling);
    } else {
        textToSpeech(AudioResponeses.cantCancel);
    }
}
const back = (goBack:React.MutableRefObject<boolean>, navigation:RootStackParamsMain) => {
    if(goBack.current){
        navigation.goBack();
        goBack.current = false;
        textToSpeech(AudioResponeses.goingBack);
    } else {
        textToSpeech(AudioResponeses.cantGoBack);
    }
}

//REST AND EXERCISE
const next = (wC:any, workoutComp: WorkoutComps, lastSet?: Boolean) => {

    if(lastSet != undefined && lastSet){
        textToSpeech(AudioResponeses.finishWorkout);
        wC.finishWorkout();
    } else {
        textToSpeech(AudioResponeses.next);
        wC.setCurrentComponent(workoutComp);
    }
}

const technique = (goBack:React.MutableRefObject<boolean>, navigation:RootStackParamsMain, currentBaseExercise:BaseExercise) => {

    if(!goBack.current){
        textToSpeech(AudioResponeses.thecnique+currentBaseExercise.name+'. '+currentBaseExercise.workoutDescription);
        navigation.navigate('ExerciseDetailScreen', currentBaseExercise)
        goBack.current = true;
    }
}

//REST AND COUNTDOWN
const addTime = (speech:string) => {

    const time = getNumberAndUnitFromSpeech(speech);

    if(time!=null){
        if(time.unit == AudioResponeses.minute ||  time.unit == AudioResponeses.minutes || time.unit == AudioResponeses.second ||time.unit == AudioResponeses.seconds){

            textToSpeech(AudioResponeses.adding+time.total+' '+time.unit);
    
            if(time.unit == AudioResponeses.minute || time.unit == AudioResponeses.minutes){
                time.total = time.total * 60;
            }
            EventRegister.emit('addSeconds', time.total);
        } else {
            notAvailable();
        }
    } else {
        defaultResponse();
    }
}   
const removeTime = (speech:string) => {

    const time = getNumberAndUnitFromSpeech(speech);

    if(time!=null){
        if(time.unit == AudioResponeses.minute ||  time.unit == AudioResponeses.minutes || time.unit == AudioResponeses.second ||time.unit == AudioResponeses.seconds){
            textToSpeech(AudioResponeses.removing+time.total+' '+time.unit);
            if(time.unit == AudioResponeses.minute || time.unit == AudioResponeses.minutes){
                time.total = time.total * 60;
            }
            EventRegister.emit('removeSeconds', time.total);
        } else {
            notAvailable();
        }
    } else {
        defaultResponse();
    }
}

const playVideo = (goBack:boolean) => {

    if(goBack){
        EventRegister.emit('playVideo');
        textToSpeech(AudioResponeses.startVideo);
    } else {
        notAvailable();
    }
}

const stopVideo = (goBack:boolean) => {

    if(goBack){
        EventRegister.emit('stopVideo');
        textToSpeech(AudioResponeses.stopVideo);
    } else {
        notAvailable();
    }
}
 

export const ExerciseVoiceCommands = ({currentBaseExercise, timeExercise, lastSet}:Props) => {
    
    let startRecognitionlistener: any;
    let goingBackListener: any;
    let interactionStateListener: any;
    const wC = useContext(WorkoutContext);
    const navigation = useNavigation<RootStackParamsMain>();
    const [Display, setDisplay] = useState(false);
    const [Text, setText] = useState('');
    const goBack = useRef(false);
    const finish = useRef(false);
    const interactionState = useRef(false);
    
    useEffect(() => {
        Voice.onSpeechResults = onSpeechResults;
        Voice.onSpeechEnd = onSpeechEnd;
        Voice.onSpeechPartialResults = onSpeechPartialResults;
   
        startRecognitionlistener = EventRegister.addEventListener('startRecognition', () => {
            startRecognition();
        });
        goingBackListener = EventRegister.addEventListener('goingBack', () => {
            goBack.current = false;
        });
        interactionStateListener = EventRegister.addEventListener('setInteractionState', () => {
            interactionState.current = true;
        });
   
        return () => {
            Voice.destroy().then(Voice.removeAllListeners);
            EventRegister.removeEventListener(startRecognitionlistener);
            EventRegister.removeEventListener(goingBackListener);
            EventRegister.removeEventListener(interactionStateListener);
            console.log('EXERCISE OUT')
        };

    }, []);

    const onSpeechPartialResults = (e:any) => {
        setText(e.value[0]);
    }

    const startRecognition = async () => {

        setDisplay(true);
        setText('');
        stopTextToSpeech();
        await Voice.start('es-ES');

        setTimeout( async () => {
            if(!porcupineManager._voiceProcessor._recording)
                await startSearchingHotWord()

            setDisplay(false);
            setText('');
            
        }, 5000)
    }

    const onSpeechEnd = async () => {
        if(!porcupineManager._voiceProcessor._recording)
            await startSearchingHotWord()
    }

    const onSpeechResults = (e:any) => {

        let speech = e.value[0].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");//Visto en https://desarrolloweb.com/faq/la-mejor-manera-de-eliminar-tildes-o-acentos-en-javascript
        console.log(speech)

        setText(speech);

        if(interactionState.current){

            switch (true) {
        
                case speech.includes(VoiceCommand.good):
                    good();
                    break;
        
                case speech.includes(VoiceCommand.bad):
                    bad();
                    break;

                default:
                    interactionState.current = false;
                    defaultResponse();
                    break;
                }

        } else {

            switch (true) {
        
                case speech.includes(VoiceCommand.skipExercise):
                    skipExercise();
                    break;
        
                case speech.includes(VoiceCommand.changeEasier):
                    changeEasier();
                    break;
        
                case speech.includes(VoiceCommand.changeEqual):
                    changeEqual();
                    break;
        
                case speech.includes(VoiceCommand.changeHarder):
                    changeHarder();
                    break;
        
                case speech.includes(VoiceCommand.countdown):
                case speech.includes(VoiceCommand.start):
                    startCountDown();
                    break;
        
                    
                case speech.includes(VoiceCommand.add):
                case speech.includes(VoiceCommand.addAlt):
                    addSetsOrReps(speech);
                    break;
                        
                case speech.includes(VoiceCommand.remove):
                case speech.includes(VoiceCommand.removeAlt):
                    removeSetsOrReps(speech);
                    break;
    
                case speech.includes(VoiceCommand.next):
                    next(wC, WorkoutComps.Rest, lastSet);
                    break;
                            
                case speech.includes(VoiceCommand.technique):
                    technique(goBack, navigation, currentBaseExercise.current);
                    break;
    
                case speech.includes(VoiceCommand.help):
                    help(goBack, navigation);
                    break;
    
                case speech.includes(VoiceCommand.finish):
                    finishWorkout(goBack, finish, navigation, wC, lastSet);
                    break;
    
                case speech.includes(VoiceCommand.save):
                    save(finish, wC);
                    break;
        
                case speech.includes(VoiceCommand.dontSave):
                    dontSave(finish, navigation);
                    break;
    
                case speech.includes(VoiceCommand.cancel):
                    cancel(finish);
                    break;
    
                case speech.includes(VoiceCommand.back):
                    back(goBack, navigation);
                    break;

                case speech.includes(VoiceCommand.startVideo):
                case speech.includes(VoiceCommand.playVideo):
                    playVideo(true);
                    break;

                case speech.includes(VoiceCommand.stopVideo):
                    stopVideo(true);
                    break;
    
                case speech.includes(VoiceCommand.skipRest):
                case speech.includes(VoiceCommand.skipCount):
                case speech.includes(VoiceCommand.skipCountDown):
                    notAvailable();
                    break;
                    
                default:
                    defaultResponse();
                break;
            }
        }


        if(finish.current && !speech.includes(VoiceCommand.finish)){
            finish.current = false;
        }

    }

    

    const skipExercise = () => {
        textToSpeech(AudioResponeses.skippingExercise);
        wC.skipExercise();
    }
    const changeEasier = () => {
        if(currentBaseExercise.current.easierOptions.length > 0){
            wC.changeWorkoutExercise(Change.Easier);
            textToSpeech(AudioResponeses.changingExercise+currentBaseExercise.current.name);
        }
        else
            textToSpeech(AudioResponeses.notEasierExercises);
    }
    const changeEqual = () => {
        if(currentBaseExercise.current.equalOptions.length > 0){
            wC.changeWorkoutExercise(Change.Equal);
            textToSpeech(AudioResponeses.changingExercise+currentBaseExercise.current.name);
        }
        else
            textToSpeech(AudioResponeses.notEqualExercises);
       
    }
    const changeHarder = () => {
        
        if(currentBaseExercise.current.harderOptions.length > 0){
            wC.changeWorkoutExercise(Change.Harder);
            textToSpeech(AudioResponeses.changingExercise+currentBaseExercise.current.name);
        }
        else
            textToSpeech(AudioResponeses.notHarderExercises);
    
    }
    const startCountDown = () => {
        if(timeExercise) {
            textToSpeech(AudioResponeses.countDownStarted);
            wC.setCurrentComponent(WorkoutComps.CountDown);
        } else {
            textToSpeech(AudioResponeses.cantCountDown);
        }
    }
    
    const addSetsOrReps = (speech: string) => {
        //falta comprobar queno se puedanm añarid mas series
        const number = getNumberAndUnitFromSpeech(speech);

        if(number!=null){
    
            if((!timeExercise && (number.unit == AudioResponeses.rep || number.unit == AudioResponeses.reps))||(timeExercise && (number.unit == AudioResponeses.second || number.unit == AudioResponeses.seconds))){
                textToSpeech(AudioResponeses.tryingToAdd+number.total+' '+number.unit);
                wC.addRep(number.total);
                
            } else if( number.unit == AudioResponeses.set || number.unit == AudioResponeses.sets ){
                
                if(number.total > 10){
                    number.total = 10;
                    textToSpeech(AudioResponeses.tryingToAdd+number.total+' '+number.unit+AudioResponeses.cantAddMore);
                } else {
                    textToSpeech(AudioResponeses.tryingToAdd+number.total+' '+number.unit);
                }
                
                wC.addSet(number.total); 
            } else {
                notAvailable();
            }
        } else {
            defaultResponse();
        }
    }
    const removeSetsOrReps = (speech: string) => {
        const number = getNumberAndUnitFromSpeech(speech);

        if(number!=null){
    
            if((!timeExercise && (number.unit == AudioResponeses.rep || number.unit == AudioResponeses.reps))||(timeExercise && (number.unit == AudioResponeses.second || number.unit == AudioResponeses.seconds))){
                textToSpeech(AudioResponeses.tryingToRemove+number.total+' '+number.unit);
                wC.removeRep(number.total);
            } else if( number.unit == AudioResponeses.set || number.unit == AudioResponeses.sets ){
                textToSpeech(AudioResponeses.tryingToRemove+number.total+' '+number.unit);
                wC.removeSet(number.total);
            } else {
                notAvailable();
            }
        } else {
            defaultResponse();
        }
    }

    const good = () => {
        textToSpeech(AudioResponeses.good);
        interactionState.current = false;
    }

    const bad = () => {
        if(currentBaseExercise.current.easierOptions.length > 0){
            textToSpeech(AudioResponeses.badWithOptions);
            setTimeout(() => {
                changeEasier();
            }, 3000);
        } else {
            textToSpeech(AudioResponeses.badWithoutOptions);
            interactionState.current = false;
        }
    }
   


    return (
       <>
        {Display && 
            <View style={lStyles.fullScreen}>
                <View style={styles.backgroundModal}/>
                <View style={styles.centerModal}>
                    <View style={styles.modalContainer}>
                        <Subtitle
                            text={Strings.speak}
                        />
                        <CIcon
                            name='microphone'
                            size={48}
                            color={colors.primary}
                        />
                        <BaseText
                            text={Text}
                            lines={1}
                        />
                    </View>
                </View>
            </View>
        }
       </>
    )
}


export const RestVoiceCommands = ({currentBaseExercise}:Props) => {
    
    let listener: any;
    let listener1: any;
    const wC = useContext(WorkoutContext);
    const navigation = useNavigation<RootStackParamsMain>();  
    const [Display, setDisplay] = useState(false);
    const [Text, setText] = useState('');
    const goBack = useRef(false);
    const finish = useRef(false);
    
    useEffect(() => {
        Voice.onSpeechResults = onSpeechResults;
        Voice.onSpeechEnd = onSpeechEnd;
        Voice.onSpeechPartialResults = onSpeechPartialResults;
        
        listener = EventRegister.addEventListener('startRecognition', (data) => {
            startRecognition();
        });

        listener1 = EventRegister.addEventListener('goingBack', (data) => {
            goBack.current = false;
        });
   
        return () => {
            Voice.destroy().then(Voice.removeAllListeners);
            EventRegister.removeEventListener(listener);
            EventRegister.removeEventListener(listener1);
            console.log('REST OUT')
        };

    }, []);

    const onSpeechPartialResults = (e:any) => {
        setText(e.value[0]);
    }

    const startRecognition = async () => {
        
        setDisplay(true);
        setText('');
        stopTextToSpeech();
        await Voice.start('es-ES');


        setTimeout( async () => {
            if(!porcupineManager._voiceProcessor._recording)
                await startSearchingHotWord()

            setDisplay(false);
            setText('');
            
        }, 5000)
    }
    const onSpeechEnd = async () => {
        if(!porcupineManager._voiceProcessor._recording)
            await startSearchingHotWord()
    }

    const onSpeechResults = (e:any) => {

        let speech = e.value[0]= e.value[0].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        console.log(speech)

        switch (true) {
            
    
            case speech.includes(VoiceCommand.skipRest):
                skipRest();
                break;
                
            case speech.includes(VoiceCommand.add):
            case speech.includes(VoiceCommand.addAlt):
                addTime(speech);
                break;

            case speech.includes(VoiceCommand.remove):
            case speech.includes(VoiceCommand.removeAlt):
                removeTime(speech);
                break;
    
            case speech.includes(VoiceCommand.next):
                next(wC, WorkoutComps.Exercise);
                break;
                        
            case speech.includes(VoiceCommand.technique):
                technique(goBack, navigation, currentBaseExercise.current);
                break;

            case speech.includes(VoiceCommand.help):
                help(goBack, navigation);
                break;

            case speech.includes(VoiceCommand.finish):
                finishWorkout(goBack, finish, navigation);
                break;

            case speech.includes(VoiceCommand.save):
                save(finish, wC);
                break;
    
            case speech.includes(VoiceCommand.dontSave):
                dontSave(finish, navigation);
                break;

            case speech.includes(VoiceCommand.cancel):
                cancel(finish);
                break;

            case speech.includes(VoiceCommand.back):
                back(goBack, navigation);
                break;

            case speech.includes(VoiceCommand.startVideo):
            case speech.includes(VoiceCommand.playVideo):
                playVideo(goBack.current);
                break;
                
            case speech.includes(VoiceCommand.stopVideo):
                stopVideo(goBack.current);
                break;
                
            case speech.includes(VoiceCommand.skipExercise):
            case speech.includes(VoiceCommand.changeEasier):
            case speech.includes(VoiceCommand.changeEqual):
            case speech.includes(VoiceCommand.changeHarder):
            case speech.includes(VoiceCommand.countdown):
            case speech.includes(VoiceCommand.add):
            case speech.includes(VoiceCommand.remove):
            case speech.includes(VoiceCommand.skipCount):
            case speech.includes(VoiceCommand.skipCountDown):
                notAvailable();
                break;
                
            default:
                defaultResponse();
            break;
        }

        if(finish.current && !speech.includes(VoiceCommand.finish)){
            finish.current = false;
        }
    }

    const skipRest = () => {
        textToSpeech(AudioResponeses.skippingRest);
        wC.setCurrentComponent(WorkoutComps.Exercise);
    }

    return (
        <>
        {Display && 
           <View style={lStyles.fullScreen}>
                <View style={styles.backgroundModal}/>
                <View style={styles.centerModal}>
                    <View style={styles.modalContainer}>
                        <Subtitle
                            text={Strings.speak}
                        />
                        <CIcon
                            name='microphone'
                            size={48}
                            color={colors.primary}
                        />
                        <BaseText
                            text={Text}
                            lines={1}
                        />
                    </View>
                </View>
            </View>
        }
       </>
    )
}


export const CountDownVoiceCommands = () => {
    
    let listener: any;
    let listener1: any;
    const wC = useContext(WorkoutContext);
    const navigation = useNavigation<RootStackParamsMain>();
    const [Display, setDisplay] = useState(false);
    const [Text, setText] = useState('');
    const goBack = useRef(false);
    const finish = useRef(false);
    
    useEffect(() => {
        Voice.onSpeechResults = onSpeechResults;
        Voice.onSpeechEnd = onSpeechEnd;
        Voice.onSpeechPartialResults = onSpeechPartialResults;
   
        listener = EventRegister.addEventListener('startRecognition', (data) => {
            startRecognition();
        });
        listener1 = EventRegister.addEventListener('goingBack', (data) => {
            goBack.current = false;
        });
   
        return () => {
            Voice.destroy().then(Voice.removeAllListeners);
            EventRegister.removeEventListener(listener);
            EventRegister.removeEventListener(listener1);
        };

    }, []);

    const onSpeechPartialResults = (e:any) => {
        setText(e.value[0]);
    }

    const startRecognition = async () => {

        setDisplay(true);
        setText('');
        stopTextToSpeech();
        await Voice.start('es-ES');


        setTimeout( async () => {
            if(!porcupineManager._voiceProcessor._recording)
                await startSearchingHotWord()

            setDisplay(false);
            setText('');
            
        }, 5000)
    }

    const onSpeechEnd = async () => {
        if(!porcupineManager._voiceProcessor._recording)
            await startSearchingHotWord()
    }

    const onSpeechResults = (e:any) => {

        let speech = e.value[0]= e.value[0].toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        console.log(speech)

        switch (true) {
    
            case speech.includes(VoiceCommand.skipCount):
            case speech.includes(VoiceCommand.skipCountDown):
                skipCount();
                break;

            case speech.includes(VoiceCommand.add):
            case speech.includes(VoiceCommand.addAlt):
                addTime(speech);
                break;

            case speech.includes(VoiceCommand.remove):
            case speech.includes(VoiceCommand.removeAlt):
                removeTime(speech);
                break;
    
            case speech.includes(VoiceCommand.help):
                help(goBack, navigation);
                break;

            case speech.includes(VoiceCommand.finish):
                finishWorkout(goBack, finish, navigation);
                break;

            case speech.includes(VoiceCommand.save):
                save(finish, wC);
                break;
    
            case speech.includes(VoiceCommand.dontSave):
                dontSave(finish, navigation);
                break;

            case speech.includes(VoiceCommand.cancel):
                cancel(finish);
                break;

            case speech.includes(VoiceCommand.back):
                back(goBack, navigation);
                break;
            
            case speech.includes(VoiceCommand.skipExercise):
            case speech.includes(VoiceCommand.changeEasier):
            case speech.includes(VoiceCommand.changeEqual):
            case speech.includes(VoiceCommand.changeHarder):
            case speech.includes(VoiceCommand.countdown):
            case speech.includes(VoiceCommand.add):
            case speech.includes(VoiceCommand.remove):
            case speech.includes(VoiceCommand.skipRest):
                        notAvailable();
                        break;
    
            default:
                defaultResponse();
            break;
        }

        if(finish.current && !speech.includes(VoiceCommand.finish)){
            finish.current = false;
        }
        
    }

    const skipCount = () => {
        textToSpeech(AudioResponeses.skippingCountDown);
        wC.setCurrentComponent(WorkoutComps.Exercise);
    }

    return (
        <>
        {Display && 
            <View style={lStyles.fullScreen}>
                <View style={styles.backgroundModal}/>
                <View style={styles.centerModal}>
                    <View style={styles.modalContainer}>
                        <Subtitle
                            text={Strings.speak}
                        />
                        <CIcon
                            name='microphone'
                            size={48}
                            color={colors.primary}
                        />
                        <BaseText
                            text={Text}
                            lines={1}
                        />
                    </View>
                </View>
            </View>
        }
       </>
    )
}

const lStyles = StyleSheet.create({

    fullScreen:{
        position:'absolute',
        width:'100%',
        height:'100%',
        justifyContent:'center',
        alignItems:'center',

    },
});

