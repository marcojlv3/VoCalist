import { WorkoutExercise } from '../../database/classes/WorkoutExercise';
import React, { TouchableOpacity } from 'react-native';
import { colors, styles } from '../../theme/style';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamsMain } from '../../navigator/MainStack';
import { renderGeneralItemData } from '../../helpers/renderGeneralItemData';
import { Modifications } from '../../enums/Enums';
import CIcon from 'react-native-vector-icons/MaterialCommunityIcons';

interface Props{
    workoutExercise:WorkoutExercise;
    modification?:Modifications;
}


export const WorkoutExerciseItem = ({workoutExercise, modification}:Props) => {

  const navigation = useNavigation<RootStackParamsMain>();

  const baseExercise =  workoutExercise.baseExercise;
  const name = baseExercise.name;
  const level = baseExercise.level;
  const levelColor = colors.levelColors[level];
  const image = baseExercise.image;
  const sets = workoutExercise.repsPerSet.length+'';
  const reps = workoutExercise.repsPerSet.join(' - ');
  const timeExercise = workoutExercise.timeExercise;

  let iconName;
  let iconColor;
  switch (modification) {
    case Modifications.Unmodified:
      iconName = 'check';
      iconColor = colors.levelColors[0];
      break;
    case Modifications.Skipped:
      iconName = 'close';
      iconColor = colors.levelColors[2];
      break;
    case Modifications.Changed:
      iconName = 'autorenew';
      iconColor = colors.yellow;
      break;
    case Modifications.Modified:
      iconName = 'playlist-edit';
      iconColor = colors.primary;
      break;
  
    default:
      break;
  }

  return (
    <TouchableOpacity
      delayPressIn={0} 
      onPress={() => navigation.navigate('ExerciseDetailScreen', workoutExercise.baseExercise)}
      style={[styles.itemListContainer, {borderColor: levelColor}]}
    >
    
    {renderGeneralItemData({name, level,levelColor, image, sets, reps, timeExercise })}
    {iconName && modification &&
        <CIcon
          name={iconName}
          size={48}
          color={iconColor}
          style={{position:'absolute', right:'36%', top:'30%'}}
        />
      }
      
    </TouchableOpacity>
  )
}
