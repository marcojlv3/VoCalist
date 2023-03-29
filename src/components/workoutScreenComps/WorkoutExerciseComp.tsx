import React, { useContext, useState } from 'react'
import { TemporaryWorkoutExercise } from '../../database/classes/WorkoutExercise';
import YoutubePlayer from 'react-native-youtube-iframe';
import { Title, Subtitle, BigLabel } from '../Texts';
import { Dimensions, Modal, View, TouchableOpacity } from 'react-native';
import { CircularButton, RectangularButton } from '../Buttons';
import { colors, styles } from '../../theme/style';
import { Strings } from '../../data/Strings';
import { WorkoutContext } from '../../screens/WorkoutScreen';
import { Change, WorkoutComps } from '../../enums/Enums';
import {StyleSheet} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamsMain } from '../../navigator/MainStack';
import { SettingsContext } from '../../contexts/SettingsContext';
import { Video } from '../Video';

interface Props{
  repsPerSet:number[];
  exerciseSetIndex:number;
  workoutExercises:TemporaryWorkoutExercise[],
  exerciseIndex:number,
  reps: string,
  sets: string,
  initialReps: string,
}


export const WorkoutExerciseComp = ({workoutExercises, exerciseIndex, repsPerSet, exerciseSetIndex, reps, sets, initialReps}:Props) => {

  const workoutExercise = workoutExercises[exerciseIndex];
  const timeExercise = workoutExercise.timeExercise;
  const baseExercise = workoutExercise.baseExercise;

  let repsOrSegsLabel;
  timeExercise ? repsOrSegsLabel = Strings.segsw : repsOrSegsLabel = Strings.repsw;
  
  const wC = useContext(WorkoutContext);
  const sC = useContext(SettingsContext);
  const navigation = useNavigation<RootStackParamsMain>();

  const [ChangeModal, setChangeModal] = useState(false);
  

  let initialRepsLabel = '';
  if(sC.MovementDetection && !timeExercise)
    initialRepsLabel = ' de '+initialReps;

  return (
    <>
      <View style={{flex:5, justifyContent:'space-between', paddingBottom:'10%'}}>
        {baseExercise &&
          <Video
            videoId={baseExercise.videoURL}
          />
        }

        {/* Nombre y boton de cambiar ejercicio */}
        <View style={[styles.rowContainer, {marginTop:'5%', justifyContent:'center'}]}>
          {workoutExercise.baseExercise &&
            <TouchableOpacity
              style={{flex:1, justifyContent:'center', alignItems:'center'} }
              onPress={() => { navigation.navigate('ExerciseDetailScreen', workoutExercise.baseExercise)}}
            >
              <Title
                text={workoutExercise.baseExercise.name}
                style={{textAlign:'center', width:'45%'}}
                lines={1}
              />
            </TouchableOpacity>
          }
          <CircularButton
            iconName='autorenew'
            style={{position:'absolute', right:'12%', alignSelf:'center'}}
            onPress={() => setChangeModal(true)}
          />
        </View>

        <Subtitle
          text={Strings.setsw}
          style={{marginTop:'5%', marginBottom: 0,textAlign:'center'}}
        />

        {/* Series */}
        <View style={[styles.rowContainer, lStyles.buttonsRow]}>
          <CircularButton
              iconName='minus-thick'
              style={{ width:64, height:64}}
              onPress={() => {
                wC.removeSet(1);
              }}
            />
          <BigLabel
            text={(exerciseSetIndex+1)+' de '+sets}
          />
          <CircularButton
            iconName='plus-thick'
            style={{ width:64, height:64}}
            onPress={() => {
              wC.addSet(1);
            }}
          />
        </View>
        
        <Subtitle
          text={repsOrSegsLabel}
          style={{textAlign:'center', marginTop:'5%',marginBottom: 0}}
        />

        {/* Repeticiones o segundos */}
        <View style={[styles.rowContainer, lStyles.buttonsRow]}>
          <CircularButton
            iconName='minus-thick'
            style={{width:64, height:64}}
            onPress={() => {
              wC.removeRep(1);
            }}
          />
          <BigLabel
            text={reps  + initialRepsLabel}
          />
          <CircularButton
            iconName='plus-thick'
            style={{ width:64, height:64}}
            onPress={() => {
              wC.addRep(1);
            }}
          />
        </View>
      </View>

      {/* Botonera */}
      
      <View style={{flex:1, padding:'2%', justifyContent:'flex-end'}}>
        {timeExercise && 
          <RectangularButton
            text={Strings.setTimer}
            style={{width:'100%', marginBottom:'2%'}}
            textStyle={{fontSize:18}}
            iconName={'chevron-right'}
            onPress={() => wC.setCurrentComponent(WorkoutComps.CountDown)}
          />
        }
        { workoutExercises && workoutExercises.length <= exerciseIndex + 1 && repsPerSet.length <= exerciseSetIndex + 1 ?
        //si es el ultimo ejercicio se cambia el botón
          <RectangularButton
            style={{width:'100%'}}
            textStyle={{fontSize:18}}
            text={Strings.finishSave}
            onPress={() => wC.finishWorkout()}
          />
        :
          <View style={[styles.rowContainer, {justifyContent:'space-between'}]}>
            <RectangularButton
              style={[styles.cancelButton,{width:'49%'}]}
              textStyle={{fontSize:18, color:colors.grey, textAlign:'center'}}
              text={Strings.skipExercise}
              onPress={() => {
                wC.skipExercise()
              }}
            />
            <RectangularButton
              style={{width:'49%'}}
              textStyle={{fontSize:18}}
              iconName={'chevron-right'}
              text={Strings.nextSet}
              onPress={() => wC.setCurrentComponent(WorkoutComps.Rest)}
            />
          </View>  
        }
      </View>
      
      <Modal
        transparent={true}
        visible={ChangeModal}
      >   
        <View
          style={styles.backgroundModal}
        />
        <View 
          style={styles.centerModal}
        >
          <View style={styles.modalContainer}>
            <Subtitle
              text={Strings.changeQuestion}
              style={{textAlign: 'center', marginBottom: 20}}
            />
            { baseExercise && baseExercise.easierOptions.length > 0 &&
              <RectangularButton
                text={Strings.easier}
                color={colors.levelColors[0]}
                style={{marginBottom: 10}}
                onPress={() => {
                  wC.changeWorkoutExercise(Change.Easier);
                  setChangeModal(false);
                }}
              />
            }
            { baseExercise && baseExercise.equalOptions.length > 0 &&
              <RectangularButton
                text={Strings.sameLevel}
                color={colors.levelColors[1]}
                style={{marginBottom: 10}}
                onPress={() => {
                  wC.changeWorkoutExercise(Change.Equal);
                  setChangeModal(false);
                }}
              />
            }
            { baseExercise && baseExercise.harderOptions.length > 0 &&
              <RectangularButton
                text={Strings.harder}
                color={colors.levelColors[2]}
                style={{marginBottom: 50}}
                onPress={() => {
                  wC.changeWorkoutExercise(Change.Harder);
                  setChangeModal(false);
                }}
              />
            }
            <RectangularButton
              style={[styles.cancelButton, {marginBottom: 10}]}
              text={Strings.cancel}
              textStyle={{color:colors.grey}}
              onPress={() => setChangeModal(false)}
            />
          </View>
        </View>
      </Modal>
    </>
  )
}


const lStyles = StyleSheet.create({
  buttonsRow:{
    justifyContent:'space-between',
    alignItems:'center',
    marginLeft:'10%',
    marginRight:'10%'
  }
  
})