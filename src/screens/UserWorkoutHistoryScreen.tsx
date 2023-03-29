
import React, { FlatList, View } from 'react-native';
import { UserWorkout } from '../database/classes/UserWorkout';
import { UserWorkoutItem } from '../components/items/UserWorkoutItem';
import { SearchBar } from '../components/SearchBar';
import { Screens, HeaderType } from '../enums/Enums';
import { HeaderBar } from '../components/HeaderBar';
import { Strings } from '../data/Strings';
import RealmContext from '../database/configDB';
import { DataListContext } from '../contexts/DataListContext';
import { useState, useEffect } from 'react';
import { colors } from '../theme/style';
import { Subtitle } from '../components/Texts';
import { RectangularButton } from '../components/Buttons';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamsNav } from '../navigator/Navbar';
import { EventRegister } from 'react-native-event-listeners';

export const UserWorkoutHistoryScreen = () => {

  let deleteWorkoutListener: any;
  const realm = RealmContext.useRealm();
  const initialData = RealmContext.useQuery(UserWorkout).sorted('date', true);
  const [Data, setData] = useState(RealmContext.useQuery(UserWorkout).sorted('date', true));
  const [Order, setOrder] = useState(true);

  const navigation = useNavigation<RootStackParamsNav>();

  useEffect(() => {
    deleteWorkoutListener = EventRegister.addEventListener('deleteWorkout', (userWorkout) => {
      const workout = Data.filtered('uid == $0',userWorkout);
      realm.write(() => {
        realm.delete(workout)
      });
    });
    
  
    return () => {
      EventRegister.removeEventListener(deleteWorkoutListener);
    }
  }, [])
  
  
  const sortDescendant = () => {
    setData(Data.sorted('date',true));
    setOrder(true);
  }
  
  const sortAscendant = () => {
    setData(Data.sorted('date',false));
    setOrder(false);
  }

  const searchByName = (name:string) => {
    setData(initialData.filtered("baseWorkout.name BEGINSWITH[c] '"+name+"'").sorted('date',Order));
  }
  
  const renderItem = ( item:UserWorkout ) => {
    return <UserWorkoutItem userWorkout={item} key={item.uid.toString()}/>
  }
  
  return (
      <>
          <HeaderBar
            text={Strings.history}
            headerType={HeaderType.Navigation}
          />

          { Data.length > 0 ?

              <FlatList 
                  initialNumToRender={7}
                  showsVerticalScrollIndicator={false}
                  data={Data}
                  keyExtractor={item => item.uid.toString()} 
                  renderItem={({item}) => renderItem(item)}
                  style={{backgroundColor:colors.backgroundGrey}}
              /> 
              :
              <View style={{height: '100%', justifyContent:'center', alignItems:'center'}}>
                <Subtitle
                  text={Strings.noWorkouts}
                  style={{width:'80%', textAlign: 'center', marginBottom:'10%'}}
                />
                <RectangularButton
                  text={Strings.goToWorkouts}
                  style={{position:'absolute', bottom: '10%'}}
                  onPress={() => {navigation.navigate('WorkoutListScreen')}}
                />
              </View>
          }
          <DataListContext.Provider value = {{
            sortDescendant, sortAscendant, searchByName
          }}>
            <SearchBar screen={Screens.UserWorkoutHistoryScreen} />
          </DataListContext.Provider>
      </>
  )
}
