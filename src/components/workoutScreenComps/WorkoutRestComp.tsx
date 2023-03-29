import React, { useContext } from 'react'
import { BaseText, Subtitle } from '../Texts';
import { Strings } from '../../data/Strings';
import { CountDown } from '../CountDown';
import { Dimensions, View } from 'react-native';
import { BigRectangularButton } from '../Buttons';
import { WorkoutContext } from '../../screens/WorkoutScreen';
import { WorkoutComps } from '../../enums/Enums';

interface Props{
    nextExercise: string,
    restTime:number
}

const width = Dimensions.get('window').width;


export const WorkoutRestComp = ({nextExercise, restTime}:Props) => {

    
    const workoutContext = useContext(WorkoutContext);

    return (
        <>
            
            <View
                style={{
                    justifyContent:'space-between',
                    alignItems:'center', 
                    width:'100%',
                    paddingTop:'5%',
                    paddingBottom:'10%',
                    flex:5
                }}
            >
                <View>
                    <BaseText
                        text={Strings.nextExercise}
                        style={{textAlign:'center'}}
                    />
                    <Subtitle
                        text={nextExercise}
                        style={{textAlign:'center'}}
                    />
                </View>
                <CountDown 
                    initialSeconds={restTime} size={width*0.7}        
                />
            </View>
            
            <View 
                style={{flex:1, padding:'2%', justifyContent:'flex-end'}}
            >
                <BigRectangularButton
                    text={Strings.skipRest}
                    iconName={'chevron-right'}
                    onPress={() => workoutContext.setCurrentComponent(WorkoutComps.Exercise)}
                />
            </View>
        </>
    )
}
