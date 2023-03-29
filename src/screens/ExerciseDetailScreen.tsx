import { StackScreenProps } from '@react-navigation/stack';
import React, { ScrollView } from 'react-native';
import { HeaderBar } from '../components/HeaderBar';
import { getMusclesKeysFromList, HeaderType, Screens } from '../enums/Enums';
import { renderGeneralDetailsData } from '../helpers/renderGeneralDetailsData';
import { RootStackParamsMain } from '../navigator/MainStack';
import { colors } from '../theme/style';

type Props = StackScreenProps<RootStackParamsMain, 'ExerciseDetailScreen'>;

export const ExerciseDetailScreen = ({route}:Props) => {
  const baseExercise = route.params;
  const name = baseExercise.name;
  const level = baseExercise.level;
  const muscles = getMusclesKeysFromList(baseExercise.muscles);
  const description = baseExercise.description;
  const videoUrl = baseExercise.videoURL;

  return (
    <>
      <HeaderBar 
        text={name}
        headerType={HeaderType.Details}
        level={level}/>
      <ScrollView
        style={{backgroundColor: colors.backgroundGrey}}
      >
        {renderGeneralDetailsData({level, description, muscles, videoUrl})}
      </ScrollView>
    </>
  )
}
