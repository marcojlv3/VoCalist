import {Realm} from '@realm/react';

export class UserConfig extends Realm.Object{
    uid!: string;
    welcome!: boolean;
    voiceCommands!: boolean;
    audioWorkout!: boolean;
    movementDetection!:boolean;
    notifications!:boolean;
    static generate
    (
        uid: string,
        welcome: boolean,
        voiceCommands: boolean,
        audioWorkout: boolean,
        movementDetection: boolean,
        notifications: boolean
    ) 
    {
        return {
            uid,
            welcome,
            voiceCommands,
            audioWorkout,
            movementDetection,
            notifications
        };
    }

    static schema = {
        name: 'config',
        primaryKey: 'uid',
        properties: {
            
            uid: 'string',
            welcome: 'bool',
            voiceCommands: 'bool',
            audioWorkout: 'bool',
            movementDetection: 'bool',
            notifications: 'bool'
        },
    };
}
