
import * as React from 'react';
import {createStaticNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Splash from './screens/Splash';
import Login from './screens/Login';
import TaskList from './screens/TaskList';
import TaskDetails from './screens/TaskDetails';

const RootStack = createNativeStackNavigator({
  screens: {
    Splash: {
      screen: Splash,
      options: {headerShown:false},
    },
    Login: {
      screen: Login,
      options: {headerShown:false},
    },
    TaskList: { 
      screen: TaskList,
      options: {
        headerLeft:()=>null,
        headerBackVisible: false, 
        title:'Dashbord'
      }
    },
    TaskDetails: { screen: TaskDetails},
  },
});
   
const Navigation = createStaticNavigation(RootStack);

export default function Main() {
  return <Navigation />;
}