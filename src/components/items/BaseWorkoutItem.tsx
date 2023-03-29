import { BaseWorkout } from '../../database/classes/BaseWorkout';
import React, { TouchableOpacity } from 'react-native';
import { colors, styles } from '../../theme/style';
import { getMusclesKeysFromList } from '../../enums/Enums';
import { renderGeneralItemData } from '../../helpers/renderGeneralItemData';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamsMain } from '../../navigator/MainStack';

interface Props{
    baseWorkout: BaseWorkout
}

export const BaseWorkoutItem = ({baseWorkout}:Props) => {

  const level = baseWorkout.level;
  const levelColor = colors.levelColors[baseWorkout.level];
  const muscles = getMusclesKeysFromList(baseWorkout.muscles);
  const name = baseWorkout.name;
  const time = baseWorkout.estimatedTime;
   
  const navigation = useNavigation<RootStackParamsMain>();

  return (
  
    <TouchableOpacity 
      delayPressIn={0}
      onPress={() => navigation.navigate('WorkoutDetailScreen', baseWorkout)}
      style={[styles.itemListContainer, {borderColor: levelColor}]}
    >
    
      {renderGeneralItemData({name, levelColor, muscles, level, time})}
      
    </TouchableOpacity>

  )
}
