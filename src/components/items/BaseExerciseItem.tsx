import React,{ TouchableOpacity } from 'react-native';
import { BaseExercise } from '../../database/classes/BaseExercise';
import { colors, styles } from '../../theme/style';
import {  getMusclesKeysFromList } from '../../enums/Enums';
import { renderGeneralItemData } from '../../helpers/renderGeneralItemData';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamsMain } from '../../navigator/MainStack';


interface Props{
  baseExercise: BaseExercise
}

export const BaseExerciseItem = ({baseExercise}:Props) => {

  const level = baseExercise.level;
  const levelColor = colors.levelColors[baseExercise.level];
  const muscles = getMusclesKeysFromList(baseExercise.muscles);
  const name = baseExercise.name;
  const image = baseExercise.image;

  const navigation = useNavigation<RootStackParamsMain>();

  return (
    
    <TouchableOpacity 
      delayPressIn={0}
      onPress={() => navigation.navigate('ExerciseDetailScreen', baseExercise)}
      style={[styles.itemListContainer, {borderColor: levelColor}]}
    >
    
      {renderGeneralItemData({name, muscles, levelColor, level, image})}
      
    </TouchableOpacity>
  )
}
