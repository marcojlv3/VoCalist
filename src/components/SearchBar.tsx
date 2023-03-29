import React, { View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { Strings } from '../data/Strings';
import { Screens } from '../enums/Enums';
import { ToggleCircularButton } from './Buttons';
import { colors } from '../theme/style';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { DataListContext } from '../contexts/DataListContext';
import {useContext} from 'react';

interface Props{
    screen: Screens
}

export const SearchBar = ({screen}:Props) => {

    let placeHolder;
    const iconNames: string[] = ['sort-ascending','sort-descending'];
    
    switch (screen) {
        case Screens.WorkoutListScreen:
            placeHolder=Strings.searchWorkout;
            //iconNames.push('sort-ascending');
            //iconNames.push('sort-descending');
            break;
        case Screens.UserWorkoutHistoryScreen:
            placeHolder=Strings.searchWorkout;
            //iconNames.push('sort-calendar-ascending');
            //iconNames.push('sort-calendar-descending')
            break;
        case Screens.ExerciseListScreen:
            placeHolder=Strings.searchExercise;
            //iconNames.push('sort-ascending');
            //iconNames.push('sort-descending');
            break;
    }

    const dataListContext = useContext(DataListContext);

    return (
        <View
            style={{
                display:'flex',
                flexDirection:'row',
                justifyContent:'center',
                position:'relative',
                paddingTop: 6,
                backgroundColor: colors.white
            }}
        >
            
            <ToggleCircularButton
                iconNames={iconNames}
            />
            <View
                style={{
                    borderColor:colors.primary,
                    borderWidth: 2,
                    borderTopLeftRadius: 100,
                    borderTopRightRadius: 100,
                    borderBottomLeftRadius: 100,
                    borderBottomRightRadius: 100,
                    backgroundColor:colors.white,
                    width: '73%',
                    marginLeft: 8,
                }}
            >
                <TextInput
                    underlineStyle={{
                        display:'none'
                    }}
                    activeOutlineColor={colors.primary}
                    outlineColor={colors.primary}
                    style={{
                        borderTopLeftRadius: 100,
                        borderBottomLeftRadius: 100,
                        width: '90%',
                        height: 48,
                        backgroundColor: colors.white,
                        opacity:0.8
                    }}
                    placeholder={placeHolder}
                    onChangeText={(name) => {
                    dataListContext.searchByName(name);
                    }}
                />
            </View>
                
                
            <Icon
                name='search'
                style={{
                    position:'absolute',
                    right:'10%',
                    top:'38%',
                    color:colors.lightBlack
                }}
                size={24}
            />
        </View>
    )
}


