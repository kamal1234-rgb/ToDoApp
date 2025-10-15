
import * as React from 'react';
import {createStaticNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Splash from './screens/Splash';
import Login from './screens/Login';
import ProductList from './screens/ProductList';
import ProductDetails from './screens/ProductDetails';

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
    ProductList: { 
      screen: ProductList,
      options: {
        headerLeft:()=>null,
        headerBackVisible: false, 
      }
    },
    ProductDetails: { screen: ProductDetails},
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function Main() {
  return <Navigation />;
}