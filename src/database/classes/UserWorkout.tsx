import { BaseWorkout } from './BaseWorkout';
import { WorkoutExercise } from './WorkoutExercise';
import {Realm} from '@realm/react';

export class UserWorkout extends Realm.Object{
    uid!: Realm.BSON.ObjectId;
    baseWorkout!: BaseWorkout;
    userWorkoutExercises!: WorkoutExercise[];
    modificatedExercises!: number[];
    date!: Date;
    realTime!: number;
    userDescription!: string;

    static generate
    (
        baseWorkout: BaseWorkout,
        userWorkoutExercises: WorkoutExercise[],
        modificatedExercises: number[],
        realTime: number,
        userDescription: string
    ) 
    {
        return {
          uid: new Realm.BSON.ObjectId(),
          baseWorkout,
          userWorkoutExercises,
          modificatedExercises,
          date: new Date(),
          realTime,
          userDescription
        };
    }

    static schema = {
        name: 'UserWorkoutRealm',
        primaryKey: 'uid',
        properties: {
            
            uid: 'objectId',
            baseWorkout: 'BaseWorkoutRealm',
            userWorkoutExercises: 'WorkoutExerciseRealm[]',
            modificatedExercises: 'int[]',
            date: 'date',
            realTime: 'int',
            userDescription: 'string'
        },
    };
}
