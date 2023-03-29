import { UserWorkout } from '../../database/classes/UserWorkout';
import { colors, styles } from '../../theme/style';
import React, { TouchableOpacity } from 'react-native';
import { renderGeneralItemData } from '../../helpers/renderGeneralItemData';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamsMain } from '../../navigator/MainStack';

interface Props{
    userWorkout:UserWorkout;
}

export const UserWorkoutItem = ({userWorkout}:Props) => {
 
    const level = userWorkout.baseWorkout.level;
    const levelColor = colors.levelColors[level];
    const date = userWorkout.date;
    const name = userWorkout.baseWorkout.name;
    const time = userWorkout.realTime;
    
    const navigation = useNavigation<RootStackParamsMain>();

    return (
        
        <TouchableOpacity 
            delayPressIn={0}
            onPress={() => navigation.navigate('UserWorkoutDetailScreen', userWorkout)}
            style={[styles.itemListContainer, {borderColor: levelColor}]}
        >
            {renderGeneralItemData({name, date, levelColor, level, time})}
        
        </TouchableOpacity>
    )
}
