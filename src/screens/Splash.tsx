import {
  Button,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAppNavigation } from '../navigation/types';
import Loading from '../components/Loading';

function Splash() {

  const isDarkMode = useColorScheme() === 'dark';
  const navigation = useAppNavigation();

  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <Text>hi</Text>
      <Button
        onPress={() => {
          navigation.navigate('Login');
        }}
        title="login screen"
      />
      <Button title='AddProduct' onPress={()=>{navigation.navigate('AddProduct')}}/>
      <Button title='ProductList' onPress={()=>{navigation.navigate('ProductList')}}/>
      <Button title='ProductDetails' onPress={()=>{navigation.navigate('ProductDetails',{id:1})}}/>
      
      <Loading isLoading={false}/>

    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default Splash;
