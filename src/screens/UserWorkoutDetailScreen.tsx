import { StackScreenProps } from '@react-navigation/stack';
import React, { FlatList } from 'react-native';
import { getMusclesKeysFromList, Modifications, HeaderType } from '../enums/Enums';
import { renderGeneralDetailsData } from '../helpers/renderGeneralDetailsData';
import { RootStackParamsMain } from '../navigator/MainStack';
import { Subtitle } from '../components/Texts';
import { Strings } from '../data/Strings';
import { WorkoutExercise } from '../database/classes/WorkoutExercise';
import { WorkoutExerciseItem } from '../components/items/WorkoutExerciseItem';
import { RectangularButton } from '../components/Buttons';
import { colors, styles } from '../theme/style';
import { HeaderBar } from '../components/HeaderBar';
import RealmContext from '../database/configDB';
import { UserWorkout } from '../database/classes/UserWorkout';
import { EventRegister } from 'react-native-event-listeners';

type Props = StackScreenProps<RootStackParamsMain, 'UserWorkoutDetailScreen'>;

interface ModificatedExercise {
  uid:string,
  exercise:WorkoutExercise,
  modification:Modifications
}

export const UserWorkoutDetailScreen = ({route, navigation}:Props) => {
  const userWorkout = route.params;
  const baseWorkout = userWorkout.baseWorkout;
  const name = baseWorkout.name;
  const level = baseWorkout.level;
  const levelColor = colors.levelColors[level];
  const estimatedTime = baseWorkout.estimatedTime;
  const muscles = getMusclesKeysFromList(baseWorkout.muscles);
  const description = userWorkout.userDescription;
  const realTime = userWorkout.realTime;
  const date = userWorkout.date;
  
  const data:ModificatedExercise[] = [];
  for(let i = 0; i < userWorkout.userWorkoutExercises.length; i++){
    const modificatedExercise = {
                                  uid:userWorkout.userWorkoutExercises[i].uid.toString(),
                                  exercise:userWorkout.userWorkoutExercises[i],
                                  modification:userWorkout.modificatedExercises[i]
                                } 
                                
    data.push(modificatedExercise);
  }

  const renderItem = ( item:ModificatedExercise ) => {
    return <WorkoutExerciseItem workoutExercise={item.exercise} 
                                modification={item.modification}
                                key={item.uid.toString()}/>
  } 

  const deleteWorkout = () => {
    EventRegister.emit('deleteWorkout', userWorkout.uid);
    navigation.goBack();
  }

  return (
    <>
      <HeaderBar 
          text={name} 
          headerType={HeaderType.Details}
          level={level}                
      />

      <FlatList
        ListHeaderComponent={
          <>
            {renderGeneralDetailsData({ level, description, muscles, estimatedTime, realTime, date})}

            <Subtitle
              style={{paddingLeft:'5%'}}
              text={Strings.exercises}
            />
          </>
        }

        ListFooterComponent = {
          <>
            <RectangularButton
              text={Strings.deleteWorkout}
              style={[styles.cancelButton, {marginBottom: 10}]}
              textStyle={{color:colors.grey}}
              onPress={() => deleteWorkout()}
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
        text={Strings.originalWorkout}
        onPress={() => navigation.navigate('WorkoutDetailScreen', baseWorkout)}
        color={levelColor}
        style={{margin:8}}
      />
    </>
  )
}
