import { Level, Muscles } from '../../enums/Enums';
import { WorkoutExercise } from './WorkoutExercise';

import {Realm} from '@realm/react';

export class BaseWorkout extends Realm.Object{
    uid!: Realm.BSON.ObjectId;
    name!: string;
    description!: string;
    level!: Level;
    muscles!: Muscles[];
    estimatedTime!: number; //sec
    restBetweenExercises!: number;
    workoutExercises!: WorkoutExercise[];

    static generate
    (
        name: string,
        description: string,
        level: Level,
        muscles: Muscles[],
        restBetweenExercises: number,
        workoutExercises: WorkoutExercise[]
    ) 
    {

        let estimatedTime = restBetweenExercises*workoutExercises.length;

        workoutExercises.forEach(item => {
            estimatedTime+=item.restBetweenSets*item.repsPerSet.length+item.repsPerSet.length*60
        });

        console.log(estimatedTime)

        return {
          uid: new Realm.BSON.ObjectId(),
          name,
          description,
          level,
          muscles,
          estimatedTime,
          restBetweenExercises,
          workoutExercises
        };
    }

    static schema = {
        name: 'BaseWorkoutRealm',
        primaryKey: 'uid',
        properties: {
            
            uid: 'objectId',
            name: 'string',
            description: 'string',
            level: 'int',
            muscles: 'int[]',
            estimatedTime: 'int',
            restBetweenExercises: 'int',
            workoutExercises: 'WorkoutExerciseRealm[]'
        },
    };
}
