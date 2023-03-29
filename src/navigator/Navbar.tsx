import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import React, { useEffect } from 'react'
import { ExerciseListScreen } from '../screens/ExerciseListScreen';
import { WorkoutListScreen } from '../screens/WorkoutListScreen';
import { UserWorkoutHistoryScreen } from '../screens/UserWorkoutHistoryScreen';
import { SettingsScreen } from '../screens/SettingsScreen';
import { colors } from '../theme/style';
import { Strings } from '../data/Strings';
import Icon from 'react-native-vector-icons/MaterialIcons';
import CIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import { Alert, BackHandler } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export type RootStackParamsNav = {
    navigate(arg0: string): unknown;
    WorkoutListScreen: undefined;
    UserWorkoutHistoryScreen: undefined;
    ExerciseListScreen: undefined;
    SettingsScreen:undefined;
  }

const Tab = createMaterialBottomTabNavigator<RootStackParamsNav>();


const Navbar = () => {
    const navigation = useNavigation();
    useEffect(
        () =>
          navigation.addListener('beforeRemove', (e) => {
    
            e.preventDefault();
            
            Alert.alert(
                Strings.leftMsg,
                "",
                [
                  {
                    text: Strings.cancel,
                    style: "cancel"
                  },
                  { text: Strings.acept, onPress: () => BackHandler.exitApp() }
                ]
              );
              
          }),[navigation]
    );

    return (
            <Tab.Navigator
                initialRouteName="WorkoutListScreen"
                activeColor={colors.primary}
                inactiveColor={colors.lightBlack}
                barStyle={{ backgroundColor: colors.white }}
            >
                <Tab.Screen 
                    name='WorkoutListScreen' 
                    options={{
                        title: Strings.tab1,
                        tabBarIcon: ({color}) => (
                            <CIcon name="clipboard-list" color={color} size={24} />
                        ),
                        
                    }}
                    component={WorkoutListScreen} 
                />
                <Tab.Screen 
                    name='UserWorkoutHistoryScreen'
                    options={{
                        title: Strings.tab3,
                        tabBarIcon: ({color}) => (
                            <CIcon name="clipboard-clock" color={color} size={24} />
                            ),
                        }}
                    component={UserWorkoutHistoryScreen} 
                />
                <Tab.Screen
                    name='ExerciseListScreen'
                    options={{
                        title: Strings.tab2,
                        tabBarIcon: ({color}) => (
                            <CIcon name="arm-flex" color={color} size={24} />
                        ),
                    }}
                    component={ExerciseListScreen} 
                />
                <Tab.Screen 
                    name='SettingsScreen'
                    options={{
                        title: Strings.tab4,
                        tabBarIcon: ({color}) => (
                            <Icon name="settings" color={color} size={24} />
                        ),
                    }} 
                    component={SettingsScreen} 
                />
            </Tab.Navigator>
    )
}

export default Navbar;