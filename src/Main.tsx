
import * as React from 'react';
import {createStaticNavigation} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Splash from './screens/Splash';
import Login from './screens/Login';
import AddProduct from './screens/AddProduct';
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
    AddProduct: { screen: AddProduct},
    ProductList: { screen: ProductList},
    ProductDetails: { screen: ProductDetails},
  },
});

const Navigation = createStaticNavigation(RootStack);

export default function Main() {
  return <Navigation />;
}