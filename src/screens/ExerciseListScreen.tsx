import React,{ FlatList } from 'react-native';
import { BaseExerciseItem } from '../components/items/BaseExerciseItem';
import { BaseExercise } from '../database/classes/BaseExercise';
import { SearchBar } from '../components/SearchBar';
import { Screens, HeaderType } from '../enums/Enums';
import { HeaderBar } from '../components/HeaderBar';
import { Strings } from '../data/Strings';
import { DataListContext } from '../contexts/DataListContext';
import RealmContext from '../database/configDB';
import { useState } from 'react';
import { colors } from '../theme/style';

export const ExerciseListScreen = () => {

    const initialData = RealmContext.useQuery(BaseExercise).sorted('level', false);
    const [Data, setData] = useState(RealmContext.useQuery(BaseExercise).sorted('level', false));
    const [Order, setOrder] = useState(false);

    const sortDescendant = () => {
        setData(Data.sorted('level',false));
        setOrder(false);
    }
    
    const sortAscendant = () => {
        setData(Data.sorted('level',true));
        setOrder(true);
    }

    function searchByName (name:string)  {
        
        setData(initialData.filtered("name BEGINSWITH[c] '"+name+"'").sorted('level',Order));
    
    }

    const renderItem = ( item:BaseExercise ) => {
        return <BaseExerciseItem baseExercise={item} key={item.uid.toString()}/>
    }
    
    return (
        <>
            <HeaderBar
                text={Strings.exercises}
                headerType={HeaderType.Navigation}
            />
           
           <FlatList
                showsVerticalScrollIndicator={false}
                data={Data}
                keyExtractor={item => item.uid.toString()}
                renderItem={({ item }) => renderItem(item)} 
                style={{backgroundColor:colors.backgroundGrey}}
            />
            <DataListContext.Provider value = {{
                sortDescendant, sortAscendant, searchByName
            }}>
                <SearchBar screen={Screens.ExerciseListScreen} />
            </DataListContext.Provider>
            
        </>
    )
}
