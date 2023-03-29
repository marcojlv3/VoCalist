import  RNFS from 'react-native-fs';
import {createRealmContext} from '@realm/react';
import { BaseExercise } from './classes/BaseExercise';
import { WorkoutExercise } from './classes/WorkoutExercise';
import { BaseWorkout } from './classes/BaseWorkout';
import { UserWorkout } from './classes/UserWorkout';
import { UserConfig } from './classes/UserConfig';

export const realmName = 'database.realm';

const config = {
    path:RNFS.DocumentDirectoryPath+'/'+realmName,
    schema: [BaseExercise, WorkoutExercise, BaseWorkout, UserWorkout, UserConfig],
    schemaVersion:37
};
/*
export let RealmContext:any;


export const initializeRealmContext = () => {

    RealmContext = createRealmContext(config);    
}

*/

export default createRealmContext(config);
