import { useContext, useState, useEffect, useRef } from 'react'
import React,{ View, StyleSheet, Image, Modal } from 'react-native';
import { colors, styles } from '../theme/style';
import { HeaderType, Level } from '../enums/Enums';
import { Subtitle, Title } from './Texts';
import { CircularButton, RectangularButton } from './Buttons';
import { Images } from '../data/Images';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamsMain } from '../navigator/MainStack';
import { Strings } from '../data/Strings';
import { WorkoutContext } from '../screens/WorkoutScreen';
import { BackHandler } from 'react-native';
import { EventRegister } from 'react-native-event-listeners';
import { deleteHotWordManager, stopSearchingHotWord } from '../helpers/hotWordManager';

interface Props{
    text:string,
    headerType:HeaderType,
    level?:Level
}

export const HeaderBar = ({text, headerType, level}:Props) => {

    let backButtonColor = colors.primary;

    if(level!=undefined)
        backButtonColor = colors.levelColors[level];

    const [ExitModal, setExitModal] = useState(false);
    const navigation = useNavigation<RootStackParamsMain>();
    const exit = useRef(false);

    const unsubscribeRef = useRef();

    let unsubscribelistener:any;
    let closeModalListener:any;
    useEffect(() => {
        unsubscribeRef.current = navigation.addListener('beforeRemove', (e:any) => {
            if(headerType == HeaderType.Workout && !exit.current){
                e.preventDefault();
                setExitModal(true);
            }
        });

        unsubscribelistener = EventRegister.addEventListener('unsubscribePrevent', (data) => {
            unsubscribe();
            stopSearchingHotWord();
            deleteHotWordManager();
        });

        closeModalListener = EventRegister.addEventListener('closeModal', () => {
            setExitModal(false);
        })

        return () => {
            if(unsubscribeRef.current)
                unsubscribeRef.current();
            EventRegister.removeEventListener(unsubscribelistener);
            EventRegister.removeEventListener(closeModalListener);
        }

    }, [navigation])

    const unsubscribe = () => {
        if(unsubscribeRef.current)
            unsubscribeRef.current();
    }
    
    const wC = useContext(WorkoutContext);
    
    return (
        <>
            <View style={[styles.rowContainer,lStyles.container]}>
                {headerType == HeaderType.Navigation &&
                    <Image
                        source={Images.get('logo')}
                        style={{width:48,height:48}}
                    />
                }
                {headerType == HeaderType.Details &&
                    <CircularButton
                        iconName='chevron-left'
                        onPress={() => {
                            EventRegister.emit('goingBack');
                            navigation.goBack()
                        }}
                        color={backButtonColor}
                    />
                }
                {headerType == HeaderType.Workout &&
                    <CircularButton
                        iconName='close-thick'
                        onPress={() => setExitModal(true)}
                        color={colors.levelColors[2]}
                    />
                }
                <Title
                    text={text}
                    lines={1}
                    style={{width:'65%', textAlign:'center'}}
                />
                {headerType != HeaderType.Details ?
                    <CircularButton
                        iconName='help'
                        onPress={() => navigation.navigate('Help')}
                    />
                    :
                    <View style={{height:48,width:48}}></View>
                } 
                
            </View>
            {headerType == HeaderType.Workout &&
                <Modal transparent={true} visible={ExitModal}>   
                    <View style={styles.backgroundModal}/>
                    <View style={styles.centerModal}>

                        <View style={styles.modalContainer}>

                            <Subtitle
                                text={Strings.finishQuestion}
                                style={{textAlign: 'center', marginBottom: 20}}
                            />
                            
                            <RectangularButton
                                text={Strings.finishSave}
                                style={{marginBottom: 10}}
                                iconName={'content-save'}
                                onPress={() => {
                                    setExitModal(false);
                                    if(unsubscribeRef.current)
                                        unsubscribeRef!.current();
                                    wC.finishWorkout()
                                }}
                            />
                            <RectangularButton
                                text={Strings.finishDontSave}
                                textStyle={{color:colors.primary}}
                                color={colors.white}
                                style={{marginBottom: 50, borderWidth:2, borderColor: colors.primary}}
                                iconName={'content-save-off'}
                                iconStyle={{color:colors.primary, right:18}}
                                onPress={() => {
                                    setExitModal(false);
                                    exit.current = true;
                                    navigation.goBack();
                                    
                                }}
                            />
                            
                            <RectangularButton
                            style={[styles.cancelButton, {marginBottom: 10}]}
                            text={Strings.cancel}
                            textStyle={{color:colors.grey}}
                            onPress={() => setExitModal(false)}
                            />
                        </View>
                    </View>
                </Modal>
            }
        </>
    )
    
    
}

const lStyles = StyleSheet.create({
    container:{
        height:64,
        padding: 8,
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent:'space-between',
        shadowColor: colors.black,
        shadowOpacity: 0.18,
        shadowRadius: 1.00,
    }
});