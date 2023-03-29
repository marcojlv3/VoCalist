
import { View } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'
import { BaseText } from '../components/Texts'
import { Level } from '../enums/Enums'
import { borderRadius, colors, styles } from '../theme/style'
import CIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Strings } from '../data/Strings'
import { getTimeText } from './getTimeText'
import { Video } from '../components/Video';

interface Props{
    level:Level,
    description:string,
    muscles:string,
    estimatedTime?:number,
    realTime?:number,
    date?:Date,
    videoUrl?:string,
    
}

export const renderGeneralDetailsData = ({ level,  description, muscles, estimatedTime, realTime, date, videoUrl}:Props) => {
    
    const levelColor = colors.levelColors[level];
    
    let estimatedTimeText;
    if(estimatedTime)
        estimatedTimeText = getTimeText(estimatedTime);

    let realTimeText;
    if(realTime)
        realTimeText = getTimeText(realTime);

    let finalDescription;
    realTime ? finalDescription = Strings.yourDescription : finalDescription = Strings.description

    return (
        <>
            {videoUrl &&
                <Video
                    videoId={videoUrl}
                />
            }
            <View style={{backgroundColor:colors.white, borderRadius:borderRadius,margin:'2%', marginBottom:'10%'}}>
                
                <View
                    style={{padding:'5%'}}
                >
                    
                    <View style={[styles.rowContainer,{marginBottom:4}]}>
                        <Icon 
                            name='local-fire-department'
                            size={24}
                            color={levelColor}
                        />
                        <BaseText
                            text={Strings.level}
                            style={{fontWeight:'bold'}}
                        />
                        <BaseText
                            text={Level[level]}
                            style={{fontWeight:'bold', color:colors.levelColors[level]}}
                        />
                    </View>
                    <View style={[styles.rowContainer,{marginBottom:4}]}>
                        <CIcon 
                            name='arm-flex'
                            size={24}
                            color={levelColor}
                        />
                        <BaseText
                            text={Strings.muscles}
                            style={{fontWeight:'bold'}}
                        />
                        <BaseText
                            text={muscles}
                            style={{width:'80%',height:'100%'}}
                        />
                    </View>
                    { estimatedTimeText &&
                        <View style={[styles.rowContainer,{marginBottom:4}]}>
                            <CIcon 
                                name='clock'
                                size={24}
                                color={levelColor}
                            />
                            <BaseText
                                text={Strings.estimatedTime}
                                style={{fontWeight:'bold'}}
                            />
                            <BaseText
                                text={estimatedTimeText}
                            />
                        </View>
                    }
                    { realTimeText &&
                        <View style={[styles.rowContainer,{marginBottom:4}]}>
                            <CIcon 
                                name='account-clock'
                                size={24}
                                color={levelColor}
                            />
                            <BaseText
                                text={Strings.realTime}
                                style={{fontWeight:'bold'}}
                            />
                            <BaseText
                                text={realTimeText}
                            />
                        </View>
                    }
                    { date &&
                        <View style={[styles.rowContainer,{marginBottom:4}]}>
                            <CIcon 
                                name='calendar-month'
                                size={24}
                                color={levelColor}
                            />
                            <BaseText
                                text={Strings.date}
                                style={{fontWeight:'bold'}}
                            />
                            <BaseText
                                text={(date.getDate()+ '/' +(date.getMonth() + 1) + '/' +date.getFullYear()).toString()}
                            />
                        </View>
                    }
                    {description != '' &&
                        <>      
                            <View style={[styles.rowContainer,{marginBottom:4}]}>
                                <CIcon 
                                    name='text'
                                    size={24}
                                    color={levelColor}
                                />
                                
                                <BaseText
                                    text={finalDescription}
                                    style={{fontWeight:'bold'}}
                                />
                            </View>
                            
                            <BaseText
                                text={description}
                            />
                        </>
                    }   
                </View>
            </View>
        </>
    )
}
