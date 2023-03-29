import Icon from 'react-native-vector-icons/MaterialIcons';
import { Level } from '../enums/Enums'
import { colors } from '../theme/style';

export const renderLevelIcons = (level:Level) => {

    const levelColor = colors.levelColors[level];

    let icons = []; 
    for(let i = 0; i < level + 1 ; i++){
        icons.push(
            <Icon 
                name='local-fire-department'
                size={24}
                color={levelColor}
            />
        )
    }
    return (
        icons
    )
}
