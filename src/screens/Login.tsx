import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import apiManager from '../services/APIManager';
import { ApiError, LoginCredentials, UserData } from '../types';
import { LoginAPI, LOGINUSER } from '../utils/constant';
import { useAppNavigation } from '../navigation/types';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loading from '../components/Loading';
import ExitAppHandler from '../hooks/ExitAppHandler';

const Login: React.FC = () => {
  const navigation = useAppNavigation();

  const [userName, setUserName] = useState<string>(
    // ''
    "emilys"
  );
  const [password, setPassword] = useState<string>(
    // ''
    'emilyspass'
  );

  const [errorMassage, setErrorMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    setErrorMessage('');
  }, [userName, password]);

  function handleUserLogin() {
    const loginData: LoginCredentials = {
      username: userName.trim(),
      password: password.trim(),
      expiresInMins: 30, // optional
    };
    setIsLoading(true);
    loginUser(loginData);
  }

  async function loginUser(loginData: LoginCredentials) {
    try {
      const userData: UserData = await apiManager.post<UserData>(
        LoginAPI,
        loginData,
      );
      setIsLoading(false);
      await AsyncStorage.setItem(LOGINUSER, JSON.stringify(userData));
      navigation.navigate('TaskList');
    } catch (error) {
      setIsLoading(false);
      const apiError = error as ApiError;
      setErrorMessage(`Login Failed! \n ${apiError.message}`);
    }
  }

  return (
    <SafeAreaProvider style={{ padding: 10 }}>
      <Text style={{ margin: 20, fontSize: 30 }}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder={'Enter User Name * (eg.emilys)'}
        value={userName}
        onChangeText={setUserName}
      />
      <TextInput
        style={styles.input}
        placeholder={'Enter Password *'}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <Button
        onPress={() => {
          if (userName != '' && password != '') handleUserLogin();
          else setErrorMessage(`Id and password are required`);
        }}
        title="SignIn"
      />
      {errorMassage != '' && (
        <Text style={styles.errortext}>{errorMassage}</Text>
      )}
      <Loading isLoading={isLoading} />
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
  errortext: {
    color: '#c21616ff',
    textAlign: 'center',
    marginTop: 10,
  },
});
