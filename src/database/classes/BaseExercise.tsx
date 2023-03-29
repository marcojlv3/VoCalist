import { Level, Muscles } from '../../enums/Enums';
import {Realm} from '@realm/react';

export class BaseExercise extends Realm.Object{
    uid!: Realm.BSON.ObjectId;
    name!: string;
    description!: string;
    level!: Level;
    muscles!: Muscles[];
    image!: string;
    videoURL!: string;
    workoutDescription!: string;
    easierOptions!: BaseExercise[];
    equalOptions!: BaseExercise[];
    harderOptions!: BaseExercise[];

    static generate
    (
        name: string,
        description: string,
        level: Level,
        muscles: Muscles[],
        image: string,
        videoURL: string,
        workoutDescription: string,
        easierOptions: BaseExercise[],
        equalOptions: BaseExercise[],
        harderOptions: BaseExercise[]
    ) 
    {
        return {
          uid: new Realm.BSON.ObjectId(),
          name,
          description,
          level,
          muscles,
          image,
          videoURL,
          workoutDescription,
          easierOptions,
          equalOptions,
          harderOptions
        };
    }

    static schema = {
        name: 'BaseExerciseRealm',
        primaryKey: 'uid',
        properties: {
            
            uid: 'objectId',
            name: 'string',
            description: 'string',
            level: 'int',
            muscles: 'int[]',
            image: 'string',
            videoURL: 'string',
            workoutDescription:'string',
            easierOptions: 'BaseExerciseRealm[]',
            equalOptions: 'BaseExerciseRealm[]',
            harderOptions: 'BaseExerciseRealm[]'
        },
    };
}

