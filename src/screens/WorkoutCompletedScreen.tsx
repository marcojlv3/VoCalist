import React, {useState, useEffect, useRef} from 'react'
import { Image, View, StatusBar } from 'react-native';
import { Images } from '../data/Images';
import { borderRadius, colors, iconSize, styles } from '../theme/style';
import { Title, Subtitle, BaseText } from '../components/Texts';
import { Strings } from '../data/Strings';
import CIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { TextInput } from 'react-native-paper';
import { RectangularButton } from '../components/Buttons';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamsMain } from '../navigator/MainStack';
import { WorkoutExercise } from '../database/classes/WorkoutExercise';
import RealmContext from '../database/configDB';
import { UserWorkout } from '../database/classes/UserWorkout';
import { getTimeText } from '../helpers/getTimeText';
import { deleteHotWordManager, stopSearchingHotWord } from '../helpers/hotWordManager';
import { EventRegister } from 'react-native-event-listeners';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamsNav } from '../navigator/Navbar';

interface Props extends StackScreenProps<RootStackParamsMain, 'WorkoutCompletedScreen'> {}

export const WorkoutCompletedScreen = ({navigation,route}:Props) => {

    StatusBar.setBackgroundColor('rgba(215, 226, 222, 0.7)');

    const params = route.params;
    const name = params.baseWorkout.name;
    const levelColor = colors.levelColors[params.baseWorkout.level];
    const timeUsed = getTimeText(params.time);
    const tWorkoutExercises = params.userWorkoutExercises;

    const [UserDescription, setUserDescription] = useState('');

    const realm = RealmContext.useRealm();
    const navbarNavigation = useNavigation<RootStackParamsNav>();

    const exit = useRef(false)
    
    useEffect(() => {
        stopSearchingHotWord();
        deleteHotWordManager();

        EventRegister.emit('cancelNotification');

        const listener = navigation.addListener('beforeRemove', (e:any) => {
            if(!exit.current){
                e.preventDefault();
            }
        });

        return listener;

    }, [navigation])
    
    
    const createUserWorkout = () => {

        realm.write(() => {

            let userWorkoutExercises = tWorkoutExercises.map(function(i) {
                return realm.create<WorkoutExercise>('WorkoutExerciseRealm', WorkoutExercise.generate(
                    i.baseExercise,
                    i.repsPerSet,
                    i.restBetweenSets,
                    i.timeExercise,
                ));
            }); 
            
            realm.create('UserWorkoutRealm', UserWorkout.generate(
                params.baseWorkout,
                userWorkoutExercises,
                params.modificatedExercises,
                params.time,
                UserDescription
            ));
            
        });

        navbarNavigation.navigate('UserWorkoutHistoryScreen');
    }

    return (
        <>
            <Image
                style={{width:'100%', height:'100%', position:'absolute', backgroundColor:colors.black, opacity:0.6}}
                source={Images.get('prueba')}
            />
            <View
                style={{
                    flex:1,
                    marginTop:'10%',
                    marginBottom:'2%',
                    alignItems:'center', 
                    justifyContent:'space-between'
                }}
            >
                <Title
                    text={Strings.workoutFinished}
                    style={{color:colors.white}}
                />
                <View
                    style={{
                        backgroundColor:colors.white,
                        width:'90%',
                        padding:'5%',
                        margin:'5%',
                        borderRadius:borderRadius
                    }}
                >
                    <Subtitle
                        text={name}
                    />

                    <View style={styles.rowContainer}>
                        <CIcon
                            name='account-clock'
                            color={levelColor}
                            size={iconSize}
                            style={{marginRight:8}}
                        />
                        <BaseText
                            text={Strings.timeUsed}
                            style={{fontWeight:'bold'}}
                        />
                        <BaseText
                            text={timeUsed}
                        />
                    </View>
                    <View style={styles.rowContainer}>
                        <CIcon
                            name='text'
                            color={levelColor}
                            size={iconSize}
                            style={{marginRight:8}}
                        />
                        <BaseText
                            text={Strings.setDescription}
                            style={{fontWeight:'bold'}}
                        />
                    </View>
                    <TextInput
                        onChangeText={(text) => setUserDescription(text)}
                        value={UserDescription}
                        
                        numberOfLines={5}
                        multiline={true}
                        style={{
                            borderRadius:borderRadius,
                            borderTopLeftRadius:borderRadius,
                            borderTopRightRadius:borderRadius,
                            marginTop:8,
                            maxHeight: 200,
                            width:'100%',
                            alignSelf:'flex-start'
                        }}
                        underlineStyle={{
                            height:0
                        }}
                    />
                </View>
                <View
                    style={[styles.rowContainer, {width:'95%', justifyContent:'space-between'}]}
                >
                    <RectangularButton
                        text={Strings.dontSave}
                        textStyle={{color:colors.primary}}
                        color={colors.white}
                        style={{borderWidth:2, borderColor: colors.primary, width:'49%'}}
                        iconName={'content-save-off'}
                        iconStyle={{color:colors.primary, right:18}}
                        onPress={() => {
                            exit.current = true;
                            navigation.navigate('Home');
                        }}
                    />
                    <RectangularButton
                        text={Strings.save}
                        style={{width:'49%'}} 
                        iconName={'content-save'}
                        onPress={() => {
                            exit.current = true;
                            createUserWorkout();
                        }}
                    />

                </View>
            </View>

        
        </>
    )
}
