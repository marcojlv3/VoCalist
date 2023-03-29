import React from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { HelpScreen } from '../screens/HelpScreen';
import  Navbar  from './Navbar';
import { WorkoutDetailScreen } from '../screens/WorkoutDetailScreen';
import { BaseWorkout } from '../database/classes/BaseWorkout';
import { UserWorkoutDetailScreen } from '../screens/UserWorkoutDetailScreen';
import { ExerciseDetailScreen } from '../screens/ExerciseDetailScreen';
import { UserWorkout } from '../database/classes/UserWorkout';
import { BaseExercise } from '../database/classes/BaseExercise';
import { WorkoutScreen } from '../screens/WorkoutScreen';
import { EndOfTrialScreen } from '../screens/EndOfTrialScreen';
import { WorkoutCompletedScreen } from '../screens/WorkoutCompletedScreen';
import { TemporaryWorkoutExercise } from '../database/classes/WorkoutExercise';

export type RootStackParamsMain = {
  getState(): unknown;
  dispatch(action: any): unknown;
  removeListener(arg0: string, arg1: (e: any) => void): unknown;
  addListener(arg0: string, arg1: (e: any) => void): any;
  goBack(): unknown;
  navigate(screen:string, args?:any): RootStackParamsMain;
  Home: any;
  Help: undefined;
  WorkoutDetailScreen: BaseWorkout;
  UserWorkoutDetailScreen: UserWorkout;
  ExerciseDetailScreen: BaseExercise;
  WorkoutScreen:BaseWorkout;
  EndOfTrialScreen:undefined;
  WorkoutCompletedScreen:{
    baseWorkout: BaseWorkout,
    userWorkoutExercises: TemporaryWorkoutExercise[],
    modificatedExercises: number[],
    time: number
  };
}

const Stack = createStackNavigator<RootStackParamsMain>();

export const MainStack = () => {

  return (
      <Stack.Navigator
        screenOptions={{headerShown:false}}
        
      >
          <Stack.Screen name="Home" component={Navbar} />
          <Stack.Screen name="Help" component={HelpScreen} />
          <Stack.Screen name="WorkoutDetailScreen" component={WorkoutDetailScreen} />
          <Stack.Screen name="UserWorkoutDetailScreen" component={UserWorkoutDetailScreen} />
          <Stack.Screen name="ExerciseDetailScreen" component={ExerciseDetailScreen} />
          <Stack.Screen name="WorkoutScreen" component={WorkoutScreen} />
          <Stack.Screen name="WorkoutCompletedScreen" component={WorkoutCompletedScreen} />
          <Stack.Screen name="EndOfTrialScreen" component={EndOfTrialScreen} />
      </Stack.Navigator>
  );
}