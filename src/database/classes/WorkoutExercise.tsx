import { BaseExercise } from './BaseExercise';
import {Realm} from '@realm/react';

export class WorkoutExercise extends Realm.Object{
    uid!: Realm.BSON.ObjectId;
    baseExercise!: BaseExercise;
    repsPerSet!: number[];
    restBetweenSets!: number;
    timeExercise!: boolean;

    static generate
    (
        baseExercise: BaseExercise,
        repsPerSet: number[],
        restBetweenSets: number,
        timeExercise: boolean,
    ) 
    {
        return {
          uid: new Realm.BSON.ObjectId(),
          baseExercise,
          repsPerSet,
          restBetweenSets,
          timeExercise
        };
    }

    static schema = {
        name: 'WorkoutExerciseRealm',
        primaryKey: 'uid',
        properties: {
            
            uid: 'objectId',
            baseExercise: 'BaseExerciseRealm',
            repsPerSet: 'int[]',
            restBetweenSets: 'int',
            timeExercise: 'bool'
        },
    };
}

export class TemporaryWorkoutExercise {
    uid: string;
    baseExercise: BaseExercise;//sustituir por uid del ebase exercise y ya en la app 
    repsPerSet: number[];
    restBetweenSets: number;
    timeExercise: boolean;

    constructor(
        item:WorkoutExercise
    ) {
        
        this.uid = JSON.parse(JSON.stringify(item.uid));
        this.baseExercise = item.baseExercise;
        this.repsPerSet = JSON.parse(JSON.stringify(item.repsPerSet));
        this.restBetweenSets = JSON.parse(JSON.stringify(item.restBetweenSets));
        this.timeExercise = JSON.parse(JSON.stringify(item.timeExercise))
    }
}