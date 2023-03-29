import React, { useEffect, useState } from 'react';
import { FlatList, StatusBar } from 'react-native';
import { BaseWorkoutItem } from '../components/items/BaseWorkoutItem';
import { BaseWorkout } from '../database/classes/BaseWorkout';
import { SearchBar } from '../components/SearchBar';
import { Screens, HeaderType } from '../enums/Enums';
import { HeaderBar } from '../components/HeaderBar';
import { Strings } from '../data/Strings';
import SplashScreen from 'react-native-splash-screen';
import { useNavigation } from '@react-navigation/native';
import { getActualDay } from '../helpers/getActualDay';
import { RootStackParamsMain } from '../navigator/MainStack';
import { colors } from '../theme/style';
import RealmContext from '../database/configDB';
import { DataListContext } from '../contexts/DataListContext';
import { clearNotification } from '../helpers/notificactionsManager';


export const WorkoutListScreen = () => {
  StatusBar.setBackgroundColor(colors.white);
  const navigation = useNavigation<RootStackParamsMain>();

  useEffect(() => {
    
    SplashScreen.hide();
    // clearNotification();
    getActualDay().then((actualDay) =>{
      if(actualDay>30){
        navigation.navigate('EndOfTrialScreen');
      }
    });

  }, [navigation]);

  const initialData = RealmContext.useQuery(BaseWorkout).sorted('level', false);
  const [Data, setData] = useState(RealmContext.useQuery(BaseWorkout).sorted('level', false));
  const [Order, setOrder] = useState(false);

  const sortDescendant = () => {
    setData(Data.sorted('level',false));
    setOrder(false);
  }
  
  const sortAscendant = () => {
    setData(Data.sorted('level',true));
    setOrder(true);
  }

  const searchByName = (name:string) => {
    setData(initialData.filtered("name BEGINSWITH[c] '"+name+"'").sorted('level',Order));
  }
  
  const renderItem = ( item:BaseWorkout) => {
      return <BaseWorkoutItem key={item.uid.toString()} baseWorkout={item} />;
  }

  return (
      <>
        <HeaderBar
          text={Strings.routines}
          headerType={HeaderType.Navigation}
        />
        <FlatList 
            showsVerticalScrollIndicator={false}
            data={Data}
            keyExtractor={item => item.uid.toString()} 
            renderItem={({item}) => renderItem(item)}
            style={{backgroundColor:colors.backgroundGrey}}
        />
        <DataListContext.Provider value = {{
          sortDescendant, sortAscendant, searchByName
        }}>
          <SearchBar screen={Screens.WorkoutListScreen} />
        </DataListContext.Provider>
      </>
  )
}
