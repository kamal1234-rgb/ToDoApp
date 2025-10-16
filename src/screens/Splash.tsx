import {
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAppNavigation } from '../navigation/types';
import Loading from '../components/Loading';
import { useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React from 'react';

const Splash: React.FC = () => {
  const isDarkMode = useColorScheme() === 'dark';
  const navigation = useAppNavigation();

  useEffect(() => {
    const loadData = async () => {
      try {
        const user = await AsyncStorage.getItem('user');
        setTimeout(function () {
          if (user) {
            navigation.navigate('TaskList');
          } else {
            navigation.navigate('Login');
          }
        }, 3000);
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={styles.container}>
        <Text style={styles.textStyle}>Splash Screen</Text>
      </View>
      <Loading isLoading={false} />
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textStyle: {
    textAlign: 'center',
    fontSize: 24,
  },
});

export default Splash;
