import { musclesText } from '../data/Strings';
export enum Level{
    Fácil = 0,
    Intermedio,
    Difícil
} 

export enum Muscles{
    Tríceps = 0,
    Pectoral = 1,
    Deltoides = 2,
    Bíceps = 3,
    Dorsal = 4,
    Cuádriceps = 5,
    Glúteos = 6,
    Femoral = 7,
    Core = 8,
    CuerpoCompleto = 9
}

//Traducir de indices de enum a valores de enum
export const getMusclesKeysFromList = (indexList: Muscles[]) => {
    const muscles: string[] = [];
    indexList.forEach(element => {
        muscles.push(musclesText[element]);
    });
    return muscles.join(', ');
}

export enum Modifications{
    Unmodified = 1,
    Skipped = 2,
    Modified = 3,
    Changed = 4,
}

export enum Screens{
    WorkoutListScreen,
    ExerciseListScreen,
    UserWorkoutHistoryScreen,
    SettingsScreen,
    HelpScreen,
    ExerciseDetailScreen,
    WorkoutScreen
}

export enum HeaderType{
    Navigation,
    Details,
    Workout
}

export enum WorkoutComps{
    Exercise,
    Rest,
    CountDown,
}

export enum Change{
    Harder,
    Easier,
    Equal
}