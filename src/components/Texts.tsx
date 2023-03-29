import React, {StyleProp, StyleSheet, Text, TextStyle} from 'react-native';
import { colors } from '../theme/style';

interface Props{
    text: string,
    style?: StyleProp<TextStyle> | StyleProp<TextStyle>[],
    lines?: number
}

export const BaseText = ({text, style, lines}:Props) => {
    return (
        <Text 
            numberOfLines={ lines }
            style={[textStyles.baseText, style]}
        >
            {text}
        </Text>
    )
}


export const Subtitle = ({text, style, lines}:Props) => {
  return (
        <Text
            numberOfLines={ lines }
            style={[textStyles.baseText, textStyles.subtitle, style]}
        >
            {text}
        </Text>
  )
}

export const Title = ({text, style, lines}:Props) => {
    return (
        <Text 
            numberOfLines={ lines } 
            style={[textStyles.baseText, textStyles.title, style]}
        >
            {text}
        </Text>
    )
}

export const BigLabel = ({text, style, lines}:Props) => {
    return (
        <Text 
            numberOfLines={ lines } 
            style={[textStyles.baseText, textStyles.bigLabel, style]}
        >
            {text}
        </Text>
    )
}



const textStyles = StyleSheet.create({
    //Textos
    baseText: {
        fontFamily: 'Roboto',
        fontSize: 14,
        color: colors.lightBlack,
        marginBottom: 4,
        marginTop: 4
    },
    subtitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10
    },
    title:{
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 0,
        marginTop: -3
    },
    bigLabel:{
        fontSize: 48,
        fontWeight:'bold',
        margin: 0
    }
});