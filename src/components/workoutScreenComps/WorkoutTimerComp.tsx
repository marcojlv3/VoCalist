import React, {useContext, useEffect} from 'react'
import { Dimensions, View } from 'react-native'
import { BigRectangularButton } from '../Buttons';
import { Strings } from '../../data/Strings';
import { WorkoutComps } from '../../enums/Enums';
import { WorkoutContext } from '../../screens/WorkoutScreen';
import { CountDown } from '../CountDown';
import { colors, styles } from '../../theme/style';
import { playSound } from '../../helpers/playSound';


const width = Dimensions.get('window').width;

interface Props {
  seconds: number
}

export const WorkoutTimerComp = ({seconds}:Props) => {

  const workoutContext = useContext(WorkoutContext);

  useEffect(() => {
    playSound('countdown.mp3');
  }, [])
  

  return (
    <>

      <View 
          style={{flex:5, paddingBottom:'4%', justifyContent:'center', alignItems:'center'}}
      >
        <CountDown 
            initialSeconds={seconds+3} size={width*0.7}        
        />
      </View>

      <View 
          style={{flex:1, padding:'2%', justifyContent:'flex-end'}}
      >
          <BigRectangularButton
              text={Strings.finishCounter}
              iconName={'chevron-right'}
              style={styles.cancelButton}
              textStyle={{color:colors.grey}}
              onPress={() => workoutContext.setCurrentComponent(WorkoutComps.Exercise)}
          />
      </View>
    </>
  )
}
