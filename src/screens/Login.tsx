// Authentication:
// • Implement a login screen using a mock API.
// • Refer https://dummyjson.com/docs/auth for login API (Use -
// https://dummyjson.com/auth/login)
// • If login is successful, navigate to the dashboard. If unsuccessful, show
// an error message.

import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import ExitAppHandler from '../hooks/ExitAppHandler';
import apiManager from '../services/APIManager';
import { ApiError, LoginCredentials, UserData } from '../types';
import { LoginAPI } from '../utils/constant';
import { useAppNavigation } from '../navigation/types';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const Login = () => {
  
  const navigation = useAppNavigation();

  const [userName, setUserName] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [users, setUsers] = useState<UserData>(Object);

  useEffect(() => {}, []);

  async function loginUser(loginData: LoginCredentials) {
    console.log('Attempting to log in...');
    try {
      // 1. Call the post method, specifying the return type as UserData
      const userData: UserData = await apiManager.post<UserData>(
        LoginAPI,
        loginData,
      );

      // 2. Success handling
      console.log('Login Successful! 🎉');
      console.log('User ID:', userData.id);
      console.log(
        'Access Token:',
        userData.accessToken.substring(0, 20) + '...',
      );
      console.log('Full User Data:', userData);

      // You would typically save the tokens here (e.g., to AsyncStorage or state)
    } catch (error) {
      // 3. Error handling
      const apiError = error as ApiError; // Cast to your custom error type
      console.error('Login Failed! ❌');
      console.error('Status Code:', apiError.statusCode);
      console.error('Error Message:', apiError.message);
      // You can use apiError.data for detailed error response handling
    }
  }

  // const loginData: LoginCredentials = {
  //   username: 'emilys',
  //   password: 'emilyspass',
  //   expiresInMins: 30, // optional
  // };
  // loginUser(loginData);

  return (
    <SafeAreaProvider style={{padding:10}}>
      <Text style={{margin:20,fontSize:30}}>Login</Text>
      <TextInput
        style={styles.input}
        // placeholder={t('login.password')}
        value={userName}
        onChangeText={setUserName}
      />
      <TextInput
        style={styles.input}
        // placeholder={t('login.password')}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button
        onPress={() => {
          navigation.navigate('ProductList');
        }}
        title="SignIn"
      />
      <ExitAppHandler />
    </SafeAreaProvider>
  );
};

export default Login;

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
});
