import { View, Image } from 'react-native';
import CIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { styles } from '../theme/style';
import { BaseText, Subtitle } from '../components/Texts';
import { renderLevelIcons } from './renderLevelIcons';
import { Level } from '../enums/Enums';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Images } from '../data/Images';
import { getTimeText } from './getTimeText';
import { Strings } from '../data/Strings';

interface Props {
    name: string,
    muscles?: string,
    levelColor?:string,
    level?: Level,
    time?: number,
    image?:string,
    date?:Date,
    sets?:string,
    reps?:string,
    timeExercise?:boolean
}

export const renderGeneralItemData = ({name, muscles, levelColor, level, time, image, date, reps, sets, timeExercise}:Props) => {
   
    let timeText;
    if(time)
        timeText = getTimeText(time); 

    let imageUrl;
    if(image)
        imageUrl = Images.get(image);

    let labelReps;
    if(reps){
        timeExercise ? labelReps=Strings.segs : labelReps=Strings.reps
    }
    
    return (
    <>
        <View  style={{display:'flex', flexDirection:'row', alignItems:'center'}}>
            <Subtitle 
                text={name}
                style={{width: '47%'}} 
                lines={1}
            />
            { level != undefined &&
                <View style={[styles.musclesLevelContainer,{marginTop:'-1%'}]}>
                    {renderLevelIcons(level)}
                </View>
            }
        </View>
        
        {
            sets &&
            <View style={[styles.musclesLevelContainer,{paddingBottom:0,marginBottom:0}]}>
                <BaseText
                    style={{fontWeight:'bold',paddingBottom:0,marginBottom:0,marginTop:-5}}
                    text={Strings.sets}
                />
                <BaseText 
                    style={{paddingBottom:0,marginBottom:0,marginTop:-5}}
                    text={sets}
                    lines={1}
                />
            </View>
        }
        {
            labelReps && reps &&
            <View >
                <BaseText
                    style={{fontWeight:'bold'}}
                    text={labelReps}
                />
                <BaseText 
                    text={reps}
                    lines={1}
                    style={{marginTop:-3}}
                />
            </View>
        }
        {
            muscles &&
            <View style={styles.musclesLevelContainer}>
                <CIcon
                    name='arm-flex'
                    size={24}
                    color={levelColor}
                />
                <BaseText 
                    text={muscles}
                    lines={1}
                />
            </View>
        }
         {timeText &&
            <View style={styles.musclesLevelContainer}>
                <CIcon
                    name={date?'account-clock':'clock'}
                    size={24}
                    color={levelColor}
                    style={{marginRight: 2}}
                />
                <BaseText 
                    text={timeText}
                    lines={1}
                />
            </View>
        }
        {
            date &&
            <View style={styles.musclesLevelContainer}>
                <CIcon
                    name={'calendar-month'}
                    size={24}
                    color={levelColor}
                    style={{marginRight: 2}}
                />
                <BaseText 
                    text={(date.getDate()+ '/' +(date.getMonth() + 1) + '/' +date.getFullYear()).toString()}
                    lines={1}
                />
            </View>
        }
        { image ?
            <Image
            style={styles.image}
            source={imageUrl}
            />
            :
            <View style={[styles.image,{backgroundColor:levelColor}]}></View>
        }

        <Icon
            style={[styles.continueIcon]}
            size={24}
            name='arrow-forward-ios'
        />
    </>
  )
}
