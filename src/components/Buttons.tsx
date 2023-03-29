import React from 'react-native';
import { StyleProp, TextStyle, TouchableOpacity, ViewStyle } from 'react-native';
import { colors, borderRadius } from '../theme/style';
import CIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Title, Subtitle } from './Texts';
import { useState, useContext } from 'react';
import { DataListContext } from '../contexts/DataListContext';

interface PropsToggle {
    iconNames:string[],
}

export const ToggleCircularButton = ({iconNames}:PropsToggle) => {

    const [IconName, setIconName] = useState('sort-ascending');
    
    () => setIconName(iconNames[0]);

    const dataListContext = useContext(DataListContext);
    return (
        <TouchableOpacity
            delayPressIn={0}
            onPress={() => {sort();}}

            style={{
                backgroundColor:colors.primary,
                width: 48,
                height: 48,
                borderRadius:100,
                justifyContent:'center'
            }}
        >
            {IconName && <CIcon
                name={IconName}
                size={24}
                color={colors.white}
                style={{
                    alignSelf: 'center',
                }}
            />}
        </TouchableOpacity>
    )
    
    
    function sort() {

        if(iconNames){
            
            if(IconName.toString() != iconNames[1].toString()){
                setIconName(iconNames[1]);
                dataListContext.sortAscendant();
            } else {
                setIconName(iconNames[0]);
                dataListContext.sortDescendant();
            }
            
        }
    }
}

interface PropsCircular{
    iconName:string,
    onPress?:any,
    color?:string,
    style?:StyleProp<ViewStyle>,
    iconStyle?:StyleProp<TextStyle>
}

export const CircularButton = ({iconName, onPress, color, style, iconStyle}:PropsCircular) => {

        color = color || colors.primary;
       
        return (
            <TouchableOpacity
                delayPressIn={0}
                onPress={() => onPress()}

                style={[{
                    backgroundColor:color,
                    width: 48,
                    height: 48,
                    borderRadius:100,
                    justifyContent:'center'
                },style]}
            >
                <CIcon
                    name={iconName}
                    size={24}
                    color={colors.white}
                    style={[
                    {
                        alignSelf: 'center',
                    },iconStyle]}
                />
            </TouchableOpacity>
        )
}

interface PropsBigRectangular{
    
    iconName?:string,
    text?:string,
    onPress?:any,
    color?:string,
    style?:StyleProp<ViewStyle>,
    iconStyle?:StyleProp<TextStyle>
    textStyle?:StyleProp<TextStyle>
}

export const BigRectangularButton = ({text, textStyle, onPress, iconName, iconStyle, style}:PropsBigRectangular) => {
    return (
        <TouchableOpacity
            delayPressIn={0}
            onPress={() => onPress()}

            style={[{
                backgroundColor:colors.primary,
                width: '96%',
                height: 112,
                borderRadius: borderRadius,
                justifyContent:'center',
                alignSelf:'center',
                display:'flex',
                flexDirection:'row'
            }, style]}
        >
            {text &&
                <Title
                    text={text}
                    style={[{color:colors.white, alignSelf:'center'}, textStyle]}
                />
            }
            {iconName &&
                <CIcon
                    name={iconName}
                    size={36}
                    color={colors.white}
                    style={[{
                        position:'absolute',
                        right:10,
                        top:'33%'
                    }, iconStyle]}
                />
            }
        </TouchableOpacity>
    )
}
export const RectangularButton = ({text, textStyle, onPress, iconName, iconStyle, style, color}:PropsBigRectangular) => {
    
    color = color || colors.primary;

    return (
        <TouchableOpacity
            delayPressIn={0}
            onPress={() => onPress()}
            
            style={[{
                backgroundColor: color,
                width: '96%',
                height: 56,
                borderRadius:borderRadius,
                justifyContent:'center',
                alignSelf:'center',
                display:'flex',
                flexDirection:'row'
            },style]}
        >
            {text &&
                <Subtitle
                    text={text}
                    style={[
                        {color:colors.white, alignSelf:'center', marginTop:'3%'},
                        textStyle
                    ]}
                />
            }
            {iconName &&
                <CIcon
                    name={iconName}
                    size={24}
                    color={colors.white}
                    style={[{
                        position:'absolute',
                        right:20,
                        top:'27%'
                    }, iconStyle]}
                />
            }
        </TouchableOpacity>
    )
}


