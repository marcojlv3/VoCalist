import React, { FlatList } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParamsMain } from '../navigator/MainStack';
import { getMusclesKeysFromList, HeaderType } from '../enums/Enums';
import { renderGeneralDetailsData } from '../helpers/renderGeneralDetailsData';
import { WorkoutExercise } from '../database/classes/WorkoutExercise';
import { WorkoutExerciseItem } from '../components/items/WorkoutExerciseItem';
import { Subtitle } from '../components/Texts';
import { Strings } from '../data/Strings';
import { HeaderBar } from '../components/HeaderBar';
import { colors } from '../theme/style';
import { RectangularButton } from '../components/Buttons';

type Props = StackScreenProps<RootStackParamsMain, 'WorkoutDetailScreen'>;

export const WorkoutDetailScreen = ({route, navigation}:Props) => {

    const baseWorkout = route.params;
    const name = baseWorkout.name;
    const level = baseWorkout.level;
    const estimatedTime = baseWorkout.estimatedTime;
    const muscles = getMusclesKeysFromList(baseWorkout.muscles);
    const description = baseWorkout.description;

    const data = baseWorkout.workoutExercises;

    const renderItem = ( item:WorkoutExercise ) => {
        return <WorkoutExerciseItem workoutExercise={item} key={item.uid.toString()}/>
    }

    return (
        <>
            <HeaderBar 
                text={name}
                headerType={HeaderType.Details}
                level={level}            />
            
            <FlatList
                ListHeaderComponent={
                    <>
                        {renderGeneralDetailsData({ level, description, muscles, estimatedTime})}
            
                        <Subtitle
                            style={{paddingLeft:'5%'}}
                            text={Strings.exercises}
                        />
                    </>
                }
                showsVerticalScrollIndicator={false}
                data={data}
                keyExtractor={item => item.uid.toString()}
                renderItem={({ item }) => renderItem(item)} 
                style={{backgroundColor: colors.backgroundGrey}}
            />
            <RectangularButton
                iconName='chevron-right'
                text={Strings.startWorkout}
                onPress={() => navigation.navigate('WorkoutScreen', baseWorkout)}
                color={colors.levelColors[level]}
                style={{margin:8,}}
            />
        </>
    )
}
